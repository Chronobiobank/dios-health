import Link from 'next/link'
import { Fragment } from 'react'

import {
  getHomepageResearchers,
  RESEARCHERS,
  RESEARCHERS_INTRO,
  type Researcher,
} from '@/lib/researchers'

import { BODY, SECTION_TITLE } from './layout'

/** Renders *italic* segments in plain strings */
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className="font-normal italic">
            {part.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </span>
  )
}

function ResearcherCard({ researcher }: { researcher: Researcher }) {
  return (
    <article className="researcher-card rounded-lg border-[0.5px] border-[var(--researcher-card-border)] bg-[var(--researcher-card-bg)] p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--researcher-avatar-bg)] font-mono text-sm font-medium text-[var(--researcher-avatar-text)]"
        aria-hidden
      >
        {researcher.initials}
      </div>
      <div className="mt-3 space-y-2">
        <h4 className="font-sans text-sm font-medium leading-snug text-[var(--text-primary)]">
          {researcher.name}
        </h4>
        <p className="font-mono text-[11px] tracking-[0.04em] text-[var(--text-hint)]">
          {researcher.institution}
        </p>
        <p className="font-mono text-[11px] leading-snug text-[var(--text-hint)]">
          {researcher.role}
        </p>
        <p className="text-xs font-light leading-[1.5] text-[var(--text-muted)]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
            Key work ·{' '}
          </span>
          <RichText text={researcher.keyWork} />
        </p>
        <p className="text-xs font-normal leading-[1.5] text-[var(--researcher-relevance)]">
          <span className="font-medium">→ </span>
          <RichText text={researcher.diosRelevance} />
        </p>
      </div>
    </article>
  )
}

type ResearchersSectionProps = {
  variant: 'full' | 'condensed'
}

export function ResearchersSection({ variant }: ResearchersSectionProps) {
  const researchers =
    variant === 'condensed' ? getHomepageResearchers() : RESEARCHERS

  return (
    <section
      id="researchers"
      className={variant === 'full' ? 'mt-16 scroll-mt-28' : 'mt-12'}
      aria-labelledby="researchers-heading"
    >
      <h2
        id="researchers-heading"
        className={variant === 'full' ? 'type-section' : `${SECTION_TITLE}`}
      >
        The researchers behind chronodosing
      </h2>
      <p className={`${BODY} mt-4 max-w-3xl text-[var(--text-secondary)]`}>{RESEARCHERS_INTRO}</p>

      <div className="researcher-grid mt-8 grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        {researchers.map((researcher) => (
          <ResearcherCard key={researcher.id} researcher={researcher} />
        ))}
      </div>

      {variant === 'condensed' ? (
        <p className="mt-8 text-center">
          <Link
            href="/evidence#researchers"
            className="type-button text-[var(--researcher-relevance)] underline-offset-4 hover:underline"
          >
            View all researchers →
          </Link>
        </p>
      ) : null}
    </section>
  )
}
