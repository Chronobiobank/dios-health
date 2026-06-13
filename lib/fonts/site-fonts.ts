import { DM_Mono, Inter } from 'next/font/google'

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

/** Merriweather — marketing display headings */
export const displaySerif = merriweather

/** Maven Bureau Sans — marketing UI and hero accent type */
export const displaySans = bureauSans

/** @deprecated Use `inter` — kept as alias for gradual CSS migration */
export const geistSans = inter

/** @deprecated Use `dmMono` — kept as alias for gradual CSS migration */
export const geistMono = dmMono

export const siteFontVariableClasses = `${inter.variable} ${dmMono.variable} ${displaySerif.variable} ${displaySans.variable}`
