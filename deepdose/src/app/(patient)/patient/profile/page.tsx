import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ClinicianLinkForm } from '@/components/patient/ClinicianLinkForm'
import { Badge } from '@/components/ui/Layout'

export default async function PatientProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/profile')
  }

  const { data: careLinks } = await supabase
    .from('care_relationships')
    .select('id, clinician_id, created_at, active')
    .eq('patient_id', user.id)
    .eq('active', true)

  const clinicianIds = (careLinks ?? []).map((l) => l.clinician_id)
  const { data: clinicians } = clinicianIds.length
    ? await supabase.from('user_profiles').select('id, display_name').in('id', clinicianIds)
    : { data: [] }

  const { data: clinicalConsent } = await supabase
    .from('patient_consents')
    .select('granted, withdrawn_at')
    .eq('patient_id', user.id)
    .eq('purpose_code', 'clinical_care')
    .maybeSingle()

  const sharingEnabled =
    clinicalConsent?.granted === true && !clinicalConsent?.withdrawn_at

  return (
    <div className="space-y-8">
      <header>
        <p className="seco-page__eyebrow">Account</p>
        <h1 className="seco-app-section-title">Profile</h1>
      </header>

      <section className="seco-app-card space-y-4 p-5 md:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="seco-app-card__title">Clinical care sharing</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Required consent to link your clinician and share BTI summaries.
            </p>
          </div>
          <Badge tone={sharingEnabled ? 'success' : 'warning'}>
            {sharingEnabled ? 'Enabled' : 'Not enabled'}
          </Badge>
        </div>

        {!sharingEnabled && (
          <p className="text-sm text-ink-muted">
            Re-run onboarding consent or contact support to enable clinical care sharing.
          </p>
        )}

        {sharingEnabled && (
          <>
            <ClinicianLinkForm />
            {(clinicians ?? []).length > 0 && (
              <ul className="space-y-2 border-t border-border pt-4 text-sm">
                <p className="seco-page__eyebrow">Linked clinicians</p>
                {clinicians!.map((c) => (
                  <li key={c.id} className="text-ink">
                    {c.display_name ?? 'Clinician'}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>
    </div>
  )
}
