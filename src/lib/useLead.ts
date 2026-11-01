'use client';

import { useRef, useState } from 'react';
import { asset } from './asset';
import { isPhone } from './contact';
import { LEADS_ENABLED } from './content';
import { reachGoal } from './metrika';

export type LeadFields = {
    name: string;
    phone: string;
    budget: string;
    preferences: string;
    interest: string;
    website: string;
    consent: boolean;
};

export function useLead() {
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'demo' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const pending = useRef(false);
    async function send(fields: LeadFields): Promise<boolean> {
        if (pending.current) return false;
        if (!fields.name.trim() || !isPhone(fields.phone) || !fields.consent) return false;
        if (!LEADS_ENABLED) {
            setStatus('demo');
            setMessage('Демо: данные проверены. Заявка не отправлена.');
            return true;
        }
        pending.current = true;
        setStatus('sending');
        setMessage('Отправляем заявку…');
        try {
            const response = await fetch(asset('/api/lead'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fields)
            });
            if (!response.ok)
                throw new Error(
                    response.status === 429
                        ? 'Слишком много заявок. Попробуйте позже.'
                        : 'Не удалось отправить заявку. Попробуйте ещё раз.'
                );
            setStatus('success');
            setMessage('Заявка получена. Риэлтор свяжется с вами.');
            reachGoal('lead');
            return true;
        } catch (error) {
            setStatus('error');
            setMessage(error instanceof Error ? error.message : 'Ошибка отправки. Попробуйте ещё раз.');
            return false;
        } finally {
            pending.current = false;
        }
    }
    return { status, message, send };
}
