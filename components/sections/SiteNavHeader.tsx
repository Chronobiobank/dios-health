'use client'

import type { ReactNode } from 'react'

import { useNavOnDarkSurface } from '@/components/sections/use-nav-on-dark-surface'

type SiteNavHeaderProps = {
  children: ReactNode
}

export function SiteNavHeader({ children }: SiteNavHeaderProps) {
  useNavOnDarkSurface()

  return (
    <header id="site-nav" className="dios-site-nav">
      {children}
    </header>
  )
}
