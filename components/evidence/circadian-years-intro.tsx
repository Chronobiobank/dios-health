import Link from 'next/link'

import { SnapshotAgeRow } from '@/components/patient-dashboard/snapshot-age-row'
import { MOCK_PATIENT_SNAPSHOT } from '@/lib/patient-dashboard/mock-snapshot'

const { chronologicalAge, circadianAge, yearsLost, recoveryYears } = MOCK_PATIENT_SNAPSHOT

export function CircadianYearsIntro() {
  return (
    <section className="mb-8">
      <p className="font-mono text-xs uppercase tracking-widest text-black/50">Circadian model</p>
      <h1 className="mt-2 max-w-2xl text-2xl font-medium tracking-tight text-[var(--text-primary)] sm:text-3xl">
        Calendar years vs circadian years
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--text-muted)]">
        Your DIOS dashboard opens with a snapshot of two ages side by side.{' '}
        <strong className="font-medium text-[var(--text-primary)]">Calendar years</strong> are how
        long you have lived.{' '}
        <strong className="font-medium text-[var(--text-primary)]">Circadian years</strong> are how
        old your body clock behaves — when sleep, light, and dose timing drift out of sync, the gap
        widens.
      </p>

      <div className="glass-tile mt-6 max-w-md p-5">
        <SnapshotAgeRow
          chronologicalAge={chronologicalAge}
          circadianAge={circadianAge}
          yearsLost={yearsLost}
        />
      </div>

      <div className="mt-5 grid max-w-2xl gap-4 text-[14px] leading-relaxed text-[var(--text-muted)] sm:grid-cols-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-black/45">Calendar years</p>
          <p className="mt-1">
            Chronological age from your date of birth — the number on your records ({Math.round(chronologicalAge)}).
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-black/45">Circadian years</p>
          <p className="mt-1">
            Biological age inferred from DLMO, sleep timing, light exposure, and social jetlag ({circadianAge}).
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-[var(--text-muted)]">
        The arrow between them is{' '}
        <strong className="font-medium text-[var(--dash-metric-loss)]">{yearsLost} years lost</strong>{' '}
        to circadian drift — recoverable with a re-entrainment plan (typically{' '}
        <strong className="font-medium text-[var(--researcher-avatar-text)]">{recoveryYears} years</strong>{' '}
        in 90 days). Everything below maps the clinical signals DIOS uses to compute these numbers.
      </p>

      <Link
        href="/how-it-works"
        className="mt-5 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--researcher-avatar-text)] transition-opacity hover:opacity-80"
      >
        See the live dashboard demo →
      </Link>
    </section>
  )
}
