import { NextResponse } from 'next/server';
import { isPhone, phoneDigits } from '@/lib/contact';
import { oneLine, readJson } from '@/lib/server/http';
import { recordLead, type Lead } from '@/lib/server/leadStore';
import { allow, clientKey } from '@/lib/server/rateLimit';
import { esc, sendToOwner, telegramConfigured } from '@/lib/server/telegram';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
    name?: unknown;
    phone?: unknown;
    budget?: unknown;
    preferences?: unknown;
    interest?: unknown;
    consent?: unknown;
    website?: unknown;
};

export async function POST(req: Request) {
    if (process.env.LEADS_ENABLED !== '1')
        return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
    const origin = req.headers.get('origin');
    const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL;
    if (origin && allowedOrigin) {
    let expected: string;
    try { expected = new URL(allowedOrigin).origin; }
    catch { return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 }); }
    if (origin !== expected) return NextResponse.json({ ok: false, error: 'bad_origin' }, { status: 403 });
  }
  const parsed = await readJson<Body>(req);
    if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: parsed.status });
    const body = parsed.data;
    if (!body || typeof body !== 'object' || Array.isArray(body))
        return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
    if (typeof body.website === 'string' && body.website.trim()) return NextResponse.json({ ok: true });
    if (
        typeof body.name !== 'string' ||
        !body.name.trim() ||
        typeof body.phone !== 'string' ||
        !isPhone(body.phone) ||
        body.consent !== true
    )
        return NextResponse.json({ ok: false, error: 'bad_fields' }, { status: 400 });
    const ip = clientKey(req);
    const hour = 3_600_000;
    if (
        !allow(`lead:${phoneDigits(body.phone)}`, 3, hour) ||
        (ip && !allow(`lead-ip:${ip}`, 10, hour)) ||
        !allow('lead:global', 120, 60_000)
    )
        return NextResponse.json({ ok: false, error: 'rate_limited' }, { status: 429 });
    const field = (value: unknown, max: number) => (typeof value === 'string' ? oneLine(value, max) : '');
    const lead: Lead = {
        name: field(body.name, 80),
        phone: field(body.phone, 40),
        budget: field(body.budget, 80),
        preferences: field(body.preferences, 300),
        interest: field(body.interest, 300),
        consent: true,
        at: new Date().toISOString()
    };
    try {
        await recordLead(lead);
    } catch {
        return NextResponse.json({ ok: false, error: 'storage_failed' }, { status: 503 });
    }
    const text = [
        '<b>Заявка с сайта «Берег»</b>',
        `Имя: ${esc(lead.name)}`,
        `Телефон: ${esc(lead.phone)}`,
        `Бюджет: ${esc(lead.budget)}`,
        `Пожелания: ${esc(lead.preferences)}`,
        `Запрос: ${esc(lead.interest)}`
    ].join('\n');
    const delivered = telegramConfigured() && (await sendToOwner(text, { html: true })) !== null;
    if (!delivered) {
        try {
            await recordLead(lead, true);
        } catch {
            console.error('Unable to write undelivered lead');
        }
        console.error('Lead saved; Telegram delivery unavailable');
    }
    return NextResponse.json({ ok: true });
}
