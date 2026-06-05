import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'

/** Legacy route — Retinomic sign-in lives at /auth/signin */
export default function SignInRedirectPage() {
  redirect(AUTH_ROUTES.authSignIn)
}
