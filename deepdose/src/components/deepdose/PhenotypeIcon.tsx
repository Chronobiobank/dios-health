import type { ReactElement } from 'react'

import type { ChemicalPhenotypeId } from '@/lib/brand/chemical-phenotypes'

export type PhenotypeIconSize = 'sm' | 'md' | 'lg'

type PhenotypeIconProps = {
  id: ChemicalPhenotypeId
  size?: PhenotypeIconSize
  className?: string
}

/** Shared SF-style stroke language for the chronotype set. */
const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function WolfGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="dd-pheno-icon__glyph" aria-hidden>
      <g {...STROKE}>
        <path d="M20 27 14 12l12 8" />
        <path d="M44 27 50 12 38 20" />
        <path d="M16 29c1.2 11 7.2 20 16 23.5C40.8 49 46.8 40 48 29" />
        <path d="M22 39c2.6 4.2 6.4 6.5 10 6.5s7.4-2.3 10-6.5" />
        <path d="M32 33.5v4.5" />
        <path d="M28.5 41c1.2 1.1 2.3 1.6 3.5 1.6s2.3-.5 3.5-1.6" />
      </g>
      <circle cx="25" cy="31.5" r="1.65" fill="currentColor" />
      <circle cx="39" cy="31.5" r="1.65" fill="currentColor" />
    </svg>
  )
}

function LionGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="dd-pheno-icon__glyph" aria-hidden>
      <g {...STROKE}>
        <circle cx="32" cy="32" r="18.5" />
        <circle cx="32" cy="33" r="10.5" />
        <path d="M32 11.5v3.2M32 49.3v3.2M11.5 32h3.2M49.3 32h3.2" />
        <path d="M17.2 17.2l2.3 2.3M44.5 44.5l2.3 2.3M46.8 17.2l-2.3 2.3M19.5 44.5l-2.3 2.3" />
        <path d="M28.5 37.2c1 1.2 2.3 1.8 3.5 1.8s2.5-.6 3.5-1.8" />
        <path d="M32 27.5v2.2" />
      </g>
      <circle cx="27.5" cy="31.5" r="1.55" fill="currentColor" />
      <circle cx="36.5" cy="31.5" r="1.55" fill="currentColor" />
    </svg>
  )
}

function BearGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="dd-pheno-icon__glyph" aria-hidden>
      <g {...STROKE}>
        <circle cx="19.5" cy="19.5" r="6.5" />
        <circle cx="44.5" cy="19.5" r="6.5" />
        <path d="M16.5 25c-3 3.5-4.8 8-4.8 12.8C11.7 48.5 20.5 54.5 32 54.5s20.3-6 20.3-16.7c0-4.8-1.8-9.3-4.8-12.8" />
        <ellipse cx="32" cy="41" rx="6.5" ry="5" />
        <path d="M28 41.2h8" />
        <circle cx="19.5" cy="19.5" r="2.4" />
        <circle cx="44.5" cy="19.5" r="2.4" />
      </g>
      <circle cx="25.5" cy="32" r="1.65" fill="currentColor" />
      <circle cx="38.5" cy="32" r="1.65" fill="currentColor" />
    </svg>
  )
}

function DolphinGlyph() {
  return (
    <svg viewBox="0 0 64 64" className="dd-pheno-icon__glyph" aria-hidden>
      <g {...STROKE}>
        <path d="M12 39c4.5-2.6 9-9 12.5-14.5C28.5 18 35 13.5 42.5 13c5-.3 9.2 1.8 12.2 5" />
        <path d="M41.5 14c2-2.8 5-4.5 8.5-5.3-.4 3.3-1.7 6.2-3.8 8.8" />
        <path d="M52.8 18.2c3.3 2.9 5.4 6.7 5.8 10.8-4.6-.4-8.7-2.1-12-4.6" />
        <path d="M24 24.5c-3 4.6-7.2 8.8-12.2 11 3.8 2.5 8.8 2.9 13 1.2" />
        <path d="M31 38.5c1.2 4.6.8 9.2-1.3 13.5 4.6-1.3 8.4-4.2 10.5-8" />
        <path d="M46.5 28.5c1.7 1 3.8 1.2 5.8.6" />
      </g>
      <circle cx="45.5" cy="22.5" r="1.55" fill="currentColor" />
    </svg>
  )
}

const GLYPHS: Record<ChemicalPhenotypeId, () => ReactElement> = {
  night_creator: WolfGlyph,
  early_explorer: LionGlyph,
  twilight_transformer: BearGlyph,
  pulse_shifter: DolphinGlyph,
}

/**
 * Chronotype animals — soft spectrum disc, black SF-style line art.
 */
export function PhenotypeIcon({ id, size = 'md', className }: PhenotypeIconProps) {
  const Glyph = GLYPHS[id]
  return (
    <span
      className={['dd-pheno-icon', `dd-pheno-icon--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <Glyph />
    </span>
  )
}
