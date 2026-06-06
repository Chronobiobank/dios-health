import Link from 'next/link'
import type { Metadata } from 'next'

import { MarketingShell } from '@/components/sections/marketing-shell'
import { COIMBRA_PARADOX_STATEMENT } from '@/lib/chronobiobank/coimbra-paradox'

export const metadata: Metadata = {
  title: 'Chronobiobank — DIOS',
  description:
    'The first clinical dataset indexed by biological time and clock time together. Cannot be retrofitted.',
}

export default function ChronobiobankPage() {
  return (
    <MarketingShell showFooter={false}>
      <div className="dios-nav-tone-canvas dios-page-top-bleed min-h-svh px-6 pb-16 pt-[calc(var(--dios-site-nav-height,48px)+3rem)]">
        <div className="mx-auto max-w-2xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#b8872e]">
          Data infrastructure
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">Chronobiobank</h1>
        <p className="mt-4 text-sm leading-relaxed text-black/70">
          Every drug was developed assuming clock time. DIOS is built on biological time — and the
          Chronobiobank is the first clinical dataset indexed by both.
        </p>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-black/75">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
            What it is
          </h2>
          <p>
            A dual-indexed outcomes layer: each dose event, lab draw, and sleep session is tagged with
            BTI (biological time) and wall-clock time. Coimbra, Gominak, and circadian cohorts
            contribute structured protocol data with granular, revocable consent.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-black/75">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
            Why it cannot be retrofitted
          </h2>
          <p>
            Medisafe, Huma, and UK Biobank record when a dose happened on the wall clock. They do not
            record biological time at confirmation. Without BTI at dose, chronomedicine outcomes cannot
            be reconstructed from existing datasets.
          </p>
        </section>

        <section className="mt-8 space-y-4 text-sm leading-relaxed text-black/75">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-black/40">
            How to contribute
          </h2>
          <p className="whitespace-pre-line">{COIMBRA_PARADOX_STATEMENT}</p>
          <p>
            Clinical consent and research contribution are separate toggles. Patients control what
            enters the bank; practitioners enrol cohorts through DIOS.
          </p>
        </section>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/onboarding"
            className="rounded bg-dios-aubergine px-5 py-3 text-center font-mono text-xs tracking-wide text-white"
          >
            Start as patient
          </Link>
          <a
            href="mailto:grant@dios.health?subject=Chronobiobank%20cohort%20enquiry"
            className="rounded border border-black/15 px-5 py-3 text-center font-mono text-xs tracking-wide text-black/60"
          >
            Enrol a cohort
          </a>
        </div>
        </div>
      </div>
    </MarketingShell>
  )
}
