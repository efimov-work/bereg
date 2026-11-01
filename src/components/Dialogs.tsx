'use client';

import { useEffect, useRef, useState } from 'react';
import { LEADS_ENABLED } from '@/lib/content';
import { animate, updatePageLock } from '@/lib/motion';
import RequestForm from './RequestForm';

export default function Dialogs() {
    const inquiry = useRef<HTMLDialogElement>(null);
    const policy = useRef<HTMLDialogElement>(null);
    const [interest, setInterest] = useState('Подбор недвижимости у моря');
    useEffect(() => {
        const returnFocus = new WeakMap<HTMLDialogElement, HTMLElement>();
        function open(dialog: HTMLDialogElement | null) {
            if (!dialog || dialog.open) return;
            returnFocus.set(dialog, document.activeElement as HTMLElement);
            dialog.showModal();
            updatePageLock();
            animate(
                dialog,
                [
                    { opacity: 0, transform: 'translateY(28px) scale(.98)' },
                    { opacity: 1, transform: 'none' }
                ],
                { duration: 420 }
            );
        }
        function click(event: MouseEvent) {
            if (!(event.target instanceof Element)) return;
            const trigger = event.target.closest<HTMLElement>('[data-inquiry], [data-policy]');
            if (!trigger) return;
            if (trigger.hasAttribute('data-policy')) open(policy.current);
            else {
                setInterest(trigger.dataset.inquiry || 'Подбор недвижимости у моря');
                open(inquiry.current);
            }
        }
        function close(event: Event) {
            updatePageLock();
            const target = returnFocus.get(event.currentTarget as HTMLDialogElement);
            if (target?.isConnected) target.focus();
        }
        document.addEventListener('click', click);
        const dialogs = [inquiry.current, policy.current];
        dialogs.forEach((dialog) => dialog?.addEventListener('close', close));
        return () => {
            document.removeEventListener('click', click);
            dialogs.forEach((dialog) => {
                dialog?.removeEventListener('close', close);
                dialog?.close();
            });
            updatePageLock();
        };
    }, []);
    function backdrop(event: React.MouseEvent<HTMLDialogElement>) {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom
        )
            event.currentTarget.close();
    }
    return (
        <>
            <dialog
                ref={inquiry}
                id="inquiry-dialog"
                className="inquiry-dialog"
                aria-labelledby="inquiry-title"
                onClick={backdrop}
            >
                <button className="dialog-close" aria-label="Закрыть окно" onClick={() => inquiry.current?.close()}>
                    ×
                </button>
                <h2 id="inquiry-title">
                    Подберём
                    <br />
                    <em>дом у моря.</em>
                </h2>
                <p id="inquiry-subject">{interest}</p>
                <RequestForm key={interest} id="inquiry-form" interest={interest} />
            </dialog>
            <dialog
                ref={policy}
                id="policy-dialog"
                className="policy-dialog"
                aria-labelledby="policy-title"
                onClick={backdrop}
            >
                <button className="dialog-close" aria-label="Закрыть условия" onClick={() => policy.current?.close()}>
                    ×
                </button>
                <h2 id="policy-title">Ваши данные</h2>
                {LEADS_ENABLED ? (
                    <p>
                        Имя, телефон, бюджет и пожелания используются для ответа на заявку и подбора недвижимости.
                        Политика обработки и реквизиты оператора доступны на странице политики.
                    </p>
                ) : (
                    <p>
                        Формы работают в демонстрационном режиме. Контакты и пожелания не отправляются на сервер и не
                        сохраняются в браузере. После проверки поля очищаются.
                    </p>
                )}
                <p>
                    Изображения, видео и шрифты загружаются с сайта. Настройки аналитики и обработки заявок описаны в
                    политике.
                </p>
                <a className="text-link" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/privacy/`}>
                    Политика обработки данных <span>↗</span>
                </a>
            </dialog>
        </>
    );
}
