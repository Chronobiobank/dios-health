import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      // Legacy marketing / aliases → lean consumer IA
      {
        source: '/chronobiobank',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/problem',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/about',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/partners',
        destination: '/mission',
        permanent: true,
      },
      {
        source: '/evidence',
        destination: '/science',
        permanent: true,
      },
      {
        source: '/research',
        destination: '/science',
        permanent: true,
      },
      {
        source: '/foundation',
        destination: '/science',
        permanent: true,
      },
      {
        source: '/home-test',
        destination: '/testkit',
        permanent: true,
      },
      {
        source: '/pricing',
        destination: '/membership',
        permanent: true,
      },
      {
        source: '/patient-landing',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/patient-landing/:path*',
        destination: '/profile/:path*',
        permanent: true,
      },
      {
        source: '/doses',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/risk',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/check',
        destination: '/',
        permanent: true,
      },
      {
        source: '/consent',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/dose-dash-preview',
        destination: '/dosage',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/connect',
        permanent: true,
      },
      {
        source: '/patient/dashboard',
        destination: '/dosage',
        permanent: true,
      },
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
};

export default nextConfig;
