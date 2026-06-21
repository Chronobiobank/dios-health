import type { ReactNode } from 'react'

import { DeepDoseSiteNav } from '@/components/deepdose/DeepDoseSiteNav'

type DeepDoseShellProps = {
  children: ReactNode
  variant?: 'dark' | 'light'
  nav?: ReactNode
}

function DarkAmbientBackground() {
  return (
    <div className="deepdose-ambient" aria-hidden>
      <div className="deepdose-ambient__orb deepdose-ambient__orb--navy" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--sunset" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--twilight" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--ember" />
      <div className="deepdose-ambient__veil" />
    </div>
  )
}

export function DeepDoseShell({ children, variant = 'light', nav }: DeepDoseShellProps) {
  const isDark = variant === 'dark'

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
      {nav ?? <DeepDoseSiteNav />}
      <div className="clinical-site-nav__main flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
