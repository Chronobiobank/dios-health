import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Nav } from '@/components/sections/Nav'
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
  title: 'DIOS – Quantify Your Meds',
  description:
    "The world's first clinical decision support platform personalising medicine timing to individual body clock variation, not European population norms. Free for every patient. Free for every GP.",
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DIOS Coach',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
  openGraph: {
    title: 'DIOS – Quantify Your Meds',
    description:
      'Medicine timing personalised to your body clock, not European norms. Free for every patient and GP. Built on Oxford-validated chronodosing science.',
    type: 'website',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIOS – Quantify Your Meds',
    description:
      "The world's first platform personalising medicine timing to individual body clock variation. Not European population averages.",
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
      <body className={`${geistSans.className} flex min-h-full flex-col`}>
        <ScrollToHash />
        <Nav />
        <div className="dios-app-shell">{children}</div>
      </body>
    </html>
  )
}
