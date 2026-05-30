import { NextResponse } from 'next/server'

import { getPostAuthPath } from '@/lib/auth/redirects'
import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}${AUTH_ROUTES.signIn}?error=auth`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(`${origin}${AUTH_ROUTES.signIn}?error=auth`)
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(`${origin}${AUTH_ROUTES.signIn}?error=auth`)
  }

  const destination = await getPostAuthPath(supabase, user.id)
  return NextResponse.redirect(`${origin}${destination}`)
}
