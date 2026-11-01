import type { MetadataRoute } from 'next';
import { asset } from '@/lib/asset';
import { DESCRIPTION, SITE_NAME } from '@/lib/seo';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Берег: недвижимость у моря',
        short_name: SITE_NAME,
        description: DESCRIPTION,
        lang: 'ru',
        start_url: asset('/'),
        display: 'standalone',
        background_color: '#f5f1e9',
        theme_color: '#173f43',
        icons: [{ src: asset('/icon.svg'), sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
    };
}
