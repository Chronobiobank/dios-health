import type { Metadata, Viewport } from 'next'
import { siteFontVariableClasses } from '@/lib/fonts/site-fonts'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import { DEEPDOSE_NAME, DEEPDOSE_TAGLINE } from '@/lib/brand/deepdose-brand'
import '@/styles/dios-wordmark.css'
import '@/styles/dios-tokens.css'
import '@/styles/dios-components.css'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://deepdose.org'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${DEEPDOSE_NAME} — ${DEEPDOSE_TAGLINE}`,
    template: `%s — ${DEEPDOSE_NAME}`,
  },
  description:
    'Search your meds and supplements. Dose smarter with timing aligned to your body clock — heal faster with clinician support.',
  applicationName: DEEPDOSE_NAME,
  keywords: [
    'Deepdose',
    'deep dose',
    'chronotherapy',
    'circadian rhythm',
    'medication timing',
    'chronobiobank',
    'precision dosing',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: APP_URL,
    siteName: DEEPDOSE_NAME,
    title: `${DEEPDOSE_NAME} — ${DEEPDOSE_TAGLINE}`,
    description:
      'Dose smarter, heal faster — personalised timing for medicines, light, meals, and sleep.',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${DEEPDOSE_NAME} — ${DEEPDOSE_TAGLINE}`,
    description:
      'Dose smarter, heal faster — personalised timing for medicines, light, meals, and sleep.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-GB"
      data-scroll-behavior="smooth"
      className={`${siteFontVariableClasses} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteJsonLd />
        {children}
      </body>
    </html>
  )
}
