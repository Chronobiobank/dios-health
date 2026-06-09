import type { ReactNode } from 'react'

import { dmSans, marketingDmMono, marketingSerif } from '@/lib/fonts/marketing-fonts'

import './globals.css'

type MarketingLayoutProps = {
  children: ReactNode
}

/** Marketing route group — Lora / DM Sans / DM Mono scoped to public landing pages only. */
export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div
      className={`${marketingSerif.variable} ${dmSans.variable} ${marketingDmMono.variable}`}
      data-marketing-layout=""
    >
      {children}
    </div>
  )
}
