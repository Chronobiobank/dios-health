'use client'

import Link from 'next/link'

import { SignOutButton } from '@/components/auth/sign-out-button'
import { AUTH_ROUTES } from '@/lib/auth/routes'

import { NAV_DASHBOARD_LINK } from './navigation'

type NavAuthActionsProps = {
  isAuthenticated: boolean
}

export function NavAuthActions({ isAuthenticated }: NavAuthActionsProps) {
  if (isAuthenticated) {
    return (
      <>
        <Link href={NAV_DASHBOARD_LINK.href} className="dios-site-nav__cta type-button">
          <span className="dios-site-nav__cta-short">{NAV_DASHBOARD_LINK.mobileLabel}</span>
          <span className="dios-site-nav__cta-long">{NAV_DASHBOARD_LINK.label}</span>
        </Link>
        <SignOutButton className="dios-site-nav__sign-out" variant="nav" />
      </>
    )
  }

  return (
    <Link href={AUTH_ROUTES.signIn} className="dios-site-nav__cta type-button">
      Sign in
    </Link>
  )
}
