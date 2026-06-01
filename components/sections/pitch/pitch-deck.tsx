import Link from 'next/link'
import { Activity, ChevronDown, Eye, Sun } from 'lucide-react'
import type { ReactNode } from 'react'

import { BTN_PRIMARY } from '@/components/sections/layout'

import { PitchShadowBackdrop, PitchShadowStyles } from './pitch-backgrounds'

const CALM_CARD_RADIUS = 'var(--calm-radius-card, 16px)'

const glassCardStyle = {
  backgroundColor: 'rgb(15 15 15 / 0.72)',
  border: '0.5px solid rgb(255 255 255 / 0.12)',
  borderRadius: CALM_CARD_RADIUS,
} as const

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
  background,
  children,
}: {
  id: string
  background: ReactNode
  children: ReactNode
}) {
  return (
    <section
      id={id}
      className="relative flex min-h-svh snap-start flex-col bg-calm-bg"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {background}
      </div>
      <div
        className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col justify-center px-[var(--calm-screen-pad-x)] py-[var(--calm-screen-pad-y)] sm:px-6"
      >
        {children}
      </div>
      <ScrollIndicator />
    </section>
  )
}

function SignalCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) {
  return (
    <div className="calm-card flex flex-col gap-4 p-6 lg:p-7">
      <div className="text-calm-brand">{icon}</div>
      <p className="calm-headline text-base lg:text-lg">{title}</p>
      <p className="calm-body text-sm lg:text-[15px]">{body}</p>
    </div>
  )
}

export function PitchDeck() {
  return (
    <div className="h-svh snap-y snap-mandatory overflow-y-auto lg:h-auto lg:snap-none lg:overflow-visible">
      <PitchShadowStyles />
      <PitchScreen id="pitch-world-changed" background={<PitchShadowBackdrop variant={0} />}>
        <PitchEyebrow>THE WORLD HAS CHANGED</PitchEyebrow>
        <h1 className="calm-headline mt-6 max-w-3xl text-[28px] lg:mt-8 lg:text-[42px]">
          89,000 people. 13 million hours of light.
        </h1>
        <p className="calm-body mt-8 max-w-2xl lg:mt-10">
          More light by day. More dark by night. Less disease. DIOS measures it.
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-insight" background={<PitchShadowBackdrop variant={1} />}>
        <PitchEyebrow>THE INSIGHT</PitchEyebrow>
        <h1 className="calm-headline mt-6 max-w-3xl text-[28px] lg:mt-8 lg:text-[42px]">
          Every drug has a clock. Nobody uses it.
        </h1>
        <p className="calm-body mt-8 max-w-2xl lg:mt-10">
          Optimal dose windows have been published for 40 years. The tool to act on them still doesn&apos;t exist.
        </p>
        <div className="calm-card mt-10 p-6 lg:mt-12 lg:p-8">
          <p className="font-mono text-[28px] leading-none text-calm-brand lg:text-4xl">
            £500M
          </p>
          <p className="calm-body mt-3 text-sm">
            avoidable NHS admissions from mistimed medication
          </p>
        </div>
        <div className="calm-card mt-6 max-w-2xl p-6 lg:mt-8">
          <p className="calm-eyebrow mb-4">
            UK BIOBANK · POPULATION VALIDATION
          </p>
          <p className="calm-body text-sm">
            89,000 participants · 13M sensor hours · PNAS · Lancet · JAMA. More daylight, more darkness — less T2DM, heart failure, AF, stroke, and psychiatric disease.
          </p>
          <p className="mt-4 font-mono text-[11px] text-white/40">
            Vaya measures the biomarker. DIOS delivers the correction. No clinic visit required.
          </p>
        </div>
      </PitchScreen>

      <PitchScreen id="pitch-why-now" background={<PitchShadowBackdrop variant={2} />}>
        <PitchEyebrow>WHY NOW</PitchEyebrow>
        <h1 className="calm-headline mt-6 max-w-3xl text-[28px] lg:mt-8 lg:text-[42px]">
          Vaya reads your light biology. In 60 seconds. From your front camera.
        </h1>
        <p className="calm-body mt-8 max-w-2xl lg:mt-10">
          Vaya is the DIOS camera session. It measures Melanopic Lux — the direct entraining
          signal to your master clock — using your smartphone, GPS, and time of day.
          No wearable. No lab. No appointment.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-5 xs:grid-cols-1 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          <SignalCard
            icon={<Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
            title="Melanopic Lux"
            body="Master clock signal from your front camera. Measured, not estimated."
          />
          <SignalCard
            icon={<Sun className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
            title="Solar zenith"
            body="GPS + time of day — your outdoor light baseline."
          />
          <SignalCard
            icon={<Activity className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
            title="Autonomic state"
            body="HRV from TipTraQ — your body&apos;s response to light dose."
          />
        </div>
        <p className="mt-6 font-mono text-[13px] text-white/40">
          Vaya · Melanopic Lux · CIE S026 · Validated at 89,000-person scale
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-solution" background={<PitchShadowBackdrop variant={3} />}>
        <PitchEyebrow>THE SOLUTION</PitchEyebrow>
        <h1 className="calm-headline mt-6 max-w-3xl text-[28px] lg:mt-8 lg:text-[42px]">
          Vaya measures your clock. DIOS times your doses.
        </h1>
        <ul className="mt-10 flex max-w-2xl flex-col gap-5 lg:mt-12">
          {[
            'Melanopic lux — the UK Biobank biomarker for chronic disease.',
            'Personal protocol: Gominak · Coimbra · chronodosing for 8 medications.',
            'No forms. Vaya asks the questions. Your camera does the measuring.',
          ].map((line) => (
            <li key={line} className="calm-body flex gap-3 lg:text-lg">
              <span className="text-calm-brand" aria-hidden>
                —
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-[13px] text-white/40">
          Passive. Predictive. NHS-ready.
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-scale" background={<PitchShadowBackdrop variant={4} />}>
        <PitchEyebrow>THE SCALE</PitchEyebrow>
        <h1 className="calm-headline mt-6 max-w-3xl text-[28px] lg:mt-8 lg:text-[42px]">
          Every prescription is a potential user.
        </h1>
        <p className="calm-body mt-8 max-w-2xl lg:mt-10">
          UK Biobank validated the biomarker at scale. DIOS measures it continuously — and corrects it. The first longitudinal melanopic lux dataset linked to medication outcomes.
        </p>
        <div className="mt-10 text-center">
          <p className="font-mono text-[40px] leading-none text-calm-brand lg:text-[56px]">
            4.5Bn
          </p>
          <p className="calm-body mt-3 text-base">prescriptions in England last year</p>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/signup/clinician"
            className={`${BTN_PRIMARY} w-full justify-center sm:w-auto`}
          >
            I am a clinician → Book a demo
          </Link>
          <Link
            href="/signup"
            className="type-button inline-flex h-10 w-full items-center justify-center rounded-full border border-calm-brand bg-transparent px-5 text-calm-brand transition-colors sm:h-11 sm:w-auto sm:px-6"
          >
            I am a patient → Get started free
          </Link>
        </div>
        <p className="mt-8 text-center font-mono text-[11px] leading-relaxed text-white/30">
          <Link href="/evidence/tiptraq" className="underline-offset-2 hover:underline">
            Read the science
          </Link>
          <span className="mx-3">·</span>
          <Link href="/evidence#spectrum" className="underline-offset-2 hover:underline">
            See the cascade
          </Link>
          <span className="mx-3">·</span>
          <Link href="/signup" className="underline-offset-2 hover:underline">
            Try Vaya free
          </Link>
          <span className="mx-3">·</span>
          <Link href="/signup/clinician" className="underline-offset-2 hover:underline">
            For clinicians
          </Link>
        </p>
      </PitchScreen>
    </div>
  )
}
