'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { usePlayback } from '@/lib/usePlayback';

type Props = {
    className?: string;
    file: string;
    poster?: string;
    active?: boolean;
    loop?: boolean;
    onEnded?: () => void;
    onBlocked?: () => void;
};

export default function AmbientVideo({
    className = '',
    file,
    poster,
    active = true,
    loop = true,
    onEnded,
    onBlocked
}: Props) {
    const ref = useRef<HTMLVideoElement>(null);
    const [visible, setVisible] = useState(false);
    const [playing, setPlaying] = useState(false);
    const allowed = usePlayback();
    useEffect(() => {
        const video = ref.current;
        if (!video) return;
        const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
            rootMargin: '600px 0px',
            threshold: 0
        });
        observer.observe(video);
        return () => observer.disconnect();
    }, []);
    useEffect(() => {
        const video = ref.current;
        if (!video || !allowed) return;
        const warmup = () => {
            if (!video.getAttribute('src')) {
                video.src = asset(`/assets/videos/${file}`);
                video.load();
            }
        };
        const schedule: (cb: () => void) => number =
            typeof window.requestIdleCallback === 'function'
                ? (cb) => window.requestIdleCallback(cb, { timeout: 4000 })
                : (cb) => window.setTimeout(cb, 2000);
        const cancel =
            typeof window.cancelIdleCallback === 'function'
                ? (id: number) => window.cancelIdleCallback(id)
                : (id: number) => window.clearTimeout(id);
        const id = schedule(warmup);
        return () => cancel(id);
    }, [allowed, file]);
    useEffect(() => {
        const video = ref.current;
        if (!video) return;
        let cancelled = false;
        if (active && visible && allowed) {
            if (!video.getAttribute('src')) video.src = asset(`/assets/videos/${file}`);
            video
                .play()
                .then(() => {
                    if (cancelled) video.pause();
                    else setPlaying(true);
                })
                .catch(() => {
                    if (!cancelled) onBlocked?.();
                });
        } else video.pause();
        return () => {
            cancelled = true;
            video.pause();
        };
    }, [active, visible, allowed, file, onBlocked]);
    useEffect(() => {
        if (!active && ref.current) ref.current.currentTime = 0;
    }, [active]);
    return (
        <video
            ref={ref}
            className={`${className}${playing ? ' playing' : ''}`}
            data-video={file}
            muted
            loop={loop}
            playsInline
            preload="none"
            aria-hidden="true"
            poster={poster}
            onEnded={onEnded}
        />
    );
}
