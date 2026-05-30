'use client'

import { SignOutButton } from '@/components/auth/sign-out-button'
import { AUTH_ROUTES } from '@/lib/auth/routes'

type SignupSessionBannerProps = {
  email: string
  returnTo?: string
}

export function SignupSessionBanner({
  email,
  returnTo = AUTH_ROUTES.signUpPatient,
}: SignupSessionBannerProps) {
  return (
    <div className="mb-6 rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-sm text-black/70">
      <p>
        Signed in as <span className="font-medium text-black">{email}</span>. Your progress is saved to this account
        in the database — incognito still uses the same account if you sign in with the same email or Google.
      </p>
      <p className="mt-2">
        Not you?{' '}
        <SignOutButton variant="inline" redirectTo={returnTo} label="Sign out and start over" />
      </p>
    </div>
  )
}
