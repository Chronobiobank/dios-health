import type { ReactNode } from 'react'

import type { PitchCitation } from '@/lib/pitch/landing-content'

export function PitchCiteLink({ citation }: { citation: PitchCitation }) {
  return (
    <a
      href={citation.href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[11px] text-calm-brand underline decoration-calm-brand/40 underline-offset-2 transition-opacity hover:opacity-80"
    >
      {citation.label}
    </a>
  )
}

export function PitchEvidenceCard({
  finding,
  detail,
  href,
  label,
  caveat,
  caveatHref,
  caveatLabel,
}: {
  finding: string
  detail: string
  href: string
  label: string
  caveat?: string
  caveatHref?: string
  caveatLabel?: string
}) {
  return (
    <article className="calm-card flex flex-col gap-3 p-5 lg:p-6">
      <p className="calm-headline text-base lg:text-[17px]">{finding}</p>
      <p className="calm-body text-sm">{detail}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-calm-brand underline decoration-calm-brand/40 underline-offset-2 w-fit"
      >
        {label} →
      </a>
      {caveat ? (
        <p className="border-t border-white/10 pt-3 font-mono text-[10px] leading-relaxed text-white/45">
          {caveat}{' '}
          {caveatHref && caveatLabel ? (
            <a
              href={caveatHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-calm-brand underline underline-offset-2"
            >
              {caveatLabel}
            </a>
          ) : null}
        </p>
      ) : null}
    </article>
  )
}

export function PitchStatCard({
  value,
  label,
  href,
  cite,
}: {
  value: string
  label: string
  href: string
  cite: string
}) {
  return (
    <div className="calm-card flex flex-col gap-2 p-5 lg:p-6">
      <p className="font-mono text-[32px] leading-none text-calm-brand lg:text-[40px]">{value}</p>
      <p className="calm-body text-sm">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] text-calm-brand underline decoration-calm-brand/40 underline-offset-2"
      >
        {cite} →
      </a>
    </div>
  )
}

export function PitchInlineCitations({ citations }: { citations: PitchCitation[] }) {
  return (
    <p className="calm-body mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
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
    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-12">{children}</div>
  )
}
