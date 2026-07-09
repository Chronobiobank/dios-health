import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async redirects() {
    return [
      {
        source: '/chronobiobank',
        destination: '/mission',
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
