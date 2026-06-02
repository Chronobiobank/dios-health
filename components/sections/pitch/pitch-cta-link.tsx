'use client'

import Link from 'next/link'
import { useLinkStatus } from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

function PitchCtaContent({ children }: { children: ReactNode }) {
  const { pending } = useLinkStatus()

  return (
    <span className={cn('inline-flex items-center gap-1', pending && 'opacity-65')}>
      {children}
      {pending ? (
        <span className="sr-only">Loading</span>
      ) : null}
    </span>
  )
}

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
    <Link href={href} prefetch className={cn(className, 'touch-manipulation')}>
      <PitchCtaContent>{children}</PitchCtaContent>
    </Link>
  )
}
