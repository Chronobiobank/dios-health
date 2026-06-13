import { DM_Mono, DM_Sans, Unbounded } from 'next/font/google'

import { bureauSans, merriweather } from '@/lib/fonts/maven-reference-fonts'

/** Merriweather — display headings (site-wide) */
export const marketingSerif = merriweather

/** DM Sans — body UI where Bureau Sans is not loaded */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

/** DM Mono — marketing eyebrows, labels, metadata */
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

/** Maven Bureau Sans — hero accent / UI (gradient headline on maven.com) */
export const marketingSans = bureauSans

export const marketingFontVariableClasses = `${marketingSerif.variable} ${marketingSans.variable} ${dmSans.variable} ${marketingDmMono.variable} ${unbounded.variable}`
