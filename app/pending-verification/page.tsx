import Link from 'next/link'
import { redirect } from 'next/navigation'

import { AuthShell } from '@/components/auth/auth-shell'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { VerificationStatusPoller } from '@/components/auth/verification-status-poller'
import { VerificationTimeline } from '@/components/auth/verification-timeline'
import { AUTH_ROUTES, CLINIC_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/server'

export default async function PendingVerificationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(AUTH_ROUTES.signIn)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle<{ role: 'patient' | 'clinician' }>()

  if (profile?.role !== 'clinician') {
    redirect('/dashboard')
  }

  const { data: clinician } = await supabase
    .from('clinician_profiles')
    .select('verified, registration_number, onboarding_complete')
    .eq('id', user.id)
    .maybeSingle<{
      verified: boolean
      registration_number: string | null
      onboarding_complete: boolean
    }>()

  if (clinician?.verified) {
    redirect(CLINIC_ROUTES.panel)
  }

  if (!clinician?.onboarding_complete) {
    redirect(AUTH_ROUTES.signUpClinician)
  }

  const email = user.email ?? 'your email address'
  const credentialsSubmitted = Boolean(clinician?.registration_number)

  return (
    <AuthShell
      headline="You're on the list."
      subtext="We verify every clinician manually. Usually within one business day."
    >
      <VerificationStatusPoller userId={user.id} />

      <VerificationTimeline credentialsSubmitted={credentialsSubmitted} />

      <p className="type-body mt-6 text-center text-sm text-black/70">
        We will email you at{' '}
        <span className="font-medium text-black">{email}</span> when access is confirmed.
      </p>

      <p className="type-body mt-8 text-center text-sm">
        <Link
          href="mailto:support@dios.health"
          className="text-black/60 underline-offset-2 hover:text-black hover:underline"
        >
          Questions? Contact us →
        </Link>
      </p>

      <p className="type-body mt-6 text-center text-sm">
        <SignOutButton />
      </p>
    </AuthShell>
  )
}
