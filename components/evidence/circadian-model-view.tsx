import Link from 'next/link'

import { ChronomedicineModelSection } from '@/components/evidence/chronomedicine-model-section'
import { CHRONOMEDICINE_MODEL_INTRO } from '@/lib/evidence/chronotherapy-model-content'

export function CircadianModelView() {
  return (
    <div className="min-h-screen pb-12">
      <main className="patient-dashboard-content pb-8 pt-20 sm:pt-24">
        <p className="font-mono text-xs uppercase tracking-wider text-black/45">
          {CHRONOMEDICINE_MODEL_INTRO.eyebrow}
        </p>
        <h1 className="dash-page-title mt-3">{CHRONOMEDICINE_MODEL_INTRO.title}</h1>
        <p className="mt-3 dash-panel-body leading-relaxed text-[var(--text-muted)]">
          {CHRONOMEDICINE_MODEL_INTRO.lead}
        </p>

        <ChronomedicineModelSection />

        <div className="glass-tile mt-10 p-5">
          <p className="font-mono text-xs uppercase tracking-wider text-black/45">
            Patient view
          </p>
          <p className="mt-2 dash-panel-muted leading-relaxed">
            Chronopathic Age vs Calendar Age — how DIOS tracks whether medication timing is closing your
            chronopenic burden over time.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/how-it-works"
              className="dash-panel-action font-medium text-[var(--researcher-avatar-text)] transition-opacity hover:opacity-80"
            >
              Live dashboard demo →
            </Link>
            <Link
              href="/signup/clinician"
              className="dash-panel-action font-medium text-[var(--text-primary)] transition-opacity hover:opacity-70"
            >
              Clinician sign up →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
