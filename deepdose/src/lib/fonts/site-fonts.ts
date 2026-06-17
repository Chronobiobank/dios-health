import { DM_Mono, Inter, Montserrat } from 'next/font/google'

import { bureauSans, merriweather } from '@/lib/fonts/maven-reference-fonts'

/** Inter — clinical UI chrome, dashboard prose, navigation */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

/** DM Mono — lab values, timestamps, identifiers, data labels */
export const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['300', '400', '500'],
})

/** Montserrat — DEEPDʘSE / DIʘS wordmark */
export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500'],
})

/** Merriweather — marketing display headings */
export const displaySerif = merriweather

/** Maven Bureau Sans — marketing UI and hero accent type */
export const displaySans = bureauSans

export const siteFontVariableClasses = `${inter.variable} ${dmMono.variable} ${montserrat.variable} ${displaySerif.variable} ${displaySans.variable}`
