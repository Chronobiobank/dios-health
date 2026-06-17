import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildClockWindows } from '@/lib/medications/clock-windows'
import {
  MEDICATION_TIMINGS,
  adjustTimingForPhase,
  type MedicationCode,
} from '@/lib/circadian/medications'
import { decimalHoursToHHMM, isTimeInWindow } from '@/lib/utils/time'
import ScoreGauge from '@/components/shared/ScoreGauge'
import CircadianClock from '@/components/shared/CircadianClock'
import { Badge } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'

const CHRONOTYPE_LABELS: Record<string, string> = {
  extreme_early: 'Extreme early',
  early: 'Early',
  intermediate: 'Intermediate',
  late: 'Late',
  extreme_late: 'Extreme late',
}

function formatTime(t: string | null): string {
  if (!t) return '—'
  return t.slice(0, 5)
}

type OverviewHeadline = {
  titleLead: string
  titleAccent?: string
  sub?: string
}

function alignmentStatus(score: number): OverviewHeadline {
  if (score >= 70) {
    return {
      titleLead: 'Your circadian rhythm is',
      titleAccent: 'well aligned today.',
    }
  }
  if (score >= 50) {
    return {
      titleLead: 'Moderate',
      titleAccent: 'misalignment',
      sub: 'consider shifting sleep earlier.',
    }
  }
  return {
    titleLead: 'Significant',
    titleAccent: 'drift detected',
    sub: 'Review your sleep schedule.',
  }
}

export default async function PatientDashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/dashboard')
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  const { data: deviceProfile } = await supabase
    .from('patient_profiles')
    .select('device_alert_triggered')
    .eq('id', user.id)
    .maybeSingle()

  const { data: meds } = await supabase
    .from('patient_medications')
    .select('medication_code, dose_mg, current_timing')
    .eq('patient_id', user.id)
    .eq('is_active', true)
    .order('medication_code')

  const { data: chronotype } = await supabase
    .from('chronotype_profiles')
    .select('chronotype_cat')
    .eq('patient_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const hasOnboarding = Boolean(chronotype)
  const hasMeds = (meds?.length ?? 0) > 0
  const chronotypeLabel = chronotype?.chronotype_cat
    ? CHRONOTYPE_LABELS[chronotype.chronotype_cat] ?? chronotype.chronotype_cat
    : undefined

  const dlmoTime = decimalHoursToHHMM(context.dlmoEstimateHours)
  const clockWindows = buildClockWindows(meds ?? [], context.phaseOffsetMinutes)
  const status = alignmentStatus(context.circadianScore)

  return (
    <div className="space-y-10">
      <header>
        <p className="seco-page__eyebrow">Overview</p>
        {hasOnboarding && context.circadianScore > 0 && (
          <div className="seco-landing__hero-head seco-dashboard-overview">
            <h1 className="seco-landing__hero-title">
              <span className="seco-landing__hero-line">{status.titleLead}</span>
              {status.titleAccent && (
                <span className="seco-landing__hero-line seco-landing__hero-spectrum">
                  {status.titleAccent}
                </span>
              )}
            </h1>
            {status.sub && <p className="seco-landing__hero-sub">{status.sub}</p>}
          </div>
        )}
      </header>

      {!hasOnboarding && (
        <Callout tone="warning">
          Complete onboarding to unlock personalised dosing windows.{' '}
          <Link href="/patient/onboarding/consent" className="font-medium underline">
            Continue setup
          </Link>
        </Callout>
      )}

      {deviceProfile?.device_alert_triggered && (
        <Callout tone="warning">
          Device sync interrupted — reconnect or sync your wearable in{' '}
          <Link href="/patient/dashboard/data" className="font-medium underline">
            Smart devices
          </Link>
          .
        </Callout>
      )}

      {hasOnboarding && context.circadianScore > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="seco-app-card p-5 md:p-6">
              <p className="seco-page__eyebrow mb-1">Circadian score</p>
              <h2 className="seco-app-card__title">Alignment today</h2>
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

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="seco-page__eyebrow">Medications</p>
            <h2 className="seco-app-section-title">Active prescriptions</h2>
          </div>
          {!hasMeds && hasOnboarding && (
            <Button href="/patient/onboarding/medications" variant="secondary" className="!px-4 !py-2 text-sm">
              Add medications
            </Button>
          )}
        </div>

        {!hasMeds ? (
          <div className="seco-app-card border-dashed p-5 text-center md:p-6">
            <p className="text-sm text-ink-muted">
              No medications added yet. Add medications to see dosing windows on your circadian clock.
            </p>
            {hasOnboarding && (
              <Button href="/patient/onboarding/medications" className="mt-4">
                Add medications
              </Button>
            )}
          </div>
        ) : (
          <div className="seco-app-card overflow-hidden !p-0">
            <ul className="divide-y divide-border">
              {meds!.map((m) => {
                const timing =
                  m.medication_code in MEDICATION_TIMINGS
                    ? MEDICATION_TIMINGS[m.medication_code as MedicationCode]
                    : null
                const window = timing
                  ? adjustTimingForPhase(timing, context.phaseOffsetMinutes)
                  : null
                const current = formatTime(m.current_timing)
                const inWindow =
                  window && m.current_timing
                    ? isTimeInWindow(current, window.start, window.end)
                    : null

                return (
                  <li key={m.medication_code} className="space-y-1.5 p-5 md:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-ink">
                        {timing?.displayName ?? m.medication_code}
                        {m.dose_mg != null && (
                          <span className="ml-2 font-normal text-ink-muted">{m.dose_mg} mg</span>
                        )}
                      </p>
                      {inWindow !== null && (
                        <Badge tone={inWindow ? 'success' : 'warning'}>
                          {inWindow ? 'In window' : 'Outside window'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-ink-muted">
                      Current: {current}
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
          </div>
        )}
      </section>
    </div>
  )
}
