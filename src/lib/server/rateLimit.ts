type Entry = { hits: number[]; seen: number };

const buckets = new Map<string, Entry>();
const MAX_KEYS = 20000;

function evict() {
    if (buckets.size <= MAX_KEYS) return;
    const sorted = [...buckets.entries()].sort((a, b) => a[1].seen - b[1].seen);
    for (const [key] of sorted.slice(0, Math.ceil(sorted.length / 4))) buckets.delete(key);
}

export function allow(key: string, max: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = buckets.get(key) || { hits: [], seen: now };
    entry.hits = entry.hits.filter((t) => now - t < windowMs);
    entry.seen = now;
    if (entry.hits.length >= max) {
        buckets.set(key, entry);
        return false;
    }
    entry.hits.push(now);
    buckets.set(key, entry);
    evict();
    return true;
}

export function clientKey(req: Request): string | null {
    if (process.env.TRUST_PROXY !== '1') return null;
    const xff = req.headers.get('x-forwarded-for');
    if (!xff) return null;
    const first = xff.split(',')[0].trim();
    return first ? `ip:${first}` : null;
}
