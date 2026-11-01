'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { SCENES } from '@/lib/content';
import { animate } from '@/lib/motion';
import { usePlayback } from '@/lib/usePlayback';
import AmbientVideo from './AmbientVideo';

export default function Infrastructure() {
    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const panel = useRef<HTMLDivElement>(null);
    const copy = useRef<HTMLDivElement>(null);
    const remaining = useRef({ index: 0, ms: 6000 });
    const allowed = usePlayback();
    const scene = SCENES[index];
    const select = useCallback((next: number) => {
        setBlocked(false);
        setIndex(next);
    }, []);
    const next = useCallback(() => {
        if (allowed && visible) select((index + 1) % SCENES.length);
    }, [allowed, visible, index, select]);
    const onBlocked = useCallback(() => setBlocked(true), []);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15),
            { threshold: [0, 0.15] }
        );
        if (panel.current) observer.observe(panel.current);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        if (!allowed || !visible || (scene.video && !blocked)) return;
        if (remaining.current.index !== index) remaining.current = { index, ms: 6000 };
        const entry = remaining.current;
        const started = performance.now();
        const timer = setTimeout(next, entry.ms);
        return () => {
            clearTimeout(timer);
            entry.ms = Math.max(0, entry.ms - (performance.now() - started));
        };
    }, [allowed, visible, scene, blocked, next, index]);
    useEffect(() => {
        animate(copy.current, [
            { opacity: 0, transform: 'translateY(22px)' },
            { opacity: 1, transform: 'none' }
        ]);
        const tab = document.getElementById(`tab-${SCENES[index].id}`);
        const tablist = tab?.parentElement;
        if (tab && tablist && matchMedia('(max-width: 760px)').matches) {
            tablist.scrollTo({
                left: tab.offsetLeft - (tablist.firstElementChild as HTMLElement).offsetLeft,
                behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
            });
        }
    }, [index]);
    function tabKey(event: React.KeyboardEvent<HTMLButtonElement>, current: number) {
        const target =
            event.key === 'ArrowRight'
                ? (current + 1) % SCENES.length
                : event.key === 'ArrowLeft'
                  ? (current + SCENES.length - 1) % SCENES.length
                  : event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? SCENES.length - 1
                      : null;
        if (target === null) return;
        event.preventDefault();
        select(target);
        document.getElementById(`tab-${SCENES[target].id}`)?.focus();
    }
    return (
        <section className="life section-pad" id="life">
            <div className="section-heading">
                <h2>
                    Время для себя.
                    <br />
                    <em>Рядом с домом.</em>
                </h2>
            </div>
            <div className="life-tabs" role="tablist" aria-label="Инфраструктура">
                {SCENES.map((item, i) => (
                    <button
                        key={item.id}
                        id={`tab-${item.id}`}
                        className={i === index ? 'active' : ''}
                        role="tab"
                        aria-selected={i === index}
                        aria-controls="life-panel"
                        tabIndex={i === index ? 0 : -1}
                        data-scene={item.id}
                        onClick={() => select(i)}
                        onKeyDown={(e) => tabKey(e, i)}
                    >
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
            <div ref={panel} className="life-panel" id="life-panel" role="tabpanel" aria-labelledby={`tab-${scene.id}`}>
                <div className="life-panel-media">
                    {SCENES.map((item, i) => (
                        <div
                            key={item.id}
                            className={`scene-layer${i === index ? ' active' : ''}`}
                            data-layer={item.id}
                            aria-hidden={i !== index}
                        >
                            <img src={asset(item.image)} alt={item.alt} loading="lazy" />
                            {item.video && (
                                <AmbientVideo
                                    className="ambient-video"
                                    file={item.video}
                                    active={i === index}
                                    loop={false}
                                    onEnded={next}
                                    onBlocked={onBlocked}
                                />
                            )}
                        </div>
                    ))}
                    <div className="life-panel-shade" />
                </div>
                <div ref={copy} className="life-panel-copy">
                    <h3 id="life-title">{scene.title}</h3>
                    <p id="life-description">{scene.description}</p>
                </div>
            </div>
        </section>
    );
}
