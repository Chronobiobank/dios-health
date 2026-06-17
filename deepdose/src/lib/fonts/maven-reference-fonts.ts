import { Merriweather } from 'next/font/google'
import localFont from 'next/font/local'

/** Display serif — Merriweather (matches dios.health site-fonts). */
export const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
})

/** Maven Bureau Sans — marketing UI and hero accent type (local woff2 from dios.health). */
export const bureauSans = localFont({
  src: [
    {
      path: '../../../public/fonts/maven/b270d9bffde2d717-s.p.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/maven/6046a7451f489d56-s.p.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../public/fonts/maven/1bc7966f5ff73ff5-s.p.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-bureau-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})
