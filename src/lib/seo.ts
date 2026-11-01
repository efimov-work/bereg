import { asset, BASE_PATH } from './asset';
import { CONTACTS, GALLERY } from './content';

export const DEFAULT_SITE_URL = 'http://localhost:3000';
export const SITE_NAME = 'Берег';
export const TITLE = 'Берег: подбор недвижимости у моря для жизни и отдыха';
export const DESCRIPTION =
    'Подбор недвижимости у моря под ваш бюджет. Помощь риэлтора в выборе района, сравнении предложений, организации просмотров и сопровождении покупки.';
export const KEYWORDS = [
    'Берег',
    'недвижимость у моря',
    'подбор недвижимости',
    'дом у моря',
    'риэлтор у моря',
    'купить недвижимость у моря'
];
export const YANDEX_VERIFICATION = process.env.YANDEX_VERIFICATION || undefined;
export const GOOGLE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION || undefined;
export const CLEAN_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'yclid',
    'ysclid',
    'gclid',
    'fbclid',
    'from',
    'etext'
];

function configuredOrigin(): string | null {
    try {
        const url = new URL((process.env.NEXT_PUBLIC_SITE_URL || '').trim());
        return ['http:', 'https:'].includes(url.protocol) ? url.origin : null;
    } catch {
        return null;
    }
}

export const NOINDEX = process.env.SITE_NOINDEX === '1' || !configuredOrigin();
export function siteOrigin(): string {
    return configuredOrigin() || DEFAULT_SITE_URL;
}
export function siteUrl(): string {
    return `${siteOrigin()}${BASE_PATH}`;
}
export function absolute(path: string): string {
    return `${siteOrigin()}${asset(path)}`;
}
export function pageImages() {
    return [
        {
            image: '/assets/images/00_coastal_sequence-poster.jpg',
            alt: 'Концептуальный вид резиденций на морском побережье'
        },
        { image: '/assets/images/02_architecture_detail-poster.jpg', alt: 'Визуализация фасада и открытых террас' },
        ...GALLERY
    ].map((item) => ({ url: absolute(item.image), caption: item.alt }));
}

export function buildJsonLd(): Record<string, unknown> {
    const url = `${siteUrl()}/`;
    const agent = `${url}#agent`;
    const telephone = CONTACTS.phone ? (CONTACTS.phoneHref || `tel:${CONTACTS.phone}`).replace('tel:', '') : undefined;
    return {
        '@context': 'https://schema.org',
        '@graph': [
            { '@type': 'WebSite', '@id': `${url}#website`, url, name: SITE_NAME, inLanguage: 'ru-RU' },
            {
                '@type': 'WebPage',
                '@id': `${url}#webpage`,
                url,
                name: TITLE,
                description: DESCRIPTION,
                inLanguage: 'ru-RU',
                isPartOf: { '@id': `${url}#website` },
                about: { '@id': agent },
                primaryImageOfPage: {
                    '@type': 'ImageObject',
                    url: absolute('/opengraph-image.jpg'),
                    caption: 'Концептуальная визуализация недвижимости у моря'
                }
            },
            {
                '@type': 'RealEstateAgent',
                '@id': agent,
                name: CONTACTS.name || SITE_NAME,
                url,
                description: DESCRIPTION,
                telephone,
                email: CONTACTS.email || undefined,
                logo: absolute('/assets/brand/bereg-logo.png'),
                sameAs: [CONTACTS.telegram, CONTACTS.max].filter(Boolean),
                image: pageImages().map((item) => ({ '@type': 'ImageObject', url: item.url, caption: item.caption }))
            },
            {
                '@type': 'Service',
                '@id': `${url}#selection`,
                name: 'Подбор недвижимости у моря',
                serviceType: 'Подбор и сопровождение покупки недвижимости',
                provider: { '@id': agent },
                url,
                description: DESCRIPTION
            }
        ]
    };
}
