import { CLEAN_PARAMS, NOINDEX, siteUrl } from '@/lib/seo';

export const dynamic = 'force-static';

const RULES = NOINDEX ? ['Disallow: /'] : ['Allow: /', 'Disallow: /api/'];

export function GET() {
    const url = siteUrl();
    const body = [
        'User-agent: *',
        ...RULES,
        '',
        'User-agent: Yandex',
        ...RULES,
        `Clean-param: ${CLEAN_PARAMS.join('&')}`,
        '',
        `Sitemap: ${url}/sitemap.xml`,
        ''
    ].join('\n');

    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
