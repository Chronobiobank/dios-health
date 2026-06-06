import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google'

/** Geist — body & UI */
export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

/** Instrument Serif — marketing headlines (home landing) */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

export const siteFontVariableClasses = `${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`
