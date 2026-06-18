import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'
import { fetchPatientRecommendationsForClinician } from '@/lib/prescribing/recommendations'
import { buildClockWindows } from '@/lib/medications/clock-windows'
import {
  MEDICATION_TIMINGS,
  type MedicationCode,
} from '@/lib/circadian/medications'
import { decimalHoursToHHMM } from '@/lib/utils/time'
import ScoreGauge from '@/components/shared/ScoreGauge'
import CircadianClock from '@/components/shared/CircadianClock'
import { Badge } from '@/components/ui/Layout'
import { PrescribingForm } from '@/components/clinical/PrescribingForm'

const CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early',
  early: 'Early',
  intermediate: 'Intermediate',
  late: 'Late',
  extreme_late: 'Extreme late',
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  modified: 'Modified',
}

function formatTime(t: string | null): string {
  if (!t) return '—'
  return t.slice(0, 5)
}

export default async function ClinicalPatientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: patientId } = await params
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/clinical/dashboard')
  }

  const canAccess = await clinicianCanAccessPatient(supabase, user.id, patientId)
  if (!canAccess) {
    notFound()
  }

  const { data: patientProfile } = await supabase
    .from('patient_profiles')
    .select('is_premium_tier, device_alert_triggered, last_device_sync_at')
    .eq('id', patientId)
    .single()

  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('display_name')
    .eq('id', patientId)
    .single()

  const { data: meds } = await supabase
    .from('patient_medications')
    .select('medication_code, dose_mg, current_timing')
    .eq('patient_id', patientId)
    .eq('is_active', true)

  const context = await getPatientCircadianContext(supabase, patientId)
  const btiPayloads = await loadPatientBti(supabase, patientId)
  const btiByMed = new Map(btiPayloads.map((p) => [p.medication_id, p]))
  const recommendations = await fetchPatientRecommendationsForClinician(supabase, patientId)

  const chronotypeLabel = context.chronotypeCat
    ? CHRONOTYPE_LABELS[context.chronotypeCat] ?? context.chronotypeCat
    : undefined

  const dlmoTime = decimalHoursToHHMM(context.dlmoEstimateHours)
  const clockWindows = buildClockWindows(meds ?? [], context.phaseOffsetMinutes)

  return (
    <div className="space-y-8">
      <header>
        <Link href="/clinical/dashboard" className="text-sm text-accent underline">
          ← Triage
        </Link>
        <p className="seco-page__eyebrow mt-4">Patient record</p>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="seco-app-section-title">
            {userProfile?.display_name ?? 'Patient'}
          </h1>
          {patientProfile?.is_premium_tier && (
            <span className="text-sm" title="Verified Clinical-Grade Data via TipTraQ">
              🛡️ Verified Clinical-Grade Data via TipTraQ
            </span>
          )}
          {patientProfile?.device_alert_triggered && (
            <Badge tone="warning">Device sync alert</Badge>
          )}
        </div>
        {patientProfile?.last_device_sync_at && (
          <p className="mt-1 text-sm text-ink-muted">
            Last device sync: {new Date(patientProfile.last_device_sync_at).toLocaleString()}
          </p>
        )}
      </header>

      {context.circadianScore > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="seco-app-card p-5 md:p-6">
            <p className="seco-page__eyebrow mb-1">Circadian score</p>
            <h2 className="seco-app-card__title">Alignment (read-only)</h2>
            <ScoreGauge
              score={context.circadianScore}
              chronotypeLabel={chronotypeLabel}
              components={context.scoreComponents ?? undefined}
            />
          </div>
          <div className="seco-app-card p-5 md:p-6">
            <p className="seco-page__eyebrow mb-1">24-hour rhythm</p>
            <h2 className="seco-app-card__title">Dosing windows</h2>
            <CircadianClock
              dlmoTime={dlmoTime}
              windows={clockWindows}
              chronotypeLabel={chronotypeLabel}
            />
          </div>
        </div>
      )}

      <section className="seco-app-card p-5 md:p-6">
        <p className="seco-page__eyebrow mb-1">Prescribing</p>
        <h2 className="seco-app-card__title mb-4">Propose timing change</h2>
        <PrescribingForm
          patientId={patientId}
          medications={meds ?? []}
        />
      </section>

      {recommendations.length > 0 && (
        <section className="seco-app-card overflow-hidden !p-0">
          <div className="border-b border-border p-5 md:p-6">
            <p className="seco-page__eyebrow mb-1">History</p>
            <h2 className="seco-app-card__title">Recommendations</h2>
          </div>
          <ul className="divide-y divide-border">
            {recommendations.map((rec) => (
              <li key={rec.id} className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">
                    {rec.medication_code in MEDICATION_TIMINGS
                      ? MEDICATION_TIMINGS[rec.medication_code as MedicationCode].displayName
                      : rec.medication_code}
                  </p>
                  <Badge tone={rec.status === 'pending' ? 'warning' : 'success'}>
                    {STATUS_LABEL[rec.status] ?? rec.status}
                  </Badge>
                </div>
                <p className="text-sm text-ink-muted">
                  {formatTime(rec.current_timing)} → {formatTime(rec.recommended_timing)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="seco-app-card overflow-hidden !p-0">
        <div className="border-b border-border p-5 md:p-6">
          <p className="seco-page__eyebrow mb-1">BTI status</p>
          <h2 className="seco-app-card__title">Active prescriptions</h2>
        </div>
        {!meds?.length ? (
          <p className="p-5 text-sm text-ink-muted md:p-6">No active medications on file.</p>
        ) : (
          <ul className="divide-y divide-border">
            {meds.map((m) => {
              const timing =
                m.medication_code in MEDICATION_TIMINGS
                  ? MEDICATION_TIMINGS[m.medication_code as MedicationCode]
                  : null
              const bti = btiByMed.get(m.medication_code)
              return (
                <li key={m.medication_code} className="p-5 md:p-6">
                  <p className="font-medium text-ink">
                    {timing?.displayName ?? m.medication_code}
                    {m.dose_mg != null && (
                      <span className="ml-2 font-normal text-ink-muted">{m.dose_mg} mg</span>
                    )}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Current: {formatTime(m.current_timing)}
                    {bti && (
                      <span className="text-accent">
                        {' '}
                        · {bti.bti_status.replace('_', ' ')}
                      </span>
                    )}
                  </p>
                  {bti && (
                    <p className="mt-1 text-xs text-ink-faint">{bti.display_instruction}</p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
