#!/usr/bin/env node

const API = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';

try {
  process.loadEnvFile('.env');
} catch {}

function need(name) {
  const value = (process.env[name] || '').trim();
  if (!value) {
    console.error(`Не задана переменная ${name}. Пропишите её в .env рядом с package.json.`);
    process.exit(1);
  }
  return value;
}

async function tg(method, body) {
  const token = need('TELEGRAM_BOT_TOKEN');
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body ?? {})
  });
  const data = await res.json();
  if (!data.ok) {
    console.error(`${method}: ${data.description || 'ошибка'}`);
    if (data.error_code === 409) {
      console.error('Мешает включённый вебхук. Снимите его: node scripts/telegram.mjs webhook-delete');
    }
    process.exit(1);
  }
  return data.result;
}

const KIND = {
  private: 'личка',
  group: 'группа',
  supergroup: 'супергруппа',
  channel: 'канал'
};

async function info() {
  const me = await tg('getMe');
  console.log(`Бот: @${me.username} (${me.first_name}), id ${me.id}`);
  console.log(`Видит сообщения группы целиком: ${me.can_read_all_group_messages ? 'да' : 'нет, только реплаи на свои'}`);
}

async function chats() {
  const updates = await tg('getUpdates', { limit: 100, allowed_updates: ['message', 'my_chat_member'] });
  const seen = new Map();

  for (const u of updates) {
    const chat = u.message?.chat || u.my_chat_member?.chat;
    if (!chat) continue;
    const thread = u.message?.message_thread_id;
    const key = `${chat.id}:${thread ?? ''}`;
    if (!seen.has(key)) seen.set(key, { chat, thread });
  }

  if (!seen.size) {
    console.log('Ни одного чата не видно.');
    console.log('Добавьте бота в группу и напишите там любое сообщение, потом повторите команду.');
    return;
  }

  console.log('Найденные чаты:\n');
  for (const { chat, thread } of seen.values()) {
    const title = chat.title || [chat.first_name, chat.last_name].filter(Boolean).join(' ');
    console.log(`  ${title || '(без названия)'}, ${KIND[chat.type] || chat.type}`);
    console.log(`  TELEGRAM_CHAT_ID=${chat.id}`);
    if (thread) console.log(`  TELEGRAM_THREAD_ID=${thread}   (тема форума)`);
    console.log('');
  }
}

async function test() {
  const chatId = need('TELEGRAM_CHAT_ID');
  const threadRaw = (process.env.TELEGRAM_THREAD_ID || '').trim();
  const sent = await tg('sendMessage', {
    chat_id: chatId,
    message_thread_id: threadRaw ? Number(threadRaw) : undefined,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    text: [
      '<b>Заявка с сайта «Берег»</b>',
      '',
      '<b>Имя:</b> Проверка связи',
      '<b>Телефон:</b> <code>+70000000000</code>',
      '<b>Бюджет:</b> -',
      '<b>Цель:</b> -',
      '<b>Интерес:</b> -',
      '',
      'Если вы видите это сообщение, заявки с сайта дойдут.'
    ].join('\n')
  });
  console.log(`Отправлено в чат ${chatId}, message_id ${sent.message_id}.`);
}

const [cmd] = process.argv.slice(2);

const commands = {
  info,
  chats,
  test,
  'webhook-delete': async () => {
    await tg('deleteWebhook', { drop_pending_updates: false });
    console.log('Вебхук снят.');
  }
};

const run = commands[cmd];
if (!run) {
  console.log('Команды: info | chats | test | webhook-delete');
  process.exit(cmd ? 1 : 0);
}

run().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
