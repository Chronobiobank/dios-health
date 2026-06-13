import type { NextConfig } from 'next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  // Home folder has a stray package-lock.json; pin Turbopack to this repo.
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    const legacyMarketing = [
      '/evidence',
      '/how-it-works',
      '/science',
      '/technology',
      '/tiptraq',
      '/dina',
      '/chronobiobank',
      '/circadian-digital-twin',
      '/pitch',
      '/onboarding',
      '/shop',
      '/logo',
      '/dev',
    ] as const

    const secopeuticLegacy = [
      { source: '/secopeutic', destination: '/clinicians', permanent: true },
      { source: '/secopeutic/:path*', destination: '/clinicians/:path*', permanent: true },
    ] as const

    return [
      ...secopeuticLegacy,
      ...legacyMarketing.map((source) => ({
        source,
        destination: '/',
        permanent: true,
      })),
      ...legacyMarketing.map((source) => ({
        source: `${source}/:path*`,
        destination: '/',
        permanent: true,
      })),
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
