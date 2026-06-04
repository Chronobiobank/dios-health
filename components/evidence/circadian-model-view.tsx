import Link from 'next/link'

import { SnapshotAgeRow } from '@/components/patient-dashboard/snapshot-age-row'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import { MOCK_PATIENT_SNAPSHOT } from '@/lib/patient-dashboard/mock-snapshot'
import { formatBodyClockCta } from '@/lib/patient-dashboard/tile-copy'

const {
  chronologicalAge,
  chronosomaticAge,
  darkYears,
  recoveryYears,
  darkYearsHours,
  lightAlignment,
} = MOCK_PATIENT_SNAPSHOT

const bodyClockCta = formatBodyClockCta(recoveryYears)

const EXPLAINERS = [
  {
    label: 'Chronological age',
    body: `How long you have lived — the number on your birth certificate. For most people this is ${Math.round(chronologicalAge)}.`,
  },
  {
    label: 'Chronosomatic Age',
    body: `How old your body is actually living. DIOS estimates this from sleep timing, light exposure, and Dark Years. When your clock runs late, Chronosomatic Age rises above chronological age.`,
  },
  {
    label: 'Dark Years',
    body: `The gap between the two — ${darkYears} Dark Years in this example. That is time your biology spent in metabolic hibernation because sleep, light, and routine were out of sync with your internal clock.`,
  },
  {
    label: 'Recovery',
    body: `With a re-entrainment plan, DIOS targets recovering ${recoveryYears} years within 90 days — by restoring your light-dark cycle and reducing Dark Years.`,
  },
] as const

const SIGNALS = [
  {
    value: `${darkYearsHours}h`,
    label: 'Dark Years',
    detail: 'Time in metabolic hibernation when your habits and biology diverge.',
  },
  {
    value: String(lightAlignment),
    label: 'Light alignment',
    detail: 'How closely your daily rhythm matches your estimated body-clock phase.',
  },
  {
    value: 'DLMO',
    label: 'Melatonin onset',
    detail: 'When your internal night begins — the anchor for timing meds and sleep.',
  },
] as const

export function CircadianModelView() {
  return (
    <div className="min-h-screen pb-12">
      <main className="mx-auto max-w-2xl px-5 pb-8 pt-20 sm:px-6 sm:pt-24">
        <p className="font-mono text-sm uppercase tracking-widest text-black/50">Circadian model</p>
        <h1 className="mt-2 text-[1.625rem] font-medium leading-tight tracking-tight text-[var(--text-primary)] sm:text-3xl">
          Understanding Chronosomatic Age
        </h1>
        <p className="mt-3 dash-panel-body leading-relaxed text-[var(--text-muted)]">
          Your DIOS dashboard compares two ages side by side.{' '}
          <strong className="font-medium text-[var(--text-primary)]">Chronological age</strong> is how
          long you have lived.{' '}
          <strong className="font-medium text-[var(--text-primary)]">Chronosomatic Age</strong> is how
          old your body is actually living — and Dark Years tell you how much you can recover.
        </p>

        <div className="glass-tile mt-8 p-5">
          <SnapshotAgeRow
            chronologicalAge={chronologicalAge}
            chronosomaticAge={chronosomaticAge}
            darkYears={darkYears}
          />
          <div className="snapshot-cta-bar mt-4">
            <span>
              {bodyClockCta.before}
              <em>{bodyClockCta.highlight}</em>
              {bodyClockCta.after}
            </span>
          </div>
        </div>

        <p className="mt-4 dash-panel-muted leading-relaxed">
          The UK Biobank study of 80,000 people proved that your light-dark cycle determines how fast
          you age metabolically. Dark Years measure time spent in that metabolic hibernation.
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
            What drives Chronosomatic Age
          </p>
          <p className="mt-2 dash-panel-muted leading-relaxed">
            DIOS combines signals from your phone, wearables, and blood panels to estimate phase —
            not a single test score, but a living measure that updates as your rhythm changes.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {SIGNALS.map((signal) => (
              <div key={signal.label} className="glass-panel p-4 text-center">
                <p className="text-xl font-medium text-[var(--dash-metric-brown)]">{signal.value}</p>
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
          <p className="dash-panel-heading">
            See it on your dashboard
          </p>
          <p className="mt-2 dash-panel-muted leading-relaxed">
            The snapshot tile is the starting point — chronological age on the left, Chronosomatic
            Age on the right, and Dark Years in the middle. Everything else on the dashboard
            explains what is adding Dark Years or pushing your Chronosomatic Age up.
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
              Get your Chronosomatic Age →
            </Link>
          </div>
        </div>
      </main>

      <PitchFooter />
    </div>
  )
}
