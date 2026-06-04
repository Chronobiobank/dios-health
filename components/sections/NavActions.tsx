import { createClient } from '@/lib/supabase/server'
import { AUTH_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'

import { NavAuthActions } from './NavAuthActions'
import { NavMenu } from './NavMenu'

export async function NavActions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = Boolean(user)
  const coachHref = isAuthenticated
    ? PATIENT_ROUTES.coach
    : `${AUTH_ROUTES.signIn}?next=${encodeURIComponent(PATIENT_ROUTES.coach)}`

  return (
    <>
      <NavAuthActions isAuthenticated={isAuthenticated} />
      <NavMenu isAuthenticated={isAuthenticated} coachHref={coachHref} />
    </>
  )
}
