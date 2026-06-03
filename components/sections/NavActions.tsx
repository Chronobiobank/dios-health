import type { ReactNode } from 'react'

import { createClient } from '@/lib/supabase/server'

import { NavAuthActions } from './NavAuthActions'
import { NavMenu } from './NavMenu'

type NavActionsProps = {
  tagline?: ReactNode
}

export async function NavActions({ tagline }: NavActionsProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = Boolean(user)

  return (
    <>
      <NavAuthActions isAuthenticated={isAuthenticated} />
      {tagline}
      <NavMenu isAuthenticated={isAuthenticated} />
    </>
  )
}
