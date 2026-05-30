import { createClient } from '@/lib/supabase/server'

import { NavAuthActions } from './NavAuthActions'
import { NavMenu } from './NavMenu'

export async function NavActions() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = Boolean(user)

  return (
    <>
      <NavAuthActions isAuthenticated={isAuthenticated} />
      <NavMenu isAuthenticated={isAuthenticated} />
    </>
  )
}
