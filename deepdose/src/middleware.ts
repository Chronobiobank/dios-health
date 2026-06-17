import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Signed-in users should not see login
  if (user && pathname === '/login') {
    return NextResponse.redirect(new URL('/patient/onboarding/consent', request.url))
  }

  // Unauthenticated users cannot access protected tiers
  if (!user) {
    if (
      pathname.startsWith('/patient') ||
      pathname.startsWith('/clinical') ||
      pathname.startsWith('/enterprise')
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // Fetch user tier from user_profiles
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  const tier = profile?.tier ?? 'patient'

  // Enterprise routes: enterprise tier only
  if (pathname.startsWith('/enterprise') && tier !== 'enterprise') {
    return NextResponse.redirect(new URL('/patient/dashboard', request.url))
  }

  // Clinical routes: clinician or enterprise only
  if (pathname.startsWith('/clinical') && !['clinician', 'enterprise'].includes(tier)) {
    return NextResponse.redirect(new URL('/patient/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
