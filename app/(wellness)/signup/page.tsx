import { redirect } from 'next/navigation'

import { AUTH_ROUTES } from '@/lib/auth/routes'

/** Legacy /signup — patient signup is the default entry. Clinicians use /signup/clinician. */
export default function SignUpPage() {
  redirect(AUTH_ROUTES.signUpPatient)
}
