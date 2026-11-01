'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { GALLERY } from '@/lib/content';

export default function Gallery() {
    const [index, setIndex] = useState(0);
    const track = useRef<HTMLDivElement>(null);
    const scrolling = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const drag = useRef<{ x: number; left: number; id: number } | null>(null);
    useEffect(() => {
        updateProgress();
        return () => {
            if (timer.current) clearTimeout(timer.current);
        };
    }, []);
    function updateProgress() {
        const container = track.current;
        const section = container?.closest<HTMLElement>('.gallery');
        if (!container || !section) return;
        const max = container.scrollWidth - container.clientWidth;
        section.style.setProperty('--gallery-progress', max > 0 ? String(container.scrollLeft / max) : '0');
    }
    function select(next: number) {
        next = (next + GALLERY.length) % GALLERY.length;
        const container = track.current;
        if (!container) return;
        const cards = container.querySelectorAll<HTMLElement>('.gallery-item');
        setIndex(next);
        scrolling.current = true;
        container.scrollTo({
            left: Math.min(container.scrollWidth - container.clientWidth, cards[next].offsetLeft - cards[0].offsetLeft),
            behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            scrolling.current = false;
        }, 800);
    }
    function manual() {
        scrolling.current = false;
        if (timer.current) clearTimeout(timer.current);
    }
    function onScroll() {
        updateProgress();
        if (scrolling.current || !track.current) return;
        const container = track.current;
        const center = container.getBoundingClientRect().left + container.clientWidth / 2;
        const cards = [...container.querySelectorAll<HTMLElement>('.gallery-item')];
        setIndex(
            cards.reduce((best, card, i) => {
                const rect = card.getBoundingClientRect();
                const prev = cards[best].getBoundingClientRect();
                return Math.abs(rect.left + rect.width / 2 - center) < Math.abs(prev.left + prev.width / 2 - center)
                    ? i
                    : best;
            }, 0)
        );
    }
    function endDrag(event: React.PointerEvent<HTMLDivElement>) {
        if (!drag.current || drag.current.id !== event.pointerId) return;
        drag.current = null;
        event.currentTarget.style.scrollSnapType = '';
        event.currentTarget.classList.remove('dragging');
        if (event.currentTarget.hasPointerCapture(event.pointerId))
            event.currentTarget.releasePointerCapture(event.pointerId);
    }
    return (
        <section className="gallery section-pad" id="gallery">
            <div className="section-heading">
                <div>
                    <h2>
                        Представьте свой
                        <br />
                        <em>дом у моря.</em>
                    </h2>
                    <p className="media-note">Концептуальные визуализации</p>
                </div>
                <div className="gallery-controls">
                    <span id="gallery-counter">{String(index + 1).padStart(2, '0')} / 05</span>
                    <button
                        className="arrow-button"
                        id="gallery-prev"
                        aria-label="Предыдущий кадр"
                        onClick={() => select(index - 1)}
                    >
                        ←
                    </button>
                    <button
                        className="arrow-button"
                        id="gallery-next"
                        aria-label="Следующий кадр"
                        onClick={() => select(index + 1)}
                    >
                        →
                    </button>
                </div>
            </div>
            <div
                ref={track}
                className="gallery-track"
                id="gallery-track"
                tabIndex={0}
                role="region"
                aria-label="Галерея недвижимости. Используйте стрелки для переключения."
                onScroll={onScroll}
                onWheel={manual}
                onDragStart={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                        e.preventDefault();
                        select(index + (e.key === 'ArrowRight' ? 1 : -1));
                    }
                }}
                onPointerDown={(e) => {
                    manual();
                    if (e.pointerType !== 'mouse' || e.button !== 0) return;
                    drag.current = { x: e.clientX, left: e.currentTarget.scrollLeft, id: e.pointerId };
                    e.currentTarget.setPointerCapture(e.pointerId);
                    e.currentTarget.style.scrollSnapType = 'none';
                    e.currentTarget.classList.add('dragging');
                }}
                onPointerMove={(e) => {
                    if (drag.current?.id === e.pointerId)
                        e.currentTarget.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
                }}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                {GALLERY.map((item, i) => (
                    <figure key={item.image} className={`gallery-item${i === index ? ' is-selected' : ''}`}>
                        <img src={asset(item.image)} alt={item.alt} loading="lazy" />
                        <span>
                            <span>{item.title}</span>
                        </span>
                    </figure>
                ))}
            </div>
            <div className="gallery-index" role="group" aria-label="Выбрать кадр галереи">
                {GALLERY.map((item, i) => (
                    <button
                        key={item.image}
                        type="button"
                        data-gallery-index={i}
                        aria-label={`Показать: ${item.title}`}
                        aria-pressed={i === index}
                        onClick={() => select(i)}
                    >
                        <img src={asset(item.image)} alt="" loading="lazy" />
                        <span>{item.title}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
