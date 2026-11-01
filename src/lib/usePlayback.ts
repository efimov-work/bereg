'use client';

import { useEffect, useState } from 'react';

export function usePlayback() {
    const [allowed, setAllowed] = useState(false);
    useEffect(() => {
        const media = matchMedia('(prefers-reduced-motion: reduce)');
        const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
        const update = () =>
            setAllowed(
                !media.matches &&
                    !connection?.saveData &&
                    !document.hidden &&
                    !document.body.classList.contains('locked')
            );
        const observer = new MutationObserver(update);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        media.addEventListener('change', update);
        document.addEventListener('visibilitychange', update);
        connection?.addEventListener('change', update);
        update();
        return () => {
            observer.disconnect();
            media.removeEventListener('change', update);
            document.removeEventListener('visibilitychange', update);
            connection?.removeEventListener('change', update);
        };
    }, []);
    return allowed;
}
