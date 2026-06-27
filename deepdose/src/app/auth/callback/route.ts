import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  resolvePathAfterActivationAttempt,
  tryActivationLinkForUser,
} from '@/lib/care/resolve-activation-redirect'
import { normalizeActivationCode } from '@/lib/care/pending-activation'
import { resolvePostLoginPath } from '@/lib/auth/post-login-path'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const activation = searchParams.get('activation')

  if (!code) {
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_failed&reason=missing_code`
    )
  }

  let redirectPath = resolvePostLoginPath('patient', next)

  let response = NextResponse.redirect(`${origin}${redirectPath}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.redirect(`${origin}${redirectPath}`)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const reason = encodeURIComponent(error.message)
    return NextResponse.redirect(
      `${origin}/login?error=auth_callback_failed&reason=${reason}`
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('tier')
      .eq('id', user.id)
      .maybeSingle()

    const normalizedActivation = activation ? normalizeActivationCode(activation) : ''
    let linkResult = null

    if (normalizedActivation.length >= 6) {
      linkResult = await tryActivationLinkForUser(user.id, normalizedActivation)
    }

    redirectPath = resolvePathAfterActivationAttempt(
      profile?.tier,
      next,
      normalizedActivation || null,
      linkResult
    )
    response = NextResponse.redirect(`${origin}${redirectPath}`)
  }

  return response
}
