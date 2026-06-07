import { DM_Mono, Instrument_Serif, Inter } from 'next/font/google'

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

/** Instrument Serif — marketing headlines only (home, pitch, evidence landings) */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

/** @deprecated Use `inter` — kept as alias for gradual CSS migration */
export const geistSans = inter

/** @deprecated Use `dmMono` — kept as alias for gradual CSS migration */
export const geistMono = dmMono

export const siteFontVariableClasses = `${inter.variable} ${dmMono.variable} ${instrumentSerif.variable}`
