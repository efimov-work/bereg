import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Analytics from '@/components/Analytics';
import {
    absolute,
    buildJsonLd,
    DESCRIPTION,
    GOOGLE_VERIFICATION,
    KEYWORDS,
    NOINDEX,
    SITE_NAME,
    siteOrigin,
    siteUrl,
    TITLE,
    YANDEX_VERIFICATION
} from '@/lib/seo';
import './globals.css';
import './responsive.css';

const manrope = localFont({
    src: '../fonts/manrope-variable.ttf',
    variable: '--font-manrope',
    weight: '400 800',
    display: 'swap'
});
const prata = localFont({ src: '../fonts/prata.ttf', variable: '--font-prata', weight: '400', display: 'swap' });

export const metadata: Metadata = {
    metadataBase: new URL(siteOrigin()),
    title: { default: TITLE, template: `%s | ${SITE_NAME}` },
    description: DESCRIPTION,
    applicationName: SITE_NAME,
    category: 'real estate',
    keywords: KEYWORDS,
    alternates: { canonical: `${siteUrl()}/` },
    formatDetection: { telephone: false, address: false, email: false },
    openGraph: {
        type: 'website',
        locale: 'ru_RU',
        url: `${siteUrl()}/`,
        siteName: SITE_NAME,
        title: TITLE,
        description: DESCRIPTION,
        images: [
            {
                url: absolute('/opengraph-image.jpg'),
                width: 1280,
                height: 712,
                alt: 'Берег. Концептуальная визуализация резиденций у моря'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: TITLE,
        description: DESCRIPTION,
        images: [absolute('/opengraph-image.jpg')]
    },
    robots: NOINDEX
        ? { index: false, follow: false }
        : {
              index: true,
              follow: true,
              googleBot: {
                  index: true,
                  follow: true,
                  'max-image-preview': 'large',
                  'max-snippet': -1,
                  'max-video-preview': -1
              }
          },
    verification: { google: GOOGLE_VERIFICATION, yandex: YANDEX_VERIFICATION }
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#173f43' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className={`${manrope.variable} ${prata.variable}`}>
            <body>
                <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
                {children}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd()).replace(/</g, '\\u003c') }}
                />
                <Analytics />
            </body>
        </html>
    );
}
