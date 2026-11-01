const API = process.env.TELEGRAM_API_BASE || 'https://api.telegram.org';

export function telegramConfigured(): boolean {
    return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

function threadId(): number | undefined {
    const raw = (process.env.TELEGRAM_THREAD_ID || '').trim();
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isInteger(n) && n > 0 ? n : undefined;
}

export function esc(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

type Result = Record<string, unknown> | null;

async function call(method: string, body: Record<string, unknown>, attempt = 0): Promise<Result> {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) return null;

    let res: Response;
    try {
        res = await fetch(`${API}/bot${token}/${method}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(10_000)
        });
    } catch (e) {
        if (attempt === 0) return call(method, body, 1);
        console.error('telegram', method, 'network failed', e);
        return null;
    }

    const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        result?: Record<string, unknown>;
        description?: string;
        parameters?: { retry_after?: number };
    };

    if (!data.ok) {
        const retryAfter = data.parameters?.retry_after;
        if (retryAfter != null && attempt === 0 && retryAfter <= 30) {
            await new Promise((r) => setTimeout(r, (retryAfter + 1) * 1000));
            return call(method, body, 1);
        }
        console.error('telegram', method, 'failed', JSON.stringify(data).slice(0, 300));
        return null;
    }

    return data.result || null;
}

export type SendOptions = { html?: boolean };

export async function sendToOwner(text: string, opts: SendOptions = {}): Promise<number | null> {
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!chatId) return null;

    const result = await call('sendMessage', {
        chat_id: chatId,
        message_thread_id: threadId(),
        text,
        parse_mode: opts.html ? 'HTML' : undefined,
        disable_web_page_preview: true
    });

    const id = result && (result.message_id as number | undefined);
    return typeof id === 'number' ? id : null;
}
