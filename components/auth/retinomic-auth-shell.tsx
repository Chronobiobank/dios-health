import type { ReactNode } from 'react'

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
          <p className="calm-auth-eyebrow">Retinomic Protocol</p>
          <h1 className="text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">
            {headline}
          </h1>
          {subtext ? (
            <p className="type-medical-dense text-sm leading-relaxed text-[var(--text-secondary)]">
              {subtext}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  )
}
