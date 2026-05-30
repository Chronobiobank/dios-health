import { type NextRequest, NextResponse } from 'next/server'

import { getPostAuthPath, hasCompletedClinicianOnboarding, hasPatientProfile, isClinicianOnboardingPath, isPatientOnboardingPath, isProtectedPath, isPublicAuthPath, isSignupRoleChoicePath } from '@/lib/auth/redirects'
import { AUTH_ROUTES, CLINIC_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const { supabaseResponse, user, supabase } = await updateSession(request)

  if (!supabase) {
    return supabaseResponse
  }

  if (!user && isProtectedPath(pathname)) {
    const signInUrl = request.nextUrl.clone()
    signInUrl.pathname = AUTH_ROUTES.signIn
    signInUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(signInUrl)
  }

  if (user && isPublicAuthPath(pathname)) {
    if (isPatientOnboardingPath(pathname)) {
      const completed = await hasPatientProfile(supabase, user.id)
      if (completed) {
        return NextResponse.redirect(new URL(PATIENT_ROUTES.dashboard, request.url))
      }
      return supabaseResponse
    }

    if (isClinicianOnboardingPath(pathname)) {
      const completed = await hasCompletedClinicianOnboarding(supabase, user.id)
      if (completed) {
        const destination = await getPostAuthPath(supabase, user.id)
        return NextResponse.redirect(new URL(destination, request.url))
      }
      return supabaseResponse
    }

    if (isSignupRoleChoicePath(pathname)) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      // New OAuth users have a session but no profile yet — let them pick a role.
      if (!profile) {
        return supabaseResponse
      }

      const destination = await getPostAuthPath(supabase, user.id)
      return NextResponse.redirect(new URL(destination, request.url))
    }

    if (pathname === AUTH_ROUTES.signIn) {
      const destination = await getPostAuthPath(supabase, user.id)
      return NextResponse.redirect(new URL(destination, request.url))
    }
  }

  if (user && isProtectedPath(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single<{ role: 'patient' | 'clinician' }>()

    if (!profile) {
      return supabaseResponse
    }

    if (pathname.startsWith('/dashboard') && profile.role !== 'patient') {
      return NextResponse.redirect(new URL(CLINIC_ROUTES.panel, request.url))
    }

    if (pathname.startsWith('/clinic') && profile.role !== 'clinician') {
      return NextResponse.redirect(new URL(PATIENT_ROUTES.dashboard, request.url))
    }

    if (profile.role === 'clinician') {
      const { data: clinician } = await supabase
        .from('clinician_profiles')
        .select('verified')
        .eq('id', user.id)
        .single<{ verified: boolean }>()

      const verified = clinician?.verified ?? false

      if (pathname.startsWith('/clinic') && !verified) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.pendingVerification, request.url))
      }

      if (pathname === AUTH_ROUTES.pendingVerification && verified) {
        return NextResponse.redirect(new URL(CLINIC_ROUTES.panel, request.url))
      }
    }

    if (pathname === AUTH_ROUTES.pendingVerification && profile.role !== 'clinician') {
      return NextResponse.redirect(new URL(PATIENT_ROUTES.dashboard, request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/signin',
    '/signup/:path*',
    '/pending-verification',
    '/dashboard/:path*',
    '/clinic/:path*',
  ],
}
