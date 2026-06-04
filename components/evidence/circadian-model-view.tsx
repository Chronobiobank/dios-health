import Link from 'next/link'

import { SnapshotAgeRow } from '@/components/patient-dashboard/snapshot-age-row'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'
import { MOCK_PATIENT_SNAPSHOT } from '@/lib/patient-dashboard/mock-snapshot'
import { formatBodyClockCta } from '@/lib/patient-dashboard/tile-copy'

const {
  chronologicalAge,
  circadianAge,
  yearsLost,
  recoveryYears,
  socialJetlag,
  syncScore,
} = MOCK_PATIENT_SNAPSHOT

const bodyClockCta = formatBodyClockCta(recoveryYears)

const EXPLAINERS = [
  {
    label: 'Calendar age',
    body: `How long you have lived — the number on your records. For most people this is ${Math.round(chronologicalAge)}.`,
  },
  {
    label: 'Circadian age',
    body: `How old your body clock behaves. DIOS estimates this from sleep timing, light exposure, and social jetlag. When your clock runs late, circadian age rises above calendar age.`,
  },
  {
    label: 'Years lost',
    body: `The gap between the two — ${yearsLost} years in this example. That is time your biology has aged faster because sleep, light, and routine are out of sync with your internal clock.`,
  },
  {
    label: 'Recovery',
    body: `With a re-entrainment plan, DIOS targets recovering ${recoveryYears} of those years in 90 days — by shifting sleep, light, and dose timing back toward your natural phase.`,
  },
] as const

const SIGNALS = [
  {
    value: `${socialJetlag}h`,
    label: 'Social jetlag',
    detail: 'How far your sleep midpoint drifts between workdays and free days.',
  },
  {
    value: String(syncScore),
    label: 'Sync score',
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
          Understanding circadian age
        </h1>
        <p className="mt-3 dash-panel-body leading-relaxed text-[var(--text-muted)]">
          Your DIOS dashboard compares two ages side by side.{' '}
          <strong className="font-medium text-[var(--text-primary)]">Calendar age</strong> is how
          long you have lived.{' '}
          <strong className="font-medium text-[var(--text-primary)]">Circadian age</strong> is how
          old your body clock behaves — and the difference tells you how much drift you can recover.
        </p>

        <div className="glass-tile mt-8 p-5">
          <SnapshotAgeRow
            chronologicalAge={chronologicalAge}
            circadianAge={circadianAge}
            yearsLost={yearsLost}
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
          On your dashboard, circadian age appears as{' '}
          <span className="font-mono text-xs uppercase tracking-wider text-black/55">
            circadian years
          </span>{' '}
          — the same number, in the language of your snapshot tile.
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
            What drives circadian age
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
            The snapshot tile is the starting point — calendar years on the left, circadian years on
            the right, and years lost to jetlag in the middle. Everything else on the dashboard
            explains what is pushing your circadian age up or down.
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
              Get your circadian age →
            </Link>
          </div>
        </div>
      </main>

      <PitchFooter />
    </div>
  )
}
