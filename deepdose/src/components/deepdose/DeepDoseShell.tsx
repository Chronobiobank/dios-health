import type { ReactNode } from 'react'

import { AmbientBackground } from '@/components/deepdose/AmbientBackground'
import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'
import { cn } from '@/lib/utils/cn'

type DeepDoseShellProps = {
  children: ReactNode
  variant?: 'dark' | 'light'
  nav?: ReactNode
  className?: string
}

/** Site shell — light OpenAI grid is default; ambient orbs on every surface. */
export function DeepDoseShell({ children, variant = 'light', nav, className }: DeepDoseShellProps) {
  const isDark = variant === 'dark'
  const showDefaultNav = nav === undefined

  return (
    <div
      data-clinical-layout
      className={cn(
        'clinical-layout deepdose-shell',
        isDark ? 'seco-shell--dark' : 'seco-shell--light',
        className
      )}
    >
      <AmbientBackground tone={isDark ? 'dark' : 'light'} />
      {showDefaultNav ? <DeepDoseSiteNav /> : nav}
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
