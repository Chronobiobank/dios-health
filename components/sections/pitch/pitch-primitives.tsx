import type { ReactNode } from 'react'

import type { PitchCitation } from '@/lib/pitch/landing-content'

import { PitchVisual } from './pitch-visual'

export function PitchCiteLink({ citation }: { citation: PitchCitation }) {
  return (
    <a
      href={citation.href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[10px] text-calm-brand underline decoration-calm-brand/40 underline-offset-2 sm:text-[11px]"
    >
      {citation.label}
    </a>
  )
}

export function PitchEvidenceCard({
  image,
  imageAlt,
  finding,
  href,
  label,
  caveat,
  caveatHref,
  caveatLabel,
}: {
  image: string
  imageAlt: string
  finding: string
  href: string
  label: string
  caveat?: string
  caveatHref?: string
  caveatLabel?: string
}) {
  return (
    <article className="calm-card flex flex-col overflow-hidden p-0">
      <PitchVisual src={image} alt={imageAlt} aspect="video" />
      <div className="flex flex-col gap-2 p-4">
        <p className="calm-headline text-[15px] leading-snug sm:text-base">{finding}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-calm-brand underline underline-offset-2 w-fit"
        >
          {label} →
        </a>
        {caveat ? (
          <p className="font-mono text-[10px] leading-relaxed text-white/40">
            {caveat}{' '}
            {caveatHref && caveatLabel ? (
              <a href={caveatHref} target="_blank" rel="noopener noreferrer" className="text-calm-brand underline">
                {caveatLabel}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </article>
  )
}

export function PitchStatCard({
  image,
  imageAlt,
  value,
  label,
  href,
  cite,
}: {
  image: string
  imageAlt: string
  value: string
  label: string
  href: string
  cite: string
}) {
  return (
    <div className="calm-card flex flex-col overflow-hidden p-0">
      <PitchVisual src={image} alt={imageAlt} aspect="square" className="max-h-[120px] sm:max-h-none" />
      <div className="flex flex-col gap-1 p-3 sm:p-4">
        <p className="font-mono text-2xl leading-none text-calm-brand sm:text-3xl">{value}</p>
        <p className="calm-body text-xs leading-snug sm:text-sm">{label}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] text-calm-brand underline underline-offset-2"
        >
          {cite} →
        </a>
      </div>
    </div>
  )
}

export function PitchStepCard({
  step,
  title,
  body,
  image,
  imageAlt,
}: {
  step: string
  title: string
  body: string
  image: string
  imageAlt: string
}) {
  return (
    <li className="calm-card flex flex-col overflow-hidden p-0 sm:flex-row sm:items-stretch">
      <PitchVisual src={image} alt={imageAlt} aspect="video" className="sm:aspect-square sm:w-[38%] sm:shrink-0" />
      <div className="flex gap-3 p-4 sm:flex-1 sm:flex-col sm:justify-center sm:p-5">
        <span className="font-mono text-[11px] text-calm-brand">{step}</span>
        <div>
          <p className="calm-headline text-base">{title}</p>
          <p className="calm-body mt-1 text-xs sm:text-sm">{body}</p>
        </div>
      </div>
    </li>
  )
}

export function PitchAudienceCard({
  emphasis,
  audience,
  line,
  image,
  imageAlt,
}: {
  emphasis: string
  audience: string
  line: string
  image: string
  imageAlt: string
}) {
  return (
    <div className="calm-card flex flex-col overflow-hidden p-0">
      <PitchVisual src={image} alt={imageAlt} aspect="video" />
      <div className="p-4">
        <p className="calm-eyebrow text-[10px]">{emphasis}</p>
        <p className="calm-headline mt-2 text-base">{audience}</p>
        <p className="calm-body mt-1 text-xs sm:text-sm">{line}</p>
      </div>
    </div>
  )
}

export function PitchInlineCitations({ citations }: { citations: PitchCitation[] }) {
  return (
    <p className="calm-body mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:mt-5 sm:text-sm">
      {citations.map((c, i) => (
        <span key={c.href} className="inline-flex items-center gap-2">
          {i > 0 ? <span className="text-white/25" aria-hidden>·</span> : null}
          <PitchCiteLink citation={c} />
        </span>
      ))}
    </p>
  )
}

export function PitchCtaRow({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 flex w-full flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">{children}</div>
  )
}
