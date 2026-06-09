import type { Metadata, Viewport } from 'next'

import { CLOQ_DESCRIPTOR, CLOQ_TAGLINE } from '@/lib/brand/cloq-health'
import { CORPORATE_LANDING_META } from '@/lib/pitch/corporate-landing-content'
import { inter, siteFontVariableClasses } from '@/lib/fonts/site-fonts'

import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloq.health')

export const metadata: Metadata = {
  title: CORPORATE_LANDING_META.title,
  description: CORPORATE_LANDING_META.description,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CLOQ',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  openGraph: {
    title: CORPORATE_LANDING_META.openGraphTitle,
    description: CORPORATE_LANDING_META.openGraphDescription,
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: CLOQ_DESCRIPTOR,
    description: `${CORPORATE_LANDING_META.openGraphDescription} ${CLOQ_TAGLINE}.`,
  },
}

export const viewport: Viewport = {
  themeColor: '#523b50',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      className={`${siteFontVariableClasses} dios-legible h-full scroll-pt-[calc(var(--dios-site-nav-height)+1rem)]`}
    >
      <body className={`${inter.className} flex min-h-full flex-col antialiased`}>{children}</body>
    </html>
  )
}
