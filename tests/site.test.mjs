import assert from 'node:assert/strict';
import test from 'node:test';

const base = (process.env.TEST_SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

async function get(path) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    return response;
}

test('main content and buyer forms are present in server HTML', async () => {
    const html = await (await get('/')).text();
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.match(html, /Подобрать недвижимость/);
    for (const field of ['name', 'phone', 'budget', 'preferences', 'consent'])
        assert.match(html, new RegExp(`name="${field}"`));
    assert.doesNotMatch(html, /name="agency"|Партнёрский отдел/);
    assert.match(html, /<html[^>]*lang="ru"/);
});

test('SEO metadata and structured data describe the realtor', async () => {
    const html = await (await get('/')).text();
    for (const pattern of [
        /rel="canonical"/,
        /name="description"/,
        /property="og:title"/,
        /property="og:image"/,
        /name="twitter:card"/,
        /name="viewport"/
    ])
        assert.match(html, pattern);
    const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(match, 'JSON-LD');
    const data = JSON.parse(match[1]);
    const types = data['@graph'].map((item) => item['@type']);
    assert.deepEqual(types, ['WebSite', 'WebPage', 'RealEstateAgent', 'Service']);
    const agent = data['@graph'].find((item) => item['@type'] === 'RealEstateAgent');
    assert.equal(agent.address, undefined);
    assert.equal(agent.offers, undefined);
    const canonical = html.match(/rel="canonical" href="([^"]+)"/)[1];
    assert.equal(new URL(data['@graph'][1].url).href, new URL(canonical).href);
});

test('crawler files and metadata assets are available', async () => {
    const robots = await (await get('/robots.txt')).text();
    assert.match(robots, /Sitemap:/);
    assert.match(robots, /Clean-param:.*utm_source/);
    const sitemap = await (await get('/sitemap.xml')).text();
    assert.match(sitemap, /<loc>https?:\/\//);
    assert.match(sitemap, /image:loc/);
    const manifest = await (await get('/manifest.webmanifest')).json();
    assert.equal(manifest.lang, 'ru');
    await get('/icon.svg');
    assert.match((await get('/opengraph-image.jpg')).headers.get('content-type'), /image/);
});

test('policy draft is readable and excluded from indexing', async () => {
    const html = await (await get('/privacy/')).text();
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /демонстрационном режиме/);
});

test('lead intake is disabled in the default template', async () => {
    if (process.env.TEST_LEADS_ENABLED === '1') return;
    const response = await fetch(`${base}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}'
    });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'not_configured');
});
