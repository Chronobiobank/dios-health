import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/vaya', destination: '/dashboard/coach', permanent: true },
      { source: '/mel', destination: '/dashboard/coach', permanent: true },
      { source: '/dashboard/vaya', destination: '/dashboard/coach', permanent: true },
      { source: '/dashboard/mel', destination: '/dashboard/coach', permanent: true },
      { source: '/dashboard/timebot', destination: '/dashboard/coach', permanent: true },
      { source: '/api/vaya/:path*', destination: '/api/coach/:path*', permanent: false },
      { source: '/api/mel/:path*', destination: '/api/coach/:path*', permanent: false },
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
        source: '/dashboard/coach',
        headers: [{ key: 'Permissions-Policy', value: 'camera=self' }],
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
