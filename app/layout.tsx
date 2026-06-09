import type { Metadata, Viewport } from 'next'

import { inter, siteFontVariableClasses } from '@/lib/fonts/site-fonts'

import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloq.health')

export const metadata: Metadata = {
  title: 'Dose Intelligence · DIOS',
  description:
    'Your medication has a biological window. DIOS finds it — chronotherapy made simple for patients and clinicians.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DIOS',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  openGraph: {
    title: 'Dose Intelligence · dios.health',
    description:
      'Make Time Count. Scan your body clock, time your meds, and track progress with dose intelligence.',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dose Intelligence · dios.health',
    description:
      'Your medication has a biological window. DIOS finds it.',
  },
}

export const viewport: Viewport = {
  themeColor: '#F7FAFC',
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
