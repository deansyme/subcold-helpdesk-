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

module.exports = nextConfig
