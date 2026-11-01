const RAW = (process.env.NEXT_PUBLIC_YM_ID || '').trim();

export const YM_ID = /^\d+$/.test(RAW) ? Number(RAW) : null;

type Ym = (id: number, method: string, ...args: unknown[]) => void;

export function reachGoal(goal: 'lead' | 'phone') {
    if (YM_ID === null) return;
    (window as unknown as { ym?: Ym }).ym?.(YM_ID, 'reachGoal', goal);
}
