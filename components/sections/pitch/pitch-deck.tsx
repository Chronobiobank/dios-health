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
import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

import { PitchShadowBackdrop, PitchShadowStyles } from './pitch-backgrounds'
import {
  PitchAudienceCard,
  PitchCtaRow,
  PitchEvidenceCard,
  PitchInlineCitations,
  PitchStatCard,
  PitchStepCard,
} from './pitch-primitives'
import { PitchSpectrumBars } from './pitch-spectrum-bars'
import { PitchVisual } from './pitch-visual'

function ScrollIndicator() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex justify-center md:bottom-8"
      aria-hidden
    >
      <ChevronDown className="h-5 w-5 animate-bounce text-white/35" />
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
  compact,
}: {
  id: string
  backgroundVariant: 0 | 1 | 2 | 3 | 4
  children: ReactNode
  compact?: boolean
}) {
  return (
    <section
      id={id}
      className="pitch-screen relative flex min-h-[100dvh] snap-start snap-always flex-col bg-calm-bg"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <PitchShadowBackdrop variant={backgroundVariant} />
      </div>
      <div
        className={`relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col px-4 pb-20 pt-[calc(var(--dios-site-nav-height)+1.25rem)] sm:px-6 ${
          compact
            ? 'justify-start gap-6'
            : 'justify-start gap-6 md:justify-center md:py-[var(--calm-screen-pad-y)]'
        }`}
      >
        {children}
      </div>
      <ScrollIndicator />
    </section>
  )
}

function PitchTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="calm-headline max-w-xl text-[clamp(1.375rem,5.5vw,2.25rem)] leading-[1.12] tracking-tight">
      {children}
    </h2>
  )
}

const SCREEN_VARIANTS = [0, 1, 2, 3, 4, 0, 1] as const satisfies readonly (0 | 1 | 2 | 3 | 4)[]

export function PitchDeck() {
  return (
    <div className="pitch-deck h-[100dvh] snap-y snap-mandatory overflow-y-auto overscroll-y-contain scroll-smooth md:h-auto md:snap-none md:overflow-visible">
      <PitchShadowStyles />

      <PitchScreen id="pitch-hook" backgroundVariant={SCREEN_VARIANTS[0]}>
        <PitchVisual
          src={PITCH_IMAGES.hook}
          alt="Abstract clinical timing and light"
          priority
          aspect="wide"
          className="max-h-[min(42vw,200px)] md:max-h-[280px]"
        />
        <PitchEyebrow>The hook</PitchEyebrow>
        <h1 className="calm-headline max-w-xl text-[clamp(1.5rem,6vw,2.625rem)] leading-[1.1]">
          £300M in wasted NHS medicines yearly.
        </h1>
        <p className="calm-body max-w-md text-[clamp(0.9375rem,4vw,1.125rem)] text-white/80">
          None of it fixes timing.
        </p>
        <PitchInlineCitations citations={PITCH_HOOK_CITATIONS} />
        <PitchCtaRow>
          <Link href="/signup" className={`${BTN_PRIMARY} h-11 w-full justify-center text-sm sm:w-auto`}>
            Patients — free
          </Link>
          <Link
            href="/signup/clinician"
            className="type-button inline-flex h-11 w-full items-center justify-center rounded-full border border-calm-brand px-5 text-sm text-calm-brand sm:w-auto"
          >
            Clinicians — demo
          </Link>
          <Link
            href="/evidence"
            className="type-button inline-flex h-11 w-full items-center justify-center rounded-full border border-white/15 px-5 text-sm text-white/75 sm:w-auto"
          >
            Science
          </Link>
        </PitchCtaRow>
      </PitchScreen>

      <PitchScreen id="pitch-problem" backgroundVariant={SCREEN_VARIANTS[1]} compact>
        <PitchEyebrow>The problem</PitchEyebrow>
        <PitchTitle>Evidence exists. Delivery doesn&apos;t.</PitchTitle>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {PITCH_PROBLEM_CARDS.map((card) => (
            <PitchEvidenceCard
              key={card.id}
              image={card.image}
              imageAlt={card.imageAlt}
              finding={card.finding}
              href={card.href}
              label={card.label}
              caveat={'caveat' in card ? card.caveat : undefined}
              caveatHref={'caveatHref' in card ? card.caveatHref : undefined}
              caveatLabel={'caveatLabel' in card ? card.caveatLabel : undefined}
            />
          ))}
        </div>
      </PitchScreen>

      <PitchScreen id="pitch-biomarker" backgroundVariant={SCREEN_VARIANTS[2]} compact>
        <PitchEyebrow>The biomarker</PitchEyebrow>
        <PitchTitle>Melanopic Lux at population scale.</PitchTitle>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {PITCH_BIOMARKER_STATS.map((stat) => (
            <PitchStatCard
              key={stat.value + stat.cite}
              image={stat.image}
              imageAlt={stat.imageAlt}
              value={stat.value}
              label={stat.label}
              href={stat.href}
              cite={stat.cite}
            />
          ))}
        </div>
        <p className="calm-body max-w-lg border-l-2 border-calm-brand/30 pl-3 text-xs leading-relaxed sm:text-sm">
          {PITCH_VALIDATION_GAP}
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-spectrum" backgroundVariant={SCREEN_VARIANTS[3]} compact>
        <PitchEyebrow>The spectrum</PitchEyebrow>
        <PitchTitle>Seven nodes. One cascade.</PitchTitle>
        <PitchVisual
          src={PITCH_IMAGES.spectrum}
          alt="Circadian desynchrony spectrum visualization"
          aspect="wide"
          className="max-h-[140px] sm:max-h-[180px]"
        />
        <PitchSpectrumBars />
        <Link
          href="/evidence#spectrum"
          className="font-mono text-[10px] text-calm-brand underline underline-offset-2 sm:text-[11px]"
        >
          Interactive spectrum →
        </Link>
      </PitchScreen>

      <PitchScreen id="pitch-how" backgroundVariant={SCREEN_VARIANTS[4]} compact>
        <PitchEyebrow>How it works</PitchEyebrow>
        <PitchTitle>Light → measure → protocol.</PitchTitle>
        <ol className="flex flex-col gap-3">
          {PITCH_HOW_IT_WORKS.map((item) => (
            <PitchStepCard
              key={item.step}
              step={item.step}
              title={item.title}
              body={item.body}
              image={item.image}
              imageAlt={item.imageAlt}
            />
          ))}
        </ol>
        <p className="calm-body rounded-[var(--calm-radius-card)] border border-white/10 bg-white/5 px-4 py-3 text-xs sm:text-sm">
          {PITCH_CLINICAL_DISCLAIMER}
        </p>
        <PitchCtaRow>
          <Link href="/mel" className={`${BTN_PRIMARY} h-11 w-full justify-center text-sm sm:w-auto`}>
            Try Mel free →
          </Link>
        </PitchCtaRow>
      </PitchScreen>

      <PitchScreen id="pitch-four-sides" backgroundVariant={SCREEN_VARIANTS[5]} compact>
        <PitchEyebrow>Four sides</PitchEyebrow>
        <PitchTitle>One platform.</PitchTitle>
        <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4">
          {PITCH_FOUR_SIDES.map((side) => (
            <PitchAudienceCard
              key={side.audience}
              emphasis={side.emphasis}
              audience={side.audience}
              line={side.line}
              image={side.image}
              imageAlt={side.imageAlt}
            />
          ))}
        </div>
      </PitchScreen>

      <PitchScreen id="pitch-model" backgroundVariant={SCREEN_VARIANTS[6]}>
        <PitchVisual
          src={PITCH_IMAGES.model}
          alt="Chronobiobank consent and data governance"
          aspect="wide"
          className="max-h-[min(36vw,180px)] md:max-h-[220px]"
        />
        <PitchEyebrow>The model</PitchEyebrow>
        <PitchTitle>Chronobiobank.</PitchTitle>
        <p className="calm-body max-w-md text-sm">
          Clinical consent separate from optional research. You control identifiable data.
        </p>
        <ul className="flex max-w-md flex-col gap-2">
          {PITCH_CHRONOBIOBANK_STEPS.map((step) => (
            <li key={step} className="calm-body flex gap-2 text-xs sm:text-sm">
              <span className="text-calm-brand" aria-hidden>
                —
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        <PitchCtaRow>
          <Link href="/signup" className={`${BTN_PRIMARY} h-11 w-full justify-center text-sm sm:w-auto`}>
            Get started
          </Link>
          <a
            href={`mailto:${RESEARCH_ENQUIRIES_EMAIL}?subject=Chronobiobank%20research%20enquiry`}
            className="type-button inline-flex h-11 w-full items-center justify-center rounded-full border border-calm-brand px-5 text-sm text-calm-brand sm:w-auto"
          >
            Research →
          </a>
        </PitchCtaRow>
        <a
          href={`mailto:${RESEARCH_ENQUIRIES_EMAIL}`}
          className="font-mono text-[10px] text-calm-brand underline underline-offset-2"
        >
          {RESEARCH_ENQUIRIES_EMAIL}
        </a>
      </PitchScreen>
    </div>
  )
}
