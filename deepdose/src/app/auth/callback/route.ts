import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  resolvePathAfterActivationAttempt,
  tryActivationLinkForUser,
} from '@/lib/care/resolve-activation-redirect'
import { normalizeActivationCode } from '@/lib/care/pending-activation'
import {
  consumerAuthPath,
  resolvePatientPostLoginPath,
  resolvePostLoginPath,
} from '@/lib/auth/post-login-path'

function homeAuthErrorUrl(origin: string, next: string | null, reason: string): string {
  const base = consumerAuthPath(next)
  const sep = base.includes('?') ? '&' : '?'
  return `${origin}${base}${sep}error=auth_callback_failed&reason=${encodeURIComponent(reason)}`
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next')
  const activation = searchParams.get('activation')

  if (!code) {
    return NextResponse.redirect(homeAuthErrorUrl(origin, next, 'missing_code'))
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
    return NextResponse.redirect(homeAuthErrorUrl(origin, next, error.message))
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

    if (normalizedActivation.length >= 6) {
      redirectPath = resolvePathAfterActivationAttempt(
        profile?.tier,
        next,
        normalizedActivation,
        linkResult
      )
    } else if (profile?.tier === 'patient' || !profile?.tier) {
      redirectPath = await resolvePatientPostLoginPath(supabase, user.id, next)
    } else {
      redirectPath = resolvePostLoginPath(profile?.tier, next)
    }

    response = NextResponse.redirect(`${origin}${redirectPath}`)
  }

  return response
}
