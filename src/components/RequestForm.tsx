'use client';

import { useId } from 'react';
import { isPhone } from '@/lib/contact';
import { LEADS_ENABLED } from '@/lib/content';
import { useLead } from '@/lib/useLead';

type Props = { id: string; interest?: string };

export default function RequestForm({ id, interest = 'Подбор недвижимости у моря' }: Props) {
    const { status, message, send } = useLead();
    const statusId = useId();
    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const name = form.elements.namedItem('name') as HTMLInputElement;
        const phone = form.elements.namedItem('phone') as HTMLInputElement;
        name.setCustomValidity(name.value.trim() ? '' : 'Укажите ваше имя.');
        phone.setCustomValidity(isPhone(phone.value) ? '' : 'Укажите номер телефона полностью.');
        if (!form.reportValidity()) return;
        const data = new FormData(form);
        const value = (key: string) => String(data.get(key) || '');
        if (
            await send({
                name: value('name'),
                phone: value('phone'),
                budget: value('budget'),
                preferences: value('preferences'),
                website: value('website'),
                interest,
                consent: data.get('consent') === 'on'
            })
        )
            form.reset();
    }
    return (
        <form id={id} className="lead-form" onSubmit={submit} aria-describedby={statusId}>
            <label>
                Как к вам обращаться
                <input
                    name="name"
                    autoComplete="given-name"
                    placeholder="Ваше имя"
                    required
                    maxLength={80}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                />
            </label>
            <label>
                Бюджет покупки
                <input name="budget" placeholder="Например, до 20 млн ₽" maxLength={80} />
            </label>
            <label>
                Где и что вы ищете
                <input name="preferences" placeholder="Район, комнаты, вид на море" maxLength={300} />
            </label>
            <label>
                Номер телефона
                <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (___) ___-__-__"
                    required
                    minLength={10}
                    maxLength={25}
                    onInput={(e) => e.currentTarget.setCustomValidity('')}
                />
            </label>
            <label className="honeypot" aria-hidden="true">
                Сайт
                <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="consent">
                <input type="checkbox" name="consent" required />
                <span>
                    Я согласен с{' '}
                    <button type="button" data-policy>
                        условиями обработки персональных данных
                    </button>
                </span>
            </label>
            <button type="submit" className="button button-dark" disabled={status === 'sending'}>
                {status === 'sending' ? 'Отправляем…' : 'Обсудить подбор'} <span>↗</span>
            </button>
            {!LEADS_ENABLED && <p className="form-note">Демо-форма: данные никуда не отправляются.</p>}
            <p className="form-status" id={statusId} role="status" aria-live="polite">
                {message}
            </p>
        </form>
    );
}
