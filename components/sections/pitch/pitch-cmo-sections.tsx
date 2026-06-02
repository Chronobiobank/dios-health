'use client'

import Link from 'next/link'

import {
  PITCH_CLINICAL_VIGNETTE,
  PITCH_CMO_CTA,
  PITCH_GOVERNANCE,
  PITCH_NHS_LEADERS,
  PITCH_NHS_OUTCOMES,
  PITCH_NHS_OUTCOMES_INTRO,
} from '@/lib/pitch/cmo-content'
import { PITCH_IMAGES } from '@/lib/pitch/landing-images'

import { PitchMediaTile } from './pitch-media-tile'
import { PitchSectionBlock, PitchSectionHead, PitchSubsectionTile } from './pitch-section'
import { PitchTileEyebrow, PitchTileSub, PitchTileTitle } from './pitch-primitives'

/** 1 — System outcomes evidence tile */
export function PitchNhsOutcomesSection() {
  return (
    <PitchSectionBlock>
      <PitchSectionHead
        eyebrow={PITCH_NHS_OUTCOMES_INTRO.eyebrow}
        title={PITCH_NHS_OUTCOMES_INTRO.title}
        subtitle={PITCH_NHS_OUTCOMES_INTRO.subtitle}
      />
      <PitchMediaTile image={PITCH_IMAGES.evidence} imageAlt="Clinical evidence references overview" size="feature">
        <PitchTileEyebrow light>Evidence links</PitchTileEyebrow>
        <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-[15px]">
          Four supporting references aligned to system outcomes.
        </p>
        <ul className="mt-4 flex w-full max-w-2xl flex-col gap-2.5">
          {PITCH_NHS_OUTCOMES.map((outcome) => (
            <li key={outcome.id}>
              <a
                href={outcome.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pitch-glow-tile__link pitch-glow-tile__link--light inline-block"
              >
                {outcome.headline} · {outcome.cite} →
              </a>
            </li>
          ))}
        </ul>
      </PitchMediaTile>
    </PitchSectionBlock>
  )
}

/** 2 — NHS leaders pathway */
export function PitchNhsLeadersSection() {
  const { pathway, pilotOffer, pilotPack, links } = PITCH_NHS_LEADERS

  return (
    <PitchSectionBlock>
      <PitchSectionHead
        eyebrow={PITCH_NHS_LEADERS.eyebrow}
        title={PITCH_NHS_LEADERS.title}
        subtitle={PITCH_NHS_LEADERS.subtitle}
      />
      <PitchMediaTile
        image={PITCH_NHS_LEADERS.heroImage}
        imageAlt={PITCH_NHS_LEADERS.heroAlt}
        size="feature"
      >
        <p className="text-sm text-white/75 max-sm:hidden sm:text-[15px]">{pilotOffer.line}</p>
        <Link href={pilotOffer.href} className="pitch-glow-tile__link pitch-glow-tile__link--light mt-2 inline-block">
          {pilotOffer.label}
        </Link>
      </PitchMediaTile>
      <PitchSubsectionTile className="hidden sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          {pilotPack.eyebrow}
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-[13px] text-white/60 sm:text-sm">
          {pilotPack.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-[var(--calm-brand)]/80" aria-hidden>
                —
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </PitchSubsectionTile>
      <ol className="hidden flex-col gap-3 sm:flex">
        {pathway.map((step) => (
          <li key={step.step}>
            <PitchMediaTile image={step.image} imageAlt={step.imageAlt} size="card">
              <span className="font-mono text-[11px] text-[var(--calm-brand)]/75">{step.step}</span>
              <p className="mt-1 text-base font-medium text-white">{step.title}</p>
              <p className="pitch-glow-tile__label mt-1">{step.body}</p>
            </PitchMediaTile>
          </li>
        ))}
      </ol>
      <PitchSubsectionTile className="hidden sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          Aligns with national programmes
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pitch-glow-tile__link inline-block"
              >
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
      </PitchSubsectionTile>
    </PitchSectionBlock>
  )
}

function GovernanceItemLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const className = 'pitch-glow-tile__link mt-1 inline-block'

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {label}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

/** 3 — Governance & assurance */
export function PitchGovernanceSection() {
  const { assurancePack, heroCta, standards } = PITCH_GOVERNANCE

  return (
    <PitchSectionBlock>
      <PitchSectionHead
        eyebrow={PITCH_GOVERNANCE.eyebrow}
        title={PITCH_GOVERNANCE.title}
        subtitle={PITCH_GOVERNANCE.subtitle}
      />
      <PitchMediaTile
        image={PITCH_GOVERNANCE.heroImage}
        imageAlt={PITCH_GOVERNANCE.heroAlt}
        size="feature"
      >
        <p className="text-sm text-white/75 max-sm:hidden sm:text-[15px]">{heroCta.line}</p>
        <Link href={heroCta.href} className="pitch-glow-tile__link pitch-glow-tile__link--light mt-2 inline-block">
          {heroCta.label}
        </Link>
      </PitchMediaTile>
      <PitchSubsectionTile className="hidden sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          {assurancePack.eyebrow}
        </p>
        <ul className="mt-3 flex flex-col gap-2 text-[13px] text-white/60 sm:text-sm">
          {assurancePack.bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-[var(--calm-brand)]/80" aria-hidden>
                —
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </PitchSubsectionTile>
      <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
        {PITCH_GOVERNANCE.items.map((item) => (
          <PitchMediaTile key={item.id} image={item.image} imageAlt={item.imageAlt} size="card">
            <p className="text-base font-medium text-white">{item.title}</p>
            <p className="pitch-glow-tile__label mt-1">{item.body}</p>
            <GovernanceItemLink
              href={item.href}
              label={item.label}
              external={'external' in item ? item.external : undefined}
            />
          </PitchMediaTile>
        ))}
      </div>
      <PitchSubsectionTile className="hidden sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          Standards & national context
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {standards.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pitch-glow-tile__link inline-block"
              >
                {link.label} →
              </a>
            </li>
          ))}
        </ul>
      </PitchSubsectionTile>
    </PitchSectionBlock>
  )
}

/** 4 — Clinical vignette */
export function PitchClinicalVignetteSection() {
  const v = PITCH_CLINICAL_VIGNETTE

  return (
    <PitchSectionBlock>
      <PitchSectionHead eyebrow={v.eyebrow} title={v.title} subtitle={v.subtitle} />
      <PitchMediaTile image={v.image} imageAlt={v.imageAlt} size="feature">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/80">
          {v.patient.label}
        </p>
        <p className="mt-1 text-sm text-white/85 max-sm:hidden sm:text-[15px]">{v.patient.summary}</p>
        <Link href="/evidence" className="pitch-glow-tile__link pitch-glow-tile__link--light mt-2 inline-block">
          View case details →
        </Link>
      </PitchMediaTile>
      <PitchSubsectionTile className="hidden sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          Review signals
        </p>
        <ul className="flex flex-col gap-3">
          {v.findings.map((f) => (
            <li key={f.node} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
              <span className="text-sm font-medium text-white">{f.node}</span>
              <span className="font-mono text-[12px] text-[var(--calm-brand)]">{f.score}</span>
              <span className="w-full text-[13px] text-white/50">{f.note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[13px] leading-relaxed text-white/60 sm:text-sm">{v.action}</p>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          Documentation checkpoints
        </p>
        <ul className="mt-2 flex flex-col gap-2 text-[13px] text-white/55 sm:text-sm">
          {v.documentation.map((d) => (
            <li key={d} className="flex gap-2">
              <span className="text-[var(--calm-brand)]/80" aria-hidden>
                —
              </span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          {v.citations.map((c) => (
            <Link key={c.href} href={c.href} className="pitch-glow-tile__link">
              {c.label} →
            </Link>
          ))}
        </div>
      </PitchSubsectionTile>
    </PitchSectionBlock>
  )
}

/** 5 — CMO briefing CTA */
export function PitchCmoCtaSection() {
  const c = PITCH_CMO_CTA

  return (
    <PitchSectionBlock>
      <PitchMediaTile
        image={c.image}
        imageAlt={c.imageAlt}
        size="hero"
        className="[&>div]:min-h-[min(56dvh,440px)] sm:[&>div]:min-h-[400px]"
      >
        <PitchTileEyebrow light>{c.eyebrow}</PitchTileEyebrow>
        <PitchTileTitle as="h2" light className="mt-2 max-w-xl">
          {c.title}
        </PitchTileTitle>
        <PitchTileSub light className="mt-2 hidden max-w-lg sm:block">
          {c.subtitle}
        </PitchTileSub>
        <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3">
          <Link href={c.primary.href} className="pitch-btn-primary">
            {c.primary.label}
          </Link>
          <Link href={c.secondary.href} className="pitch-btn-secondary">
            {c.secondary.label}
          </Link>
        </div>
      </PitchMediaTile>

      <div className="hidden grid-cols-1 gap-3 sm:grid sm:grid-cols-2 sm:gap-4">
        <PitchSubsectionTile>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
            {c.briefingAgenda.eyebrow}
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-[13px] text-white/60 sm:text-sm">
            {c.briefingAgenda.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--calm-brand)]/80" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PitchSubsectionTile>
        <PitchSubsectionTile>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
            {c.deliverables.eyebrow}
          </p>
          <ul className="mt-3 flex flex-col gap-2 text-[13px] text-white/60 sm:text-sm">
            {c.deliverables.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-[var(--calm-brand)]/80" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </PitchSubsectionTile>
      </div>

      <PitchSubsectionTile className="hidden sm:block">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--calm-brand)]/70">
          Jump to key sections
        </p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {c.supportingLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="pitch-glow-tile__link">
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </PitchSubsectionTile>
    </PitchSectionBlock>
  )
}
