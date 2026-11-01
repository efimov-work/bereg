import type { MetadataRoute } from 'next';
import { pageImages, siteUrl } from '@/lib/seo';

export const dynamic = 'force-static';
const BUILT_AT = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: `${siteUrl()}/`,
            lastModified: BUILT_AT,
            changeFrequency: 'monthly',
            priority: 1,
            images: pageImages().map((image) => image.url)
        }
    ];
}
