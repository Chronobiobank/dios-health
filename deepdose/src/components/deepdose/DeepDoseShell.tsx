import type { ReactNode } from 'react'

import { DarkAmbientBackground } from '@/components/deepdose/DarkAmbientBackground'
import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'

type DeepDoseShellProps = {
  children: ReactNode
  variant?: 'dark' | 'light'
  nav?: ReactNode
}

export function DeepDoseShell({ children, variant = 'light', nav }: DeepDoseShellProps) {
  const isDark = variant === 'dark'
  const showDefaultNav = nav === undefined

  return (
    <div
      data-clinical-layout
      className={
        isDark
          ? 'clinical-layout deepdose-shell seco-shell--dark'
          : 'clinical-layout deepdose-shell'
      }
    >
      {isDark ? <DarkAmbientBackground /> : null}
      {showDefaultNav ? <DeepDoseSiteNav /> : nav}
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
