import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { clinicianCanAccessPatient } from '@/lib/clinical/triage'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildClockWindows } from '@/lib/medications/clock-windows'
import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
} from '@/lib/circadian/medications'
import { decimalHoursToHHMM } from '@/lib/utils/time'
import ScoreGauge from '@/components/shared/ScoreGauge'
import CircadianClock from '@/components/shared/CircadianClock'
import { Badge } from '@/components/ui/Layout'

const CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early',
  early: 'Early',
  intermediate: 'Intermediate',
  late: 'Late',
  extreme_late: 'Extreme late',
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

      <section className="seco-app-card overflow-hidden !p-0">
        <div className="border-b border-border p-5 md:p-6">
          <p className="seco-page__eyebrow mb-1">Medications</p>
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
              const window = timing
                ? adjustTimingForPhase(timing, context.phaseOffsetMinutes)
                : null
              return (
                <li key={m.medication_code} className="p-5 md:p-6">
                  <p className="font-medium text-ink">
                    {timing?.displayName ?? m.medication_code}
                    {m.dose_mg != null && (
                      <span className="ml-2 font-normal text-ink-muted">{m.dose_mg} mg</span>
                    )}
                  </p>
                  <p className="text-sm text-ink-muted">
                    Current: {m.current_timing?.slice(0, 5) ?? '—'}
                    {window && (
                      <span className="text-accent">
                        {' '}
                        · Recommended: {window.start} – {window.end}
                      </span>
                    )}
                  </p>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
