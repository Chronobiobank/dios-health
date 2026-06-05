import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Nav } from '@/components/sections/Nav'
import { PitchLandingBackdrop, PitchShadowStyles } from '@/components/sections/pitch/pitch-backgrounds'
import { ScrollToHash } from '@/components/sections/ScrollToHash'
import './globals.css'

/** Geist — https://fonts.google.com/specimen/Geist */
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

const siteUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://dios-health.vercel.app'

export const metadata: Metadata = {
  title: 'DIOS — Dose Intelligence OS',
  description:
    'dios.health is a translational medicine engine bridging eye-clock structure, biochemistry, and environment. Retinomic Protocol — end guesswork wearables.',
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
    title: 'The End of Guesswork Wearables · dios.health',
    description:
      'DIOS computes your master-clock light dose, maps retinal structure via Siloton GiraffeOCT, titrates biochemical fuel, and verifies sleep with PranaQ TipTraQ.',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The End of Guesswork Wearables · dios.health',
    description:
      'Translational medicine engine — eye-clock, biochemistry, environment. Scan your Retinomic baseline free.',
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
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-pt-[calc(var(--dios-site-nav-height)+1rem)]`}
    >
      <body className={`${geistSans.className} flex min-h-full flex-col bg-transparent`}>
        <PitchShadowStyles />
        <PitchLandingBackdrop fixed />
        <ScrollToHash />
        <Nav />
        <div className="dios-app-shell relative z-10 flex min-h-full flex-1 flex-col">{children}</div>
      </body>
    </html>
  )
}
