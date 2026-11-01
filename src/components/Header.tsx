'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { CONTACTS, NAV } from '@/lib/content';
import { animate, updatePageLock } from '@/lib/motion';

export default function Header() {
    const [open, setOpen] = useState(false);
    const toggle = useRef<HTMLButtonElement>(null);
    const menu = useRef<HTMLDivElement>(null);
    useEffect(() => {
        document.querySelectorAll<HTMLElement>('main, footer').forEach((el) => {
            el.inert = open;
        });
        updatePageLock();
        if (open) {
            menu.current?.querySelectorAll('a').forEach((link, index) =>
                animate(
                    link,
                    [
                        { opacity: 0, transform: 'translateY(20px)' },
                        { opacity: 1, transform: 'none' }
                    ],
                    { duration: 420, delay: index * 55, fill: 'backwards' }
                )
            );
            menu.current?.querySelector('a')?.focus();
        }
        return () => {
            document.querySelectorAll<HTMLElement>('main, footer').forEach((el) => {
                el.inert = false;
            });
            document.body.classList.remove('locked');
        };
    }, [open]);
    useEffect(() => {
        const desktop = matchMedia('(min-width: 1001px)');
        const resize = () => {
            if (desktop.matches) setOpen(false);
        };
        desktop.addEventListener('change', resize);
        return () => desktop.removeEventListener('change', resize);
    }, []);
    function onKeyDown(event: React.KeyboardEvent) {
        if (!open) return;
        if (event.key === 'Escape') {
            setOpen(false);
            toggle.current?.focus();
        }
        if (event.key !== 'Tab') return;
        const links = menu.current?.querySelectorAll('a');
        const last = links?.[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            toggle.current?.focus();
        }
        if (event.shiftKey && document.activeElement === toggle.current) {
            event.preventDefault();
            last?.focus();
        }
    }
    const phone = CONTACTS.phoneHref || `tel:${CONTACTS.phone.replace(/[^+\d]/g, '')}`;
    return (
        <div className="header-wrap" onKeyDown={onKeyDown}>
            <header className={`header${open ? ' menu-open' : ''}`} id="header">
                <a className="brand" href="#top" aria-label="Берег, на главную">
                    <img
                        className="brand-logo"
                        src={asset('/assets/brand/bereg-logo.png')}
                        alt="Берег"
                        width="2081"
                        height="756"
                        decoding="async"
                    />
                    <span className="brand-sub">Недвижимость у моря</span>
                </a>
                <nav className="desktop-nav" aria-label="Основная навигация">
                    {NAV.map((item) => (
                        <a key={item.href} href={item.href}>
                            {item.label}
                        </a>
                    ))}
                </nav>
                <a className="header-cta" href={CONTACTS.phone ? phone : '#contact'}>
                    {CONTACTS.phone ? 'Позвонить риэлтору' : 'Связаться с риэлтором'} <span>↗</span>
                </a>
                <button
                    ref={toggle}
                    className="menu-toggle"
                    aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
                    aria-expanded={open}
                    aria-controls="mobile-menu"
                    onClick={() => setOpen(!open)}
                >
                    <span />
                    <span />
                </button>
            </header>
            <div ref={menu} className="mobile-menu" id="mobile-menu" hidden={!open}>
                <nav aria-label="Мобильная навигация">
                    {[...NAV, { href: '#contact', label: 'Контакты' }].map((item) => (
                        <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                            {item.label}
                        </a>
                    ))}
                </nav>
            </div>
        </div>
    );
}
