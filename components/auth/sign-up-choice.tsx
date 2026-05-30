import Link from 'next/link'

import { AuthDivider } from '@/components/auth/auth-divider'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { BODY, CARD, LIST_LINE } from '@/components/sections/layout'
import { AUTH_ROUTES } from '@/lib/auth/routes'

const ROLES = [
  {
    href: AUTH_ROUTES.signUpPatient,
    title: 'I am a patient.',
    body: 'Track your body clock and get dose timing insights.',
    cta: 'Join as a patient →',
  },
  {
    href: AUTH_ROUTES.signUpClinician,
    title: 'I am a clinician.',
    body: 'Access dose timing intelligence for your patients.',
    cta: 'Join as a clinician →',
  },
] as const

export function SignUpChoice() {
  return (
    <>
      <div className={`${CARD} rounded-2xl p-6 sm:p-8`}>
        <GoogleSignInButton />
        <AuthDivider label="or choose your role" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {ROLES.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className={`${CARD} group flex flex-col rounded-2xl p-6 transition-colors hover:border-black/25 sm:p-7`}
          >
            <h2 className={`${LIST_LINE} text-xl`}>{role.title}</h2>
            <p className={`${BODY} mt-3 flex-1 text-black/70`}>{role.body}</p>
            <span className="type-button mt-6 text-black transition-colors group-hover:text-black/70">
              {role.cta}
            </span>
          </Link>
        ))}
      </div>

      <p className="type-body mt-8 text-center text-sm text-black/60">
        Already have an account?{' '}
        <Link
          href={AUTH_ROUTES.signIn}
          className="font-medium text-black underline-offset-2 hover:underline"
        >
          Sign in →
        </Link>
      </p>
    </>
  )
}
