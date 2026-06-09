import type { Metadata, Viewport } from 'next'

import { inter, siteFontVariableClasses } from '@/lib/fonts/site-fonts'

import './globals.css'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://cloq.health')

export const metadata: Metadata = {
  title: 'CLOQ Health · BodycloQ circadian score',
  description:
    'BodycloQ is your circadian score for peak cognition. CLOQ Health — wearables in, score out, Q delivers the cues.',
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
    title: 'CLOQ Health · BodycloQ circadian score',
    description:
      'One circadian score linked to peak cognition — TipTraQ calibrates, Q protects the window.',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLOQ Health · BodycloQ circadian score',
    description:
      'BodycloQ scores circadian alignment. Q delivers daily cues. MAKE TIME COUNT.',
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
