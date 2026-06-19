import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPatientCircadianContext } from '@/lib/medications/patient-phase'
import { buildZeitgeberSchedule } from '@/lib/chronobiology/build-zeitgeber-schedule'
import { loadPatientBti } from '@/lib/bti/load-patient-bti'
import { fetchPendingRecommendations } from '@/lib/prescribing/recommendations'
import { buildClockWindows } from '@/lib/medications/clock-windows'
import {
  MEDICATION_TIMINGS,
  type MedicationCode,
} from '@/lib/circadian/medications'
import { decimalHoursToHHMM } from '@/lib/utils/time'
import ScoreGauge from '@/components/shared/ScoreGauge'
import CircadianClock from '@/components/shared/CircadianClock'
import { Badge } from '@/components/ui/Layout'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'
import { PendingRecommendationsPanel } from '@/components/patient/PendingRecommendationsPanel'
import { DosingReminderBanner } from '@/components/patient/DosingReminderBanner'
import { ZeitgeberSchedulePanel } from '@/components/patient/ZeitgeberSchedulePanel'

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

const BTI_BADGE_TONE = {
  WINDOW_OPEN: 'success',
  WINDOW_CLOSED: 'warning',
  CRITICAL_DRIFT: 'warning',
} as const

const BTI_BADGE_LABEL = {
  WINDOW_OPEN: 'In window',
  WINDOW_CLOSED: 'Outside window',
  CRITICAL_DRIFT: 'Drift alert',
} as const

export default async function PatientDashboardPage() {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login?next=/patient/dashboard')
  }

  const context = await getPatientCircadianContext(supabase, user.id)

  const { data: deviceProfile } = await supabase
    .from('patient_profiles')
    .select('device_alert_triggered, reminders_enabled')
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
    .select('chronotype_cat, msf_sc')
    .eq('patient_id', user.id)
    .order('completed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const today = new Date().toISOString().slice(0, 10)
  const { data: todayAcks } = await supabase
    .from('medication_reminder_acks')
    .select('medication_code')
    .eq('patient_id', user.id)
    .eq('ack_date', today)

  const btiPayloads = await loadPatientBti(supabase, user.id)
  const btiByMed = new Map(btiPayloads.map((p) => [p.medication_id, p]))
  const pendingRecommendations = await fetchPendingRecommendations(supabase, user.id)

  const hasOnboarding = Boolean(chronotype)
  const hasMeds = (meds?.length ?? 0) > 0
  const chronotypeLabel = chronotype?.chronotype_cat
    ? CHRONOTYPE_LABELS[chronotype.chronotype_cat] ?? chronotype.chronotype_cat
    : undefined

  const dlmoTime = decimalHoursToHHMM(context.dlmoEstimateHours)
  const clockWindows = buildClockWindows(meds ?? [], context.phaseOffsetMinutes)
  const zeitgeberSchedule = hasOnboarding
    ? buildZeitgeberSchedule({
        dlmoEstimateHours: context.dlmoEstimateHours,
        msfScHours: chronotype?.msf_sc != null ? Number(chronotype.msf_sc) : null,
        btiPayloads,
      })
    : []
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

      {hasMeds && (
        <DosingReminderBanner
          payloads={btiPayloads}
          remindersEnabled={deviceProfile?.reminders_enabled ?? true}
          todayAcks={(todayAcks ?? []).map((a) => a.medication_code)}
        />
      )}

      <PendingRecommendationsPanel recommendations={pendingRecommendations} />

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

      {hasOnboarding && zeitgeberSchedule.length > 0 && (
        <ZeitgeberSchedulePanel items={zeitgeberSchedule} />
      )}

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="seco-page__eyebrow">Medicines & supplements</p>
            <h2 className="seco-app-section-title">Your prescriptions</h2>
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
                const bti = btiByMed.get(m.medication_code)
                const windowStart = bti?.dosing_window_start.slice(11, 16)
                const windowEnd = bti?.dosing_window_end.slice(11, 16)
                const current = formatTime(m.current_timing)

                return (
                  <li key={m.medication_code} className="space-y-1.5 p-5 md:p-6">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-ink">
                        {timing?.displayName ?? m.medication_code}
                        {m.dose_mg != null && (
                          <span className="ml-2 font-normal text-ink-muted">{m.dose_mg} mg</span>
                        )}
                      </p>
                      {bti && (
                        <Badge tone={BTI_BADGE_TONE[bti.bti_status]}>
                          {BTI_BADGE_LABEL[bti.bti_status]}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-ink-muted">
                      Current: {current}
                      {windowStart && windowEnd && (
                        <span className="text-accent">
                          {' '}
                          · Window: {windowStart} – {windowEnd}
                        </span>
                      )}
                    </p>
                    {bti && (
                      <p className="text-xs text-ink-faint">{bti.display_instruction}</p>
                    )}
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
