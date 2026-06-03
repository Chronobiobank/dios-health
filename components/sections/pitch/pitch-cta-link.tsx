'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function PitchCtaLink({
  href,
  className,
  children,
}: {
  href: string
  className: string
  children: ReactNode
}) {
  return (
    <Link href={href} prefetch className={cn(className, 'touch-manipulation inline-flex items-center gap-1')}>
      {children}
    </Link>
  )
}
