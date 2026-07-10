import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import SignOutButton from '@/components/auth/SignOutButton'
import { AppTopBarBack } from '@/components/deepdose/AppTopBar'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { ProfilePanel } from '@/components/patient/ProfilePanel'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
} from '@/lib/consent/dynamic-consent'
import {
  buildProfileConsentRows,
  type LinkedClinician,
} from '@/lib/patient/profile-settings'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · Account`,
  description: 'Privacy, consent, devices, and sign out.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
}

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/?next=/account')
  }

  const { framework } = await getCurrentFramework(supabase)

  const [
    { data: profile },
    { data: userProfile },
    { data: careLinks },
    patientConsentsResult,
    purposesResult,
  ] = await Promise.all([
    supabase
      .from('patient_profiles')
      .select('reminders_enabled')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('user_profiles').select('display_name').eq('id', user.id).maybeSingle(),
    supabase
      .from('care_relationships')
      .select('clinician_id')
      .eq('patient_id', user.id)
      .eq('active', true),
    getPatientConsents(supabase, user.id),
    framework
      ? getConsentPurposes(supabase, framework.id)
      : Promise.resolve({ purposes: [], error: null }),
  ])

  const patientConsents = patientConsentsResult.consents ?? []
  const clinicianIds = (careLinks ?? []).map((l) => l.clinician_id)
  const { data: clinicianProfiles } = clinicianIds.length
    ? await supabase.from('user_profiles').select('id, display_name').in('id', clinicianIds)
    : { data: [] }

  const clinicians: LinkedClinician[] = (clinicianProfiles ?? []).map((c) => ({
    id: c.id,
    displayName: c.display_name,
  }))

  const clinicalConsent = patientConsents.find((c) => c.purpose_code === 'clinical_care')
  const sharingEnabled =
    clinicalConsent?.granted === true && !clinicalConsent?.withdrawn_at

  const consentRows = buildProfileConsentRows(purposesResult.purposes, patientConsents)
  const displayName = userProfile?.display_name?.trim() || user.email?.split('@')[0] || 'Member'

  return (
    <ProductAppShell
      title="Account"
      leading={<AppTopBarBack href="/profile" label="Back to profile" />}
      className="dd-account"
    >
      <section className="seco-spectrum-tile dd-account__identity">
        <p className="dd-account__name">{displayName}</p>
        {user.email ? <p className="dd-account__email">{user.email}</p> : null}
      </section>

      {framework ? (
        <div className="dd-account__panel">
          <ProfilePanel
            remindersEnabled={profile?.reminders_enabled ?? true}
            sharingEnabled={sharingEnabled}
            frameworkId={framework.id}
            consents={consentRows}
            clinicians={clinicians}
          />
        </div>
      ) : (
        <p className="dd-account__empty">Account settings are unavailable right now.</p>
      )}

      <div className="dd-account__signout">
        <SignOutButton className="dd-account__signout-btn" />
      </div>
    </ProductAppShell>
  )
}
