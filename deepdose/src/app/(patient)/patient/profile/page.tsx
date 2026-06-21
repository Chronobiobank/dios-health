import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfilePanel } from '@/components/patient/ProfilePanel'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
} from '@/lib/consent/dynamic-consent'
import {
  buildProfileConsentRows,
  type LinkedClinician,
} from '@/lib/patient/profile-settings'

export default async function PatientProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/profile')
  }

  const { framework } = await getCurrentFramework(supabase)

  const [
    { data: profile },
    { data: careLinks },
    patientConsentsResult,
    purposesResult,
  ] = await Promise.all([
    supabase
      .from('patient_profiles')
      .select('reminders_enabled')
      .eq('id', user.id)
      .maybeSingle(),
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

  return (
    <div className="dash-meds space-y-8">
      <header className="seco-landing__copy-stack dash-meds__page-head">
        <p className="seco-page__eyebrow">Account</p>
        <h1 className="seco-page__title dash-meds__page-title">Profile</h1>
      </header>

      {framework ? (
        <ProfilePanel
          remindersEnabled={profile?.reminders_enabled ?? true}
          sharingEnabled={sharingEnabled}
          frameworkId={framework.id}
          consents={consentRows}
          clinicians={clinicians}
        />
      ) : (
        <p className="dash-meds__empty-copy">Profile settings are unavailable right now.</p>
      )}
    </div>
  )
}
