import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }],
      },
      {
        source: '/dashboard/vaya',
        headers: [{ key: 'Permissions-Policy', value: 'camera=self' }],
      },
      {
        source: '/dashboard/timebot',
        headers: [{ key: 'Permissions-Policy', value: 'camera=self' }],
      },
    ]
  },
}

export default nextConfig
