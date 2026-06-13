import type { ReactNode } from 'react'

import { marketingFontVariableClasses } from '@/lib/fonts/marketing-fonts'

import './globals.css'

type MarketingLayoutProps = {
  children: ReactNode
}

/** Marketing route group — Merriweather / Bureau Sans / DM Mono scoped to public landing pages. */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className={marketingFontVariableClasses} data-marketing-layout="">
      {children}
    </div>
  )
}
