import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/vaya', destination: '/mel', permanent: true },
      { source: '/dashboard/vaya', destination: '/dashboard/mel', permanent: true },
      { source: '/dashboard/timebot', destination: '/dashboard/mel', permanent: true },
      { source: '/api/vaya/:path*', destination: '/api/mel/:path*', permanent: false },
    ]
  },
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
        source: '/dashboard/mel',
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
