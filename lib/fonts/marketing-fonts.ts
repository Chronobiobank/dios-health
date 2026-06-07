import { DM_Mono, DM_Sans, Lora } from 'next/font/google'

/** Lora — marketing headings and display text only */
export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

/** DM Sans — marketing body and navigation */
export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['300', '400', '500'],
})

/** DM Mono — marketing eyebrows, labels, metadata (reuses site mono variable name in scope) */
export const marketingDmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-mkt-mono',
  display: 'swap',
  weight: ['300', '400'],
})

export const marketingFontVariableClasses = `${lora.variable} ${dmSans.variable} ${marketingDmMono.variable}`
