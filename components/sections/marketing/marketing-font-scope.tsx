'use client'

import { useEffect } from 'react'

import { marketingFontVariableClasses } from '@/lib/fonts/marketing-fonts'
import { cn } from '@/lib/utils'

type MarketingFontScopeProps = {
  children: React.ReactNode
  className?: string
}

/** Activates marketing typography scope for landing pages without changing dashboard fonts. */
export function MarketingFontScope({ children, className }: MarketingFontScopeProps) {
  useEffect(() => {
    document.documentElement.classList.add('marketing-v2-active')
    return () => {
      document.documentElement.classList.remove('marketing-v2-active')
    }
  }, [])

  return (
    <div className={cn('marketing-v2-root', marketingFontVariableClasses, className)}>
      {children}
    </div>
  )
}
