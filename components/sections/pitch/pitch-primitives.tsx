'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

import type { PitchCitation } from '@/lib/pitch/landing-content'
import { cn } from '@/lib/utils'

import { PitchMediaTile } from './pitch-media-tile'

export function PitchTileEyebrow({
  children,
  light,
}: {
  children: string
  light?: boolean
}) {
  return (
    <p className={cn('pitch-tile-eyebrow', light && 'pitch-tile-eyebrow--light')}>{children}</p>
  )
}

export function PitchTileTitle({
  children,
  as: Tag = 'h2',
  light,
  className,
}: {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3'
  light?: boolean
  className?: string
}) {
  return (
    <Tag className={cn('pitch-tile-title', light && 'pitch-tile-title--light', className)}>
      {children}
    </Tag>
  )
}

export function PitchTileSub({
  children,
  light,
  className,
}: {
  children: ReactNode
  light?: boolean
  className?: string
}) {
  return (
    <p className={cn('pitch-tile-sub', light && 'pitch-tile-sub--light', className)}>{children}</p>
  )
}

export function PitchCiteLink({
  citation,
  light,
}: {
  citation: PitchCitation
  light?: boolean
}) {
  return (
    <a
      href={citation.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('pitch-glow-tile__link', light && 'pitch-glow-tile__link--light')}
    >
      {citation.label}
    </a>
  )
}

/** Single-idea evidence tile — same calm media stack as the hook. */
export function PitchEvidenceCard({
  image,
  imageAlt,
  finding,
  href,
  label,
}: {
  image: string
  imageAlt: string
  finding: string
  href: string
  label: string
}) {
  return (
    <PitchMediaTile image={image} imageAlt={imageAlt} size="card">
      <p className="pitch-tile-finding">{finding}</p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="pitch-glow-tile__link">
        {label} →
      </a>
    </PitchMediaTile>
  )
}

/** Biomarker stat — compact square media tile. */
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
    <PitchMediaTile image={image} imageAlt={imageAlt} size="metric">
      <p className="pitch-glow-tile__metric">{value}</p>
      <p className="pitch-glow-tile__label max-sm:hidden">{label}</p>
      <a href={href} target="_blank" rel="noopener noreferrer" className="pitch-glow-tile__link">
        {cite} →
      </a>
    </PitchMediaTile>
  )
}

/** How-it-works step subsection tile. */
export function PitchStepCard({
  step,
  title,
  body,
  image,
  imageAlt,
  detailsHref,
}: {
  step: string
  title: string
  body: string
  image: string
  imageAlt: string
  detailsHref: string
}) {
  return (
    <li>
      <PitchMediaTile image={image} imageAlt={imageAlt} size="card">
        <span className="pitch-tile-card-eyebrow">{step}</span>
        <p className="pitch-tile-card-title mt-1">{title}</p>
        <p className="pitch-glow-tile__label mt-1 max-sm:hidden">{body}</p>
        <Link href={detailsHref} className="pitch-glow-tile__link mt-1 inline-block">
          View details →
        </Link>
      </PitchMediaTile>
    </li>
  )
}

/** Four-sides audience subsection tile. */
export function PitchAudienceCard({
  emphasis,
  audience,
  line,
  image,
  imageAlt,
  detailsHref,
}: {
  emphasis: string
  audience: string
  line: string
  image: string
  imageAlt: string
  detailsHref: string
}) {
  return (
    <PitchMediaTile image={image} imageAlt={imageAlt} size="card">
      <p className="pitch-tile-card-eyebrow">{emphasis}</p>
      <p className="pitch-tile-card-title mt-1.5">{audience}</p>
      <p className="pitch-glow-tile__label mt-1 max-sm:hidden">{line}</p>
      <Link href={detailsHref} className="pitch-glow-tile__link mt-1 inline-block">
        View details →
      </Link>
    </PitchMediaTile>
  )
}

export function PitchInlineCitations({
  citations,
  light,
}: {
  citations: PitchCitation[]
  light?: boolean
}) {
  return (
    <p
      className={cn(
        'pitch-tile-citations mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-5',
        light ? 'text-white/65' : 'text-white/50'
      )}
    >
      {citations.map((c, i) => (
        <span key={c.href} className="inline-flex items-center gap-2">
          {i > 0 ? <span className={light ? 'text-white/35' : 'text-white/25'} aria-hidden>·</span> : null}
          <PitchCiteLink citation={c} light={light} />
        </span>
      ))}
    </p>
  )
}

export function PitchCtaRow({
  children,
  compact,
}: {
  children: ReactNode
  compact?: boolean
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3',
        compact ? 'mt-5' : 'mt-6 sm:mt-8'
      )}
    >
      {children}
    </div>
  )
}
