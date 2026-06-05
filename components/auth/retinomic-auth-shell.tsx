import type { ReactNode } from 'react'

import { ONBOARDING_COPY } from '@/lib/pitch/retinomic-landing-copy'
import { cn } from '@/lib/utils'

type RetinomicAuthShellProps = {
  headline: string
  subtext?: string
  children: ReactNode
  className?: string
}

export function RetinomicAuthShell({
  headline,
  subtext,
  children,
  className,
}: RetinomicAuthShellProps) {
  return (
    <main className={cn('calm-auth-shell flex flex-1 flex-col justify-center px-6 sm:px-8', className)}>
      <div className="mx-auto w-full max-w-md space-y-8">
        <header className="space-y-3 text-center">
          <p className="type-pitch-eyebrow">{ONBOARDING_COPY.eyebrow}</p>
          <h1 className="type-pitch-title">{headline}</h1>
          {subtext ? <p className="type-pitch-sub">{subtext}</p> : null}
        </header>
        {children}
      </div>
    </main>
  )
}
