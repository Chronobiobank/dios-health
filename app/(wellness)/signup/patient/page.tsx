import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'

/** Legacy route — Retinomic sign-up lives at /auth/signup */
export default function PatientSignUpRedirectPage() {
  redirect(AUTH_ROUTES.authSignUp)
}
