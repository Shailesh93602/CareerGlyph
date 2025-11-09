/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'github.com',
            'avatars.githubusercontent.com',
            'linkedin.com',
            'media.licdn.com',
            's3.amazonaws.com',
        ],
    },
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        BACKEND_URL: process.env.BACKEND_URL,
    },
    async rewrites() {
        // Only add rewrites if BACKEND_URL is defined
        if (process.env.BACKEND_URL) {
            return [
                {
                    source: '/api/:path*',
                    destination: `${process.env.BACKEND_URL}/api/:path*`,
                },
            ];
        }
        return [];
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
            };
        }
        return config;
    },
};

// Bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);