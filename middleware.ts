import { type NextRequest, NextResponse } from 'next/server'

import {
  getPostAuthPath,
  hasCompletedClinicianOnboarding,
  hasPatientProfile,
  isClinicianOnboardingPath,
  isPatientOnboardingPath,
  isProtectedPath,
  isPublicAuthPath,
  isSignupRoleChoicePath,
  shouldRedirectTo,
} from '@/lib/auth/redirects'
import { AUTH_ROUTES, CLINIC_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'
import { updateSession } from '@/lib/supabase/middleware'

function redirectIfNeeded(request: NextRequest, destination: string) {
  if (!shouldRedirectTo(request.nextUrl.pathname, destination)) {
    return null
  }
  return NextResponse.redirect(new URL(destination, request.url))
}

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
        return (
          redirectIfNeeded(request, PATIENT_ROUTES.coach) ?? supabaseResponse
        )
      }
      return supabaseResponse
    }

    if (isClinicianOnboardingPath(pathname)) {
      const completed = await hasCompletedClinicianOnboarding(supabase, user.id)
      if (completed) {
        const destination = await getPostAuthPath(supabase, user.id)
        return redirectIfNeeded(request, destination) ?? supabaseResponse
      }
      return supabaseResponse
    }

    if (isSignupRoleChoicePath(pathname)) {
      const destination = await getPostAuthPath(supabase, user.id)
      // New OAuth users: destination is /signup — must not redirect to the same URL.
      return redirectIfNeeded(request, destination) ?? supabaseResponse
    }

    if (pathname === AUTH_ROUTES.signIn) {
      const destination = await getPostAuthPath(supabase, user.id)
      return redirectIfNeeded(request, destination) ?? supabaseResponse
    }
  }

  if (user && isProtectedPath(pathname)) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle<{ role: 'patient' | 'clinician' }>()

    if (!profile) {
      return supabaseResponse
    }

    if (pathname.startsWith('/dashboard') && profile.role !== 'patient') {
      return NextResponse.redirect(new URL(CLINIC_ROUTES.panel, request.url))
    }

    if (pathname.startsWith('/dashboard') && profile.role === 'patient') {
      const completed = await hasPatientProfile(supabase, user.id)
      if (!completed) {
        return NextResponse.redirect(new URL(AUTH_ROUTES.signUpPatient, request.url))
      }
    }

    if (pathname.startsWith('/clinic') && profile.role !== 'clinician') {
      return NextResponse.redirect(new URL(PATIENT_ROUTES.dashboard, request.url))
    }

    if (profile.role === 'clinician') {
      const { data: clinician } = await supabase
        .from('clinician_profiles')
        .select('verified')
        .eq('id', user.id)
        .maybeSingle<{ verified: boolean }>()

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
    '/signup',
    '/signup/:path*',
    '/pending-verification',
    '/dashboard',
    '/dashboard/:path*',
    '/clinic/:path*',
  ],
}
