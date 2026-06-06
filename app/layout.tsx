import type { Metadata, Viewport } from 'next'

import { Nav } from '@/components/sections/Nav'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import { ScrollToHash } from '@/components/sections/ScrollToHash'
import { geistSans, siteFontVariableClasses } from '@/lib/fonts/site-fonts'

import './globals.css'

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://dios-health.vercel.app'

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
      'Optimise your script. Scan your body clock, time your meds, and track progress with dose intelligence.',
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
      className={`${siteFontVariableClasses} h-full scroll-pt-[calc(var(--dios-site-nav-height)+1rem)]`}
    >
      <body className={`${geistSans.className} flex min-h-full flex-col bg-[#f7fafc]`}>
        <ScrollToHash />
        <Nav />
        <div className="dios-app-shell relative z-10 flex min-h-full flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
          <PitchFooter />
        </div>
      </body>
    </html>
  )
}
