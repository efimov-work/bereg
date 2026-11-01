'use client';

import { useEffect } from 'react';
import { animate, stopAnimations } from '@/lib/motion';

const EASE = 'cubic-bezier(.22,1,.36,1)';

type Kind = 'heading' | 'copy' | 'media' | 'card';

const GROUPS: Record<Kind, string> = {
    heading: '.hero-heading, .intro-main > h2, .section-heading, .faq-layout > h2',
    copy: '.hero-intro, .intro-copy, .architecture-copy, .location-content, .contact-copy, .life-tabs',
    media: '.hero-film, .architecture-visual, #life-panel, .location-collage, .gallery-track',
    card: '.facts > div, .purchase-grid article, .faq details, .gallery-index, .contact-form-card, .footer-top'
};

function frames(kind: Kind): Keyframe[] {
    if (kind === 'heading')
        return [
            { opacity: 0, transform: 'translateY(36px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ];
    if (kind === 'media')
        return [{ opacity: 0 }, { opacity: 1 }];
    if (kind === 'card')
        return [
            { opacity: 0, transform: 'translateY(28px)' },
            { opacity: 1, transform: 'none' }
        ];
    return [
        { opacity: 0, transform: 'translateY(16px)' },
        { opacity: 1, transform: 'none' }
    ];
}

const DURATION: Record<Kind, number> = { heading: 950, copy: 720, media: 1150, card: 820 };

function delayFor(element: Element, kind: Kind) {
    if (element.matches('.hero-intro')) return 120;
    if (element.matches('.hero-film')) return 220;
    if (kind === 'card') {
        const siblings = [...(element.parentElement?.children || [])];
        return Math.min(siblings.indexOf(element) * 90, 270);
    }
    return 0;
}

export default function Motion() {
    useEffect(() => {
        const media = matchMedia('(prefers-reduced-motion: reduce)');
        const seen = new WeakSet<Element>();
        function reveal(element: Element, kind: Kind) {
            if (seen.has(element)) return;
            seen.add(element);
            const animation = animate(element, frames(kind), {
                duration: DURATION[kind],
                delay: delayFor(element, kind),
                easing: EASE,
                fill: 'backwards'
            });
            const settle = () => {
                element.classList.add('is-revealed');
                if (element instanceof HTMLElement) element.style.willChange = '';
            };
            if (animation) animation.finished.then(settle).catch(settle);
            else settle();
            if (element.matches('.hero-film')) {
                const markReady = () => document.documentElement.classList.add('hero-film-ready');
                if (animation) animation.finished.then(markReady).catch(markReady);
                else markReady();
            }
        }
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(({ target, isIntersecting }) => {
                    if (!isIntersecting) return;
                    const kind = (Object.keys(GROUPS) as Kind[]).find((k) => target.matches(GROUPS[k]));
                    if (kind) reveal(target, kind);
                    observer.unobserve(target);
                }),
            { rootMargin: '0px 0px -48px 0px' }
        );
        (Object.keys(GROUPS) as Kind[]).forEach((kind) => {
            document.querySelectorAll(GROUPS[kind]).forEach((element) => {
                const rect = element.getBoundingClientRect();
                if (media.matches || (rect.top < innerHeight && rect.bottom > 0)) reveal(element, kind);
                else observer.observe(element);
            });
        });

        const header = document.querySelector<HTMLElement>('.header');
        const film = document.querySelector<HTMLElement>('.hero-film');
        const root = document.documentElement;
        let ticking = false;
        function onScroll() {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                ticking = false;
                const max = root.scrollHeight - innerHeight;
                root.style.setProperty('--scroll-progress', max > 0 ? String(Math.min(1, scrollY / max)) : '0');
                header?.classList.toggle('scrolled', scrollY > 24);
                if (film && !media.matches && root.classList.contains('hero-film-ready')) {
                    const rect = film.getBoundingClientRect();
                    if (rect.bottom > 0 && rect.top < innerHeight) {
                        const drift = ((rect.top + rect.height / 2 - innerHeight / 2) / innerHeight) * 28;
                        film.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`;
                    }
                }
            });
        }
        addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        const reduce = () => {
            if (media.matches) {
                stopAnimations(true);
                if (film) film.style.transform = '';
                root.style.setProperty('--scroll-progress', '0');
            }
        };
        media.addEventListener('change', reduce);

        const cleanups: (() => void)[] = [];
        document.querySelectorAll<HTMLDetailsElement>('.faq details').forEach((details) => {
            const summary = details.querySelector('summary');
            let current: Animation | undefined;
            let expanded = details.open;
            const click = (event: MouseEvent) => {
                if (media.matches) return;
                event.preventDefault();
                const start = details.getBoundingClientRect().height;
                expanded = current ? !expanded : !details.open;
                current?.cancel();
                details.open = true;
                const end = expanded
                    ? details.getBoundingClientRect().height
                    : (summary?.getBoundingClientRect().height || 0) + 2;
                details.style.overflow = 'hidden';
                const animation = animate(details, [{ height: `${start}px` }, { height: `${end}px` }], {
                    duration: 340,
                    easing: EASE
                });
                current = animation;
                if (!animation) {
                    details.open = expanded;
                    details.style.overflow = '';
                    return;
                }
                animation.finished
                    .catch(() => {})
                    .finally(() => {
                        if (current !== animation) return;
                        details.open = expanded;
                        details.style.overflow = '';
                        current = undefined;
                    });
            };
            summary?.addEventListener('click', click);
            cleanups.push(() => {
                summary?.removeEventListener('click', click);
                current?.cancel();
                details.style.overflow = '';
            });
        });
        return () => {
            observer.disconnect();
            removeEventListener('scroll', onScroll);
            media.removeEventListener('change', reduce);
            cleanups.forEach((cleanup) => cleanup());
            root.classList.remove('hero-film-ready');
            if (film) film.style.transform = '';
            stopAnimations();
        };
    }, []);
    return null;
}
