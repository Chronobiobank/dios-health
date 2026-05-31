'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'

import {
  CAPTION,
  CARD_BODY,
  CARD_HEADLINE,
  CTA_BUTTON,
  INSIGHT_CARD,
  SECTION_LABEL,
} from '@/components/dashboard/dashboard-styles'

type InsightCardProps = {
  eyebrow?: string
  badge?: string
  headline: string
  body: string
  standardGuidance: string
  diosRecommendation: string
  cta: ReactNode
  footer?: ReactNode
}

export function InsightCard({
  eyebrow = 'Your first dose insight',
  badge = 'ESTIMATED',
  headline,
  body,
  standardGuidance,
  diosRecommendation,
  cta,
  footer,
}: InsightCardProps) {
  const sentences = body.match(/[^.!?]+[.!?]+/g) ?? [body]
  const trimmedBody = sentences.slice(0, 2).join(' ').trim()

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`${INSIGHT_CARD} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className={SECTION_LABEL}>{eyebrow}</p>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-teal-800">
          {badge}
        </span>
      </div>

      <h2 className={`${CARD_HEADLINE} mt-4`}>{headline}</h2>
      <p className={`${CARD_BODY} mt-3`}>{trimmedBody}</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <DiffCell label="Standard" value={standardGuidance} />
        <DiffCell label="DIOS" value={diosRecommendation} highlight />
      </div>

      <div className="mt-6">{cta}</div>

      {footer ? <div className={`${CAPTION} mt-5 text-center`}>{footer}</div> : null}
    </motion.article>
  )
}

function DiffCell({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-2xl px-3 py-3 ${highlight ? 'bg-teal-50' : 'bg-neutral-50'}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-black/40">{label}</p>
      <p className="mt-1.5 font-mono text-[11px] font-medium text-black/80">{value}</p>
    </div>
  )
}

export function InsightCardLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={CTA_BUTTON}>
      {children}
    </Link>
  )
}

export function InsightCardButton({
  onClick,
  disabled,
  children,
  pulsing,
}: {
  onClick?: () => void
  disabled?: boolean
  children: ReactNode
  pulsing?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${CTA_BUTTON} disabled:cursor-not-allowed disabled:opacity-60 ${pulsing ? 'animate-pulse' : ''}`}
    >
      {children}
    </button>
  )
}
