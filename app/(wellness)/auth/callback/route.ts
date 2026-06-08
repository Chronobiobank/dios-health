import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

import { resolveSignInDestination } from '@/lib/auth/post-sign-in-redirect'
import { AUTH_ROUTES } from '@/lib/auth/routes'

type PendingCookie = {
  name: string
  value: string
  options?: Parameters<NextResponse['cookies']['set']>[2]
}

function redirectWithCookies(origin: string, path: string, cookies: PendingCookie[]) {
  const response = NextResponse.redirect(`${origin}${path}`)
  for (const cookie of cookies) {
    response.cookies.set(cookie.name, cookie.value, cookie.options)
  }
  return response
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const nextParam = requestUrl.searchParams.get('next')
  const origin = requestUrl.origin

  if (!code) {
    return NextResponse.redirect(`${origin}${AUTH_ROUTES.signIn}?error=auth`)
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return NextResponse.redirect(`${origin}${AUTH_ROUTES.signIn}?error=auth`)
  }

  const pendingCookies: PendingCookie[] = []

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          pendingCookies.push(cookie)
        }
      },
    },
  })

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

  const destination = await resolveSignInDestination(supabase, user.id, nextParam)

  return redirectWithCookies(origin, destination, pendingCookies)
}
