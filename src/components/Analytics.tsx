'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { reachGoal, YM_ID } from '@/lib/metrika';

const TAG = 'https://mc.yandex.ru/metrika/tag.js';

export default function Analytics() {
    useEffect(() => {
        if (YM_ID === null) return;
        const onClick = (e: MouseEvent) => {
            if (e.target instanceof Element && e.target.closest('a[href^="tel:"]')) reachGoal('phone');
        };
        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, []);

    if (YM_ID === null) return null;

    return (
        <>
            <Script id="ym" strategy="afterInteractive">
                {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<e.scripts.length;j++){if(e.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","${TAG}","ym");ym(${YM_ID},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});`}
            </Script>
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${YM_ID}`}
                        style={{ position: 'absolute', left: -9999 }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
}
