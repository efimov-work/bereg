export function phoneDigits(value: string): string {
    return value.replace(/\D/g, '');
}

export function isPhone(value: string): boolean {
    const v = value.trim();
    if (!/^[+\d\s()-]+$/.test(v)) return false;
    const d = phoneDigits(v);
    if (v.startsWith('+7') || d.startsWith('8')) return d.length === 11;
    return d.length >= 10 && d.length <= 15;
}

function isForeign(value: string): boolean {
    const v = value.trim();
    return v.startsWith('+') && v.length > 1 && v[1] !== '7';
}

export function formatPhone(value: string): string {
    if (isForeign(value)) return value.replace(/[^+\d\s()-]/g, '').slice(0, 20);

    let d = phoneDigits(value);
    if (!d) return '';
    d = (d[0] === '7' || d[0] === '8' ? '7' + d.slice(1) : '7' + d).slice(0, 11);

    let out = '+7';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length > 4) out += ') ' + d.slice(4, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    if (d.length > 9) out += '-' + d.slice(9, 11);
    return out;
}

export function nextPhone(prev: string, raw: string): string {
    if (isForeign(raw)) return formatPhone(raw);
    const erasedSeparator = raw.length < prev.length && phoneDigits(raw) === phoneDigits(prev);
    return formatPhone(erasedSeparator ? phoneDigits(raw).slice(0, -1) : raw);
}
