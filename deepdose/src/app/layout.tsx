import type { Metadata } from 'next'
import { siteFontVariableClasses } from '@/lib/fonts/site-fonts'
import { SiteJsonLd } from '@/components/seo/SiteJsonLd'
import {
  DEEPDOSE_HOME_HEADLINE,
  DEEPDOSE_NAME,
  DEEPDOSE_PROMISE,
} from '@/lib/brand/deepdose-brand'
import '@/styles/dios-wordmark.css'
import '@/styles/dios-tokens.css'
import '@/styles/dios-components.css'
import './globals.css'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.unmed.net'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${DEEPDOSE_NAME} · ${DEEPDOSE_HOME_HEADLINE}`,
    template: `%s · ${DEEPDOSE_NAME}`,
  },
  description: DEEPDOSE_PROMISE,
  applicationName: DEEPDOSE_NAME,
  keywords: [
    'Deepdose',
    'Max Your Chemistry',
    'chemical phenotype',
    'circadian chemistry',
    'social network',
    'SRI',
    'chronotype',
    'body clock',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: APP_URL,
    siteName: DEEPDOSE_NAME,
    title: `${DEEPDOSE_NAME} · ${DEEPDOSE_HOME_HEADLINE}`,
    description: DEEPDOSE_PROMISE,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${DEEPDOSE_NAME} · ${DEEPDOSE_HOME_HEADLINE}`,
    description: DEEPDOSE_PROMISE,
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
