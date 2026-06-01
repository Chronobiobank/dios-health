import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

import { BTN_PRIMARY } from '@/components/sections/layout'
import {
  PITCH_BIOMARKER_STATS,
  PITCH_CHRONOBIOBANK_STEPS,
  PITCH_CLINICAL_DISCLAIMER,
  PITCH_FOUR_SIDES,
  PITCH_HOOK_CITATIONS,
  PITCH_HOW_IT_WORKS,
  PITCH_PROBLEM_CARDS,
  PITCH_VALIDATION_GAP,
  RESEARCH_ENQUIRIES_EMAIL,
} from '@/lib/pitch/landing-content'

import { PitchShadowBackdrop, PitchShadowStyles } from './pitch-backgrounds'
import {
  PitchCtaRow,
  PitchEvidenceCard,
  PitchInlineCitations,
  PitchStatCard,
} from './pitch-primitives'
import { PitchSpectrumBars } from './pitch-spectrum-bars'

function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center lg:hidden"
      aria-hidden
    >
      <ChevronDown className="h-6 w-6 animate-bounce text-white/40" />
    </div>
  )
}

function PitchEyebrow({ children }: { children: string }) {
  return <p className="calm-eyebrow">{children}</p>
}

function PitchScreen({
  id,
  backgroundVariant,
  children,
}: {
  id: string
  backgroundVariant: 0 | 1 | 2 | 3 | 4
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-svh snap-start flex-col bg-calm-bg"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <PitchShadowBackdrop variant={backgroundVariant} />
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col justify-center px-[var(--calm-screen-pad-x)] py-[var(--calm-screen-pad-y)] sm:px-6">
        {children}
      </div>
      <ScrollIndicator />
    </section>
  )
}

const SCREEN_VARIANTS = [0, 1, 2, 3, 4, 0, 1] as const satisfies readonly (0 | 1 | 2 | 3 | 4)[]

export function PitchDeck() {
  return (
    <div className="h-svh snap-y snap-mandatory overflow-y-auto lg:h-auto lg:snap-none lg:overflow-visible">
      <PitchShadowStyles />

      {/* Screen 1 — The hook */}
      <PitchScreen id="pitch-hook" backgroundVariant={SCREEN_VARIANTS[0]}>
        <PitchEyebrow>THE HOOK</PitchEyebrow>
        <h1 className="calm-headline mt-6 max-w-3xl text-[28px] lg:mt-8 lg:text-[42px]">
          £300 million in wasted NHS medications every year.
        </h1>
        <p className="calm-headline mt-4 max-w-2xl text-[22px] font-normal text-white/85 lg:text-[28px]">
          Not one pound of it addresses the timing.
        </p>
        <PitchInlineCitations citations={PITCH_HOOK_CITATIONS} />
        <PitchCtaRow>
          <Link href="/signup" className={`${BTN_PRIMARY} w-full justify-center sm:w-auto`}>
            I am a patient → Get started free
          </Link>
          <Link
            href="/signup/clinician"
            className="type-button inline-flex h-10 w-full items-center justify-center rounded-full border border-calm-brand bg-transparent px-5 text-calm-brand transition-colors sm:h-11 sm:w-auto sm:px-6"
          >
            I am a clinician → Book a demo
          </Link>
          <Link
            href="/evidence"
            className="type-button inline-flex h-10 w-full items-center justify-center rounded-full border border-white/20 bg-transparent px-5 text-white/80 transition-colors hover:border-white/40 sm:h-11 sm:w-auto sm:px-6"
          >
            Read the science
          </Link>
        </PitchCtaRow>
      </PitchScreen>

      {/* Screen 2 — The problem */}
      <PitchScreen id="pitch-problem" backgroundVariant={SCREEN_VARIANTS[1]}>
        <PitchEyebrow>THE PROBLEM</PitchEyebrow>
        <h2 className="calm-headline mt-6 max-w-2xl text-[26px] lg:mt-8 lg:text-[36px]">
          Timing is evidence-based. Delivery is not.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-12 lg:gap-5">
          {PITCH_PROBLEM_CARDS.map((card) => (
            <PitchEvidenceCard
              key={card.id}
              finding={card.finding}
              detail={card.detail}
              href={card.href}
              label={card.label}
              caveat={'caveat' in card ? card.caveat : undefined}
              caveatHref={'caveatHref' in card ? card.caveatHref : undefined}
              caveatLabel={'caveatLabel' in card ? card.caveatLabel : undefined}
            />
          ))}
        </div>
      </PitchScreen>

      {/* Screen 3 — The biomarker */}
      <PitchScreen id="pitch-biomarker" backgroundVariant={SCREEN_VARIANTS[2]}>
        <PitchEyebrow>THE BIOMARKER</PitchEyebrow>
        <h2 className="calm-headline mt-6 max-w-3xl text-[26px] lg:mt-8 lg:text-[36px]">
          Melanopic Lux — measured at population scale.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 xs:grid-cols-2 lg:mt-12 lg:grid-cols-4 lg:gap-5">
          {PITCH_BIOMARKER_STATS.map((stat) => (
            <PitchStatCard
              key={stat.value}
              value={stat.value}
              label={stat.label}
              href={stat.href}
              cite={stat.cite}
            />
          ))}
        </div>
        <p className="calm-body mt-8 max-w-3xl border-l-2 border-calm-brand/40 pl-4 text-sm lg:mt-10">
          {PITCH_VALIDATION_GAP}
        </p>
      </PitchScreen>

      {/* Screen 4 — The spectrum */}
      <PitchScreen id="pitch-spectrum" backgroundVariant={SCREEN_VARIANTS[3]}>
        <PitchEyebrow>THE SPECTRUM</PitchEyebrow>
        <h2 className="calm-headline mt-6 max-w-3xl text-[26px] lg:mt-8 lg:text-[36px]">
          Seven nodes. One circadian cascade.
        </h2>
        <p className="calm-body mt-4 max-w-2xl text-sm">
          Circadian Desynchrony Spectrum — demo profile from Vaya Layer 1 data. Each node links to
          its primary evidence base.
        </p>
        <PitchSpectrumBars />
        <p className="mt-6">
          <Link
            href="/evidence#spectrum"
            className="font-mono text-[11px] text-calm-brand underline underline-offset-2"
          >
            Full interactive spectrum on the evidence page →
          </Link>
        </p>
      </PitchScreen>

      {/* Screen 5 — How it works */}
      <PitchScreen id="pitch-how" backgroundVariant={SCREEN_VARIANTS[4]}>
        <PitchEyebrow>HOW IT WORKS</PitchEyebrow>
        <h2 className="calm-headline mt-6 max-w-2xl text-[26px] lg:mt-8 lg:text-[36px]">
          Three steps from light to protocol.
        </h2>
        <ol className="mt-10 flex max-w-3xl flex-col gap-5 lg:mt-12">
          {PITCH_HOW_IT_WORKS.map((item) => (
            <li key={item.step} className="calm-card flex gap-5 p-6 lg:p-7">
              <span className="font-mono text-[13px] text-calm-brand">{item.step}</span>
              <div>
                <p className="calm-headline text-lg">{item.title}</p>
                <p className="calm-body mt-2 text-sm">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="calm-body mt-8 max-w-2xl border border-white/10 rounded-[var(--calm-radius-card)] bg-white/5 px-5 py-4 text-sm">
          {PITCH_CLINICAL_DISCLAIMER}
        </p>
        <PitchCtaRow>
          <Link href="/vaya" className={`${BTN_PRIMARY} w-full justify-center sm:w-auto`}>
            Try Vaya free →
          </Link>
        </PitchCtaRow>
      </PitchScreen>

      {/* Screen 6 — Four sides */}
      <PitchScreen id="pitch-four-sides" backgroundVariant={SCREEN_VARIANTS[5]}>
        <PitchEyebrow>FOUR SIDES</PitchEyebrow>
        <h2 className="calm-headline mt-6 max-w-2xl text-[26px] lg:mt-8 lg:text-[36px]">
          One platform. Four stakeholders.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-12 lg:gap-5">
          {PITCH_FOUR_SIDES.map((side) => (
            <div key={side.audience} className="calm-card p-6 lg:p-7">
              <p className="calm-eyebrow">{side.emphasis}</p>
              <p className="calm-headline mt-3 text-lg">{side.audience}</p>
              <p className="calm-body mt-3 text-sm">{side.line}</p>
            </div>
          ))}
        </div>
      </PitchScreen>

      {/* Screen 7 — The model */}
      <PitchScreen id="pitch-model" backgroundVariant={SCREEN_VARIANTS[6]}>
        <PitchEyebrow>THE MODEL</PitchEyebrow>
        <h2 className="calm-headline mt-6 max-w-3xl text-[26px] lg:mt-8 lg:text-[36px]">
          Chronobiobank infrastructure.
        </h2>
        <p className="calm-body mt-6 max-w-2xl">
          Dynamic consent separates clinical use from optional research contribution. Identifiable
          health data stays under patient control; anonymised streams may support governed research
          licensing.
        </p>
        <ul className="mt-8 flex max-w-2xl flex-col gap-4">
          {PITCH_CHRONOBIOBANK_STEPS.map((step) => (
            <li key={step} className="calm-body flex gap-3 text-sm lg:text-base">
              <span className="text-calm-brand" aria-hidden>
                —
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        <PitchCtaRow>
          <Link href="/signup" className={`${BTN_PRIMARY} w-full justify-center sm:w-auto`}>
            Get started free
          </Link>
          <a
            href={`mailto:${RESEARCH_ENQUIRIES_EMAIL}?subject=Chronobiobank%20research%20enquiry`}
            className="type-button inline-flex h-10 w-full items-center justify-center rounded-full border border-calm-brand bg-transparent px-5 text-calm-brand transition-colors sm:h-11 sm:w-auto sm:px-6"
          >
            Research enquiries →
          </a>
        </PitchCtaRow>
        <p className="mt-6 font-mono text-[11px] text-white/40">
          <a
            href={`mailto:${RESEARCH_ENQUIRIES_EMAIL}`}
            className="text-calm-brand underline underline-offset-2"
          >
            {RESEARCH_ENQUIRIES_EMAIL}
          </a>
        </p>
      </PitchScreen>
    </div>
  )
}
