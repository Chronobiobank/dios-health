import Link from 'next/link'
import { Activity, ChevronDown, Eye, Sun } from 'lucide-react'
import type { ReactNode } from 'react'

import { BTN_PRIMARY } from '@/components/sections/layout'

import {
  PitchBgInsight,
  PitchBgScale,
  PitchBgSolution,
  PitchBgWhyNow,
  PitchBgWorldChanged,
} from './pitch-backgrounds'

const glassCardStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: '0.5px solid rgba(255, 255, 255, 0.15)',
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
  return (
    <p
      className="font-mono text-[11px] uppercase tracking-widest"
      style={{ color: 'var(--color-brand)' }}
    >
      {children}
    </p>
  )
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
      className="relative flex min-h-svh snap-start flex-col bg-black"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]" aria-hidden>
        {background}
      </div>
      <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col justify-center px-5 py-16 sm:px-6 sm:py-20">
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
    <div
      className="flex flex-col gap-3"
      style={{
        ...glassCardStyle,
        borderRadius: 'var(--radius-md)',
        padding: '1.25rem',
      }}
    >
      <div style={{ color: 'var(--color-brand)' }}>{icon}</div>
      <p className="text-base font-medium text-white lg:text-lg">{title}</p>
      <p className="text-sm leading-relaxed text-white/70 lg:text-[15px]">{body}</p>
    </div>
  )
}

export function PitchDeck() {
  return (
    <div className="h-svh snap-y snap-mandatory overflow-y-auto lg:h-auto lg:snap-none lg:overflow-visible">
      <PitchScreen id="pitch-world-changed" background={<PitchBgWorldChanged />}>
        <PitchEyebrow>THE WORLD HAS CHANGED</PitchEyebrow>
        <h1 className="mt-4 max-w-3xl text-[28px] font-medium leading-tight text-white lg:text-[42px]">
          The human body clock has been optimised over 400,000 years. We decoupled it in 60.
        </h1>
        <p
          className="mt-6 max-w-2xl text-[15px] leading-relaxed lg:text-lg"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          The chronic disease burden of every developed nation is the consequence.
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-insight" background={<PitchBgInsight />}>
        <PitchEyebrow>THE INSIGHT</PitchEyebrow>
        <h1 className="mt-4 max-w-3xl text-[28px] font-medium leading-tight text-white lg:text-[42px]">
          Every medication has a biological clock. Nobody acts on it.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 lg:text-lg">
          The optimal dose window for every common medication has been in peer-reviewed literature for
          40 years. The tool that acts on it has never been built.
        </p>
        <div className="mt-8" style={{ ...glassCardStyle, borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <p
            className="font-mono text-[28px] leading-none lg:text-4xl"
            style={{ color: 'var(--color-brand)' }}
          >
            £500M
          </p>
          <p className="mt-2 text-sm text-white/60 lg:text-sm">
            avoidable NHS admissions annually from medication mistiming
          </p>
        </div>
      </PitchScreen>

      <PitchScreen id="pitch-why-now" background={<PitchBgWhyNow />}>
        <PitchEyebrow>WHY NOW</PitchEyebrow>
        <h1 className="mt-4 max-w-3xl text-[28px] font-medium leading-tight text-white lg:text-[42px]">
          The camera in your pocket can now read your biology.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 lg:text-lg">
          AI made this possible in 2026. Not 2020. Now.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SignalCard
            icon={<Eye className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
            title="Pupillometry"
            body="Melanopsin activity from your front camera"
          />
          <SignalCard
            icon={<Sun className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
            title="Solar zenith"
            body="Vitamin D receptor activation from GPS"
          />
          <SignalCard
            icon={<Activity className="h-5 w-5" strokeWidth={1.5} aria-hidden />}
            title="Blood pulse"
            body="Autonomic state from your rear camera"
          />
        </div>
        <p className="mt-6 font-mono text-[13px] text-white/40">
          Four signals. One body clock reading. No lab. No wearable. No appointment.
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-solution" background={<PitchBgSolution />}>
        <PitchEyebrow>THE SOLUTION</PitchEyebrow>
        <h1 className="mt-4 max-w-3xl text-[28px] font-medium leading-tight text-white lg:text-[42px]">
          DIOS times every dose to your body clock.
        </h1>
        <ul className="mt-8 flex max-w-2xl flex-col gap-4">
          {[
            'Passive measurement. Phone. Bloods. TipTraQ.',
            'Personal protocol. Gominak. Coimbra. Chronodosing.',
            'No forms. Just a conversation with your DIOS timebot.',
          ].map((line) => (
            <li key={line} className="flex gap-3 text-[15px] leading-relaxed text-white lg:text-lg">
              <span style={{ color: 'var(--color-brand)' }} aria-hidden>
                —
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-mono text-[13px] text-white/40">
          Eight medications. Expanding quarterly. NHS-ready.
        </p>
      </PitchScreen>

      <PitchScreen id="pitch-scale" background={<PitchBgScale />}>
        <PitchEyebrow>THE SCALE</PitchEyebrow>
        <h1 className="mt-4 max-w-3xl text-[28px] font-medium leading-tight text-white lg:text-[42px]">
          Every person on a prescription is a potential user.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/70 lg:text-lg">
          The data asset that accumulates is worth more than the platform. A population-level
          chronotype dataset linked to medication outcomes — the dataset that makes precision medicine
          real.
        </p>
        <div className="mt-10 text-center">
          <p
            className="font-mono text-[40px] leading-none lg:text-[56px]"
            style={{ color: 'var(--color-brand)' }}
          >
            4.5Bn
          </p>
          <p className="mt-2 text-base text-white/60">prescriptions dispensed in England last year</p>
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
            className="type-button inline-flex h-10 w-full items-center justify-center rounded-full border px-5 transition-colors sm:h-11 sm:w-auto sm:px-6"
            style={{
              borderColor: 'var(--color-brand)',
              color: 'var(--color-brand)',
              backgroundColor: 'transparent',
            }}
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
          <Link href="/signup/clinician" className="underline-offset-2 hover:underline">
            For clinicians
          </Link>
        </p>
      </PitchScreen>
    </div>
  )
}
