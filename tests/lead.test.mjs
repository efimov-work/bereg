import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const messages = [];
let mock, server, directory, endpoint;
const listen = (server) => new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server.address().port)));

before(async () => {
  directory = await mkdtemp(path.join(tmpdir(), 'bereg-leads-'));
  mock = createServer(async (req, res) => {
    let body = '';
    for await (const chunk of req) body += chunk;
    messages.push(JSON.parse(body));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, result: { message_id: messages.length } }));
  });
  const telegramPort = await listen(mock);
  const reservation = createServer();
  const port = await listen(reservation);
  await new Promise((resolve) => reservation.close(resolve));
  endpoint = `http://127.0.0.1:${port}/api/lead`;
  server = spawn(process.execPath, ['.next/standalone/server.js'], {
    cwd: root,
    env: { ...process.env, HOSTNAME: '127.0.0.1', PORT: String(port), LEADS_ENABLED: '1', LEADS_DATA_DIR: directory, NEXT_PUBLIC_SITE_URL: 'https://bereg.example', TELEGRAM_API_BASE: `http://127.0.0.1:${telegramPort}`, TELEGRAM_BOT_TOKEN: 'local-test', TELEGRAM_CHAT_ID: 'local-test' },
    stdio: 'ignore'
  });
  for (let attempt = 0; attempt < 100; attempt++) {
    try { await fetch(endpoint); return; } catch { await new Promise((resolve) => setTimeout(resolve, 50)); }
  }
  throw new Error('Test server did not start. Run npm run build first.');
});

after(async () => {
  if (server && server.exitCode === null) {
    server.kill();
    await new Promise((resolve) => server.once('exit', resolve));
  }
  if (mock) await new Promise((resolve) => mock.close(resolve));
  if (directory) await rm(directory, { recursive: true, force: true });
});

const fields = { name: 'Test Buyer', phone: '+7 999 123 45 67', budget: '20 млн', preferences: '<терраса>', interest: 'Подбор у моря', consent: true };
function post(body, origin = 'https://bereg.example') {
  return fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
}

test('lead is saved and delivered to a local Telegram stub', async () => {
  assert.equal((await post(fields)).status, 200);
  const lines = (await readFile(path.join(directory, 'leads.jsonl'), 'utf8')).trim().split('\n');
  assert.equal(lines.length, 1);
  const lead = JSON.parse(lines[0]);
  assert.equal(lead.preferences, '<терраса>');
  assert.equal(lead.consent, true);
  assert.equal(messages.length, 1);
  assert.match(messages[0].text, /&lt;терраса&gt;/);
});

test('invalid fields and missing consent are rejected', async () => {
  for (const body of [{ ...fields, consent: false }, { ...fields, phone: 'invalid' }, { ...fields, name: '   ' }, [], null]) assert.equal((await post(body)).status, 400);
});

test('cross-origin and oversized submissions are rejected', async () => {
  assert.equal((await post(fields, 'https://unrelated.example')).status, 403);
  assert.equal((await post({ ...fields, preferences: 'x'.repeat(20000) })).status, 413);
});

test('honeypot does not save or forward a lead', async () => {
  const count = messages.length;
  assert.equal((await post({ ...fields, website: 'spam.example' })).status, 200);
  assert.equal(messages.length, count);
});

test('repeated submissions hit the rate limit', async () => {
  assert.equal((await post(fields)).status, 200);
  assert.equal((await post(fields)).status, 200);
  assert.equal((await post(fields)).status, 429);
  assert.equal(messages.length, 3);
});
