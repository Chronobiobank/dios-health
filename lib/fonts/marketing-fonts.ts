import { DM_Mono, DM_Sans, Instrument_Serif, Unbounded } from 'next/font/google'

/** Instrument Serif — editorial display (Function Health Financier Display analogue) */
export const marketingSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
})

/** DM Sans — sharp UI body and navigation (Function Health FT Base analogue) */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

/** DM Mono — marketing eyebrows, labels, metadata (reuses site mono variable name in scope) */
export const marketingDmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mkt-mono',
  display: 'swap',
  weight: ['300', '400'],
})

/** Unbounded Light — BodycloQ logo and tag only */
export const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
  weight: ['300'],
})

export const marketingFontVariableClasses = `${marketingSerif.variable} ${dmSans.variable} ${marketingDmMono.variable} ${unbounded.variable}`
