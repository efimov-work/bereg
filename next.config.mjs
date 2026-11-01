const STATIC_EXPORT = process.env.STATIC_EXPORT === '1';
const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/+$/, '');

const server = {
    output: 'standalone',
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www\\.(?<host>.+)' }],
                destination: 'https://:host/:path*',
                statusCode: 301
            }
        ];
    },
    async headers() {
        return [
            {
                source: '/assets/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' }
                ]
            }
        ];
    }
};

const staticExport = {
    output: 'export',
    basePath: BASE_PATH || undefined,
    trailingSlash: true,
    images: { unoptimized: true }
};

const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    ...(STATIC_EXPORT ? staticExport : server)
};

export default nextConfig;
