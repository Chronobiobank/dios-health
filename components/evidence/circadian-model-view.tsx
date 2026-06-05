import Link from 'next/link'

import { SnapshotAgeRow } from '@/components/patient-dashboard/snapshot-age-row'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import { MOCK_PATIENT_SNAPSHOT } from '@/lib/patient-dashboard/mock-snapshot'
import { formatBodyClockCta } from '@/lib/patient-dashboard/tile-copy'

const {
  calendarAge,
  photonicAge,
  chronopenicBurdenYears,
  recoveryYears,
  darkYearsHours,
  lightAlignment,
  dlmoEstimate,
} = MOCK_PATIENT_SNAPSHOT

const bodyClockCta = formatBodyClockCta(recoveryYears)

const EXPLAINERS = [
  {
    label: 'Calendar Age',
    body: 'How long you have lived. The number on your birth certificate. This does not change based on how you live — only time changes it.',
  },
  {
    label: 'Photonic Age',
    body: 'How old your circadian system, immune function, and neurological architecture are operating at — derived from light biology, biochemistry, and sleep. When aligned it can sit below Calendar Age; when disrupted it rises above it.',
  },
  {
    label: 'Chronopenic burden',
    body: 'The gap between the two ages in years, and the Chronopenic Burden Score (0–100) that tracks whether protocols are closing it. Direction of travel matters more than the absolute number.',
  },
  {
    label: 'Recovery',
    body: 'With a personalised plan, DIOS targets closing your chronopenic burden within 90 days — First Light scan, biochemical panels when indicated, and medication timing anchored to your body clock.',
  },
] as const

const SIGNALS = [
  {
    value: `${darkYearsHours}h`,
    label: 'Phase lag',
    detail: 'Hours your sleep rhythm sits off the population anchor.',
  },
  {
    value: `${lightAlignment}/100`,
    label: 'Light alignment',
    detail: 'How closely your day matches what your body clock expects.',
  },
  {
    value: dlmoEstimate,
    label: 'DLMO',
    detail:
      "When your body's night begins — the clock signal we use to time your medications correctly.",
  },
] as const

export function CircadianModelView() {
  return (
    <div className="min-h-screen pb-12">
      <main className="patient-dashboard-content pb-8 pt-20 sm:pt-24">
        <h1 className="dash-page-title">
          Two ages. One gap. Everything you need to know.
        </h1>
        <p className="mt-3 dash-panel-body leading-relaxed text-[var(--text-muted)]">
          Your body has two ages. The first is how long you have lived. The second is how old your
          body is actually running right now. Most people assume they are the same. For most people
          they are not. The gap — your chronopenic burden — is the diagnostic. DIOS measures
          Photonic Age, tracks the burden score, and shows you how to close it.
        </p>

        <div className="glass-tile mt-8 p-5">
          <SnapshotAgeRow
            calendarAge={calendarAge}
            photonicAge={photonicAge}
            chronopenicBurdenYears={chronopenicBurdenYears}
          />
          <div className="snapshot-cta-bar mt-4">
            <span>
              {bodyClockCta.before}
              <em>{bodyClockCta.highlight}</em>
              {bodyClockCta.after}
            </span>
          </div>
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-wider text-black/45">
          The largest study of light and health ever done
        </p>
        <p className="mt-2 dash-panel-muted leading-relaxed">
          The UK Biobank study tracked 80,000 people using wrist-worn light sensors and found a
          direct relationship between light-dark cycle disruption and metabolic ageing. People with
          irregular light exposure and delayed sleep timing consistently showed worse metabolic
          health, higher cardiovascular risk, and shorter healthy life expectancy — independent of
          diet, exercise, and genetics. DIOS takes that population finding and applies it to you
          personally. Your sleep timing, your light exposure, and your blood panel together show how
          well your body clock is running — and your chronopenic burden score.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {EXPLAINERS.map((item) => (
            <article key={item.label} className="glass-tile p-5">
              <p className="font-mono text-xs uppercase tracking-wider text-black/45">
                {item.label}
              </p>
              <p className="mt-2 dash-panel-muted leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>

        <section className="mt-8">
          <p className="font-mono text-xs uppercase tracking-wider text-black/45">
            How we work out your numbers
          </p>
          <p className="mt-2 dash-panel-muted leading-relaxed">
            Three things tell us where your body clock is running. Your smartphone tracks your light
            behaviour and sleep timing every day. A seven-night sleep study using TipTraQ tells us
            your body clock type and whether your breathing is disrupting your sleep. A quarterly
            blood test shows whether your body has the nutritional building blocks your clock needs
            to run properly. Put those three together and we can tell you your Photonic Age —
            and exactly what is pushing it up.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {SIGNALS.map((signal) => (
              <div key={signal.label} className="glass-panel p-4 text-center">
                <p className="text-xl font-medium text-[var(--dash-age-text-strong)]">{signal.value}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-black/45">
                  {signal.label}
                </p>
                <p className="mt-2 dash-panel-muted leading-snug">
                  {signal.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="glass-tile mt-8 p-5">
          <p className="dash-panel-muted leading-relaxed">
            Two numbers. The gap between them. And a plan to close it. Your dashboard shows exactly
            what is adding to your chronopenic burden — and what you can do today to start closing it
            back.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/how-it-works"
              className="dash-panel-action font-medium text-[var(--researcher-avatar-text)] transition-opacity hover:opacity-80"
            >
              Live dashboard demo →
            </Link>
            <Link
              href="/signup/patient"
              className="dash-panel-action font-medium text-[var(--text-primary)] transition-opacity hover:opacity-70"
            >
              Get your Photonic Age →
            </Link>
          </div>
        </div>
      </main>

      <PitchFooter />
    </div>
  )
}
