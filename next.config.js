const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./src/i18n.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'subcold.com',
        pathname: '/cdn/**',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
