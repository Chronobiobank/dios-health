import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { resolvePostLoginPath } from '@/lib/auth/post-login-path'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next')

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
    redirectPath = resolvePostLoginPath(profile?.tier, next)
    response = NextResponse.redirect(`${origin}${redirectPath}`)
  }

  return response
}
