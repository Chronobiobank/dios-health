'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { SignOutButton } from '@/components/auth/sign-out-button'

import { isPatientDashboardPath, NAV_DASHBOARD_LINK } from './navigation'

type NavAuthActionsProps = {
  isAuthenticated: boolean
}

export function NavAuthActions({ isAuthenticated }: NavAuthActionsProps) {
  const pathname = usePathname()
  const onDashboard = isPatientDashboardPath(pathname)

  if (isAuthenticated) {
    return (
      <>
        {!onDashboard ? (
          <Link
            href={NAV_DASHBOARD_LINK.href}
            className="dios-site-nav__cta dios-site-nav__cta-desktop type-button"
          >
            <span className="dios-site-nav__cta-short">{NAV_DASHBOARD_LINK.mobileLabel}</span>
            <span className="dios-site-nav__cta-long">{NAV_DASHBOARD_LINK.label}</span>
          </Link>
        ) : null}
        <SignOutButton className="dios-site-nav__sign-out" variant="nav" />
      </>
    )
  }

  return null
}
