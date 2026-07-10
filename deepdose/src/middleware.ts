import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { consumerAuthPath, isStaffLoginPath, resolvePostLoginPath } from '@/lib/auth/post-login-path'

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
  const nextParam = request.nextUrl.searchParams.get('next')

  // Unauthenticated users cannot access protected tiers
  if (!user) {
    if (pathname.startsWith('/patient/')) {
      return NextResponse.redirect(new URL(consumerAuthPath(pathname + request.nextUrl.search), request.url))
    }
    if (pathname.startsWith('/clinical') || pathname.startsWith('/enterprise')) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }
    // Consumer /login is retired — home gate owns join / sign-in
    if (pathname === '/login' && !isStaffLoginPath(nextParam)) {
      return NextResponse.redirect(new URL(consumerAuthPath(nextParam), request.url))
    }
    return supabaseResponse
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  const tier = profile?.tier ?? 'patient'

  // Signed-in consumers: home gate is join-only — send them to Real feed (or next)
  if (pathname === '/' && (tier === 'patient' || !profile?.tier)) {
    return NextResponse.redirect(
      new URL(resolvePostLoginPath(tier, nextParam), request.url)
    )
  }

  // Signed-in users should not see login — route by tier (or explicit next)
  if (pathname === '/login') {
    return NextResponse.redirect(
      new URL(resolvePostLoginPath(tier, nextParam), request.url)
    )
  }

  // Enterprise routes: enterprise tier only
  if (pathname.startsWith('/enterprise') && tier !== 'enterprise') {
    return NextResponse.redirect(new URL('/grid', request.url))
  }

  // Clinical routes: clinician or enterprise only
  if (pathname.startsWith('/clinical') && !['clinician', 'enterprise'].includes(tier)) {
    return NextResponse.redirect(new URL('/grid', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
