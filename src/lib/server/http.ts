export type ReadResult<T> = { ok: true; data: T } | { ok: false; status: number; error: string };

const DEFAULT_MAX = 16 * 1024;

export async function readJson<T>(req: Request, maxBytes = DEFAULT_MAX): Promise<ReadResult<T>> {
    const declared = req.headers.get('content-length');
    if (declared && Number(declared) > maxBytes) {
        return { ok: false, status: 413, error: 'too_large' };
    }

    const body = req.body;
    if (!body) return { ok: false, status: 400, error: 'bad_json' };

    const reader = body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;

    try {
        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            if (!value) continue;
            size += value.byteLength;
            if (size > maxBytes) {
                await reader.cancel().catch(() => undefined);
                return { ok: false, status: 413, error: 'too_large' };
            }
            chunks.push(value);
        }
    } catch {
        return { ok: false, status: 400, error: 'bad_body' };
    }

    const buf = new Uint8Array(size);
    let at = 0;
    for (const c of chunks) {
        buf.set(c, at);
        at += c.byteLength;
    }

    try {
        return { ok: true, data: JSON.parse(new TextDecoder().decode(buf)) as T };
    } catch {
        return { ok: false, status: 400, error: 'bad_json' };
    }
}

export function oneLine(value: string, limit: number): string {
    return value
        .replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]+/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
        .slice(0, limit);
}

export function multiLine(value: string, limit: number): string {
    return value
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f\u2028\u2029]+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, limit);
}
