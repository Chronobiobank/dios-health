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
    <main
      className={cn(
        'flex min-h-svh flex-1 flex-col justify-center bg-calm-bg px-6 py-12 text-[#fafaf7] sm:px-8',
        className
      )}
    >
      <div className="mx-auto w-full max-w-md space-y-8">
        <header className="space-y-3 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-photic-core">
            Retinomic Protocol
          </p>
          <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">{headline}</h1>
          {subtext ? (
            <p className="type-medical-dense text-sm leading-relaxed text-[rgb(250_250_247/0.6)]">
              {subtext}
            </p>
          ) : null}
        </header>
        {children}
      </div>
    </main>
  )
}
