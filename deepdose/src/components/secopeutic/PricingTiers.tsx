'use client'

import { useState } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils/cn'

export type PricingTier = {
  id: string
  name: string
  figure: string
  cadence: string
  note: string
  flag?: string
  feature?: boolean
  cta: { label: string; href: string }
  includes: readonly string[]
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d="M5 10.5l3.2 3.2L15 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PricingTiers({ tiers }: { tiers: readonly PricingTier[] }) {
  const initial = tiers.find((tier) => tier.feature)?.id ?? tiers[0]?.id
  const [selectedId, setSelectedId] = useState(initial)
  const active = tiers.find((tier) => tier.id === selectedId) ?? tiers[0]

  return (
    <>
      <div className="seco-pricing__grid" role="radiogroup" aria-label="Choose a plan">
        {tiers.map((tier) => {
          const selected = tier.id === active.id
          return (
            <button
              key={tier.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setSelectedId(tier.id)}
              className={cn(
                'seco-pricing__card',
                tier.feature && 'seco-pricing__card--feature',
                selected && 'seco-pricing__card--selected'
              )}
            >
              <span className="seco-pricing__radio" aria-hidden="true" />
              {tier.flag ? <span className="seco-pricing__flag">{tier.flag}</span> : null}
              <span className="seco-pricing__tier">{tier.name}</span>
              <span className="seco-pricing__figure">{tier.figure}</span>
              <span className="seco-pricing__cadence">{tier.cadence}</span>
              <span className="seco-pricing__note">{tier.note}</span>
            </button>
          )
        })}
      </div>

      <div className="seco-pricing__detail" aria-live="polite">
        <div className="seco-pricing__detail-head">
          <div>
            <p className="seco-page__eyebrow">Your selection</p>
            <h2 className="seco-pricing__detail-title">
              {active.name} · {active.figure}
            </h2>
            <p className="seco-pricing__detail-note">{active.note}</p>
          </div>
          <Link href={active.cta.href} className="seco-landing__btn seco-landing__btn--primary">
            {active.cta.label} →
          </Link>
        </div>
        <ul className="seco-pricing__includes">
          {active.includes.map((item) => (
            <li key={item}>
              <CheckIcon />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
