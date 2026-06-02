'use client'

import type { CSSProperties, ReactNode } from 'react'

import type { PitchCitation } from '@/lib/pitch/landing-content'
import { PITCH_GLOW_GRADIENT, type PitchGlowVariant } from '@/lib/pitch/tile-gradients'

import { PitchVisual } from './pitch-visual'

function glowStyle(variant: PitchGlowVariant): CSSProperties {
  const g = PITCH_GLOW_GRADIENT[variant]
  return {
    ['--pitch-tile-gradient' as string]: g.css,
    ['--pitch-tile-glow' as string]: g.glow,
  }
}

export function PitchGlowTile({
  variant,
  className,
  metric,
  video,
  children,
}: {
  variant: PitchGlowVariant
  className?: string
  metric?: boolean
  /** Video tiles skip full-card gradient wash so media stays visible */
  video?: boolean
  children: ReactNode
}) {
  return (
    <article
      className={`pitch-glow-tile${metric ? ' pitch-glow-tile--metric' : ''}${video ? ' pitch-glow-tile--video' : ''}${className ? ` ${className}` : ''}`}
      style={glowStyle(variant)}
    >
      <div className="pitch-glow-tile__inner">{children}</div>
    </article>
  )
}

type PitchMediaTileProps = {
  variant: PitchGlowVariant
  media: ReactNode
  /** Taller 16/10 media area (hook, feature tiles) */
  hero?: boolean
  /** Wide shallow tile (spectrum, model) */
  wide?: boolean
  /** Full-opacity video — no image blend */
  video?: boolean
  children?: ReactNode
  className?: string
}

/** OpenAI-style tile: media on top, optional copy in the card body. */
export function PitchMediaTile({
  variant,
  media,
  hero,
  wide,
  video,
  children,
  className,
}: PitchMediaTileProps) {
  const mediaClass = [
    'pitch-glow-tile__media',
    hero ? 'pitch-glow-tile__media--hero' : '',
    wide ? 'pitch-glow-tile__media--wide' : '',
    video ? 'pitch-glow-tile__media--video' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <PitchGlowTile variant={variant} video={video} className={className}>
      <div className={mediaClass}>{media}</div>
      {children ? <div className="pitch-glow-tile__body">{children}</div> : null}
    </PitchGlowTile>
  )
}

export function PitchCiteLink({ citation }: { citation: PitchCitation }) {
  return (
    <a
      href={citation.href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-mono text-[10px] text-white/55 underline decoration-white/25 underline-offset-2 hover:text-white/80 sm:text-[11px]"
    >
      {citation.label}
    </a>
  )
}

export function PitchEvidenceCard({
  gradient,
  image,
  imageAlt,
  finding,
  href,
  label,
  caveat,
  caveatHref,
  caveatLabel,
}: {
  gradient: PitchGlowVariant
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
    <PitchGlowTile variant={gradient}>
      <div className="pitch-glow-tile__media pitch-glow-tile__media--short">
        <PitchVisual src={image} alt={imageAlt} aspect="video" rounded={false} overlay={false} />
      </div>
      <div className="pitch-glow-tile__body">
        <p className="text-[15px] font-medium leading-snug text-white sm:text-base">{finding}</p>
        <a href={href} target="_blank" rel="noopener noreferrer" className="pitch-glow-tile__link">
          {label} →
        </a>
        {caveat ? (
          <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/40">
            {caveat}{' '}
            {caveatHref && caveatLabel ? (
              <a href={caveatHref} target="_blank" rel="noopener noreferrer" className="text-white/60 underline">
                {caveatLabel}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
    </PitchGlowTile>
  )
}

export function PitchStatCard({
  gradient,
  image,
  imageAlt,
  value,
  label,
  href,
  cite,
}: {
  gradient: PitchGlowVariant
  image: string
  imageAlt: string
  value: string
  label: string
  href: string
  cite: string
}) {
  return (
    <PitchGlowTile variant={gradient} metric>
      <div className="pitch-glow-tile__media" aria-hidden>
        <PitchVisual src={image} alt={imageAlt} aspect="square" rounded={false} overlay={false} />
      </div>
      <div className="pitch-glow-tile__body">
        <p className="pitch-glow-tile__metric">{value}</p>
        <p className="pitch-glow-tile__label">{label}</p>
        <a href={href} target="_blank" rel="noopener noreferrer" className="pitch-glow-tile__link">
          {cite} →
        </a>
      </div>
    </PitchGlowTile>
  )
}

export function PitchStepCard({
  gradient,
  step,
  title,
  body,
  image,
  imageAlt,
}: {
  gradient: PitchGlowVariant
  step: string
  title: string
  body: string
  image: string
  imageAlt: string
}) {
  return (
    <li>
      <PitchGlowTile variant={gradient}>
        <div className="pitch-glow-tile__media">
          <PitchVisual src={image} alt={imageAlt} aspect="video" rounded={false} overlay={false} />
        </div>
        <div className="pitch-glow-tile__body">
          <span className="font-mono text-[11px] text-white/45">{step}</span>
          <p className="mt-1 text-base font-medium text-white">{title}</p>
          <p className="pitch-glow-tile__label mt-1">{body}</p>
        </div>
      </PitchGlowTile>
    </li>
  )
}

export function PitchAudienceCard({
  gradient,
  emphasis,
  audience,
  line,
  image,
  imageAlt,
}: {
  gradient: PitchGlowVariant
  emphasis: string
  audience: string
  line: string
  image: string
  imageAlt: string
}) {
  return (
    <PitchGlowTile variant={gradient}>
      <div className="pitch-glow-tile__media pitch-glow-tile__media--short">
        <PitchVisual src={image} alt={imageAlt} aspect="video" rounded={false} overlay={false} />
      </div>
      <div className="pitch-glow-tile__body">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">{emphasis}</p>
        <p className="mt-1.5 text-base font-medium text-white">{audience}</p>
        <p className="pitch-glow-tile__label mt-1">{line}</p>
      </div>
    </PitchGlowTile>
  )
}

export function PitchInlineCitations({ citations }: { citations: PitchCitation[] }) {
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-white/50 sm:mt-5 sm:text-sm">
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
