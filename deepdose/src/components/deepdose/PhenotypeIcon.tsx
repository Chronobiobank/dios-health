import type { ChemicalPhenotypeId } from '@/lib/brand/chemical-phenotypes'

export type PhenotypeIconSize = 'sm' | 'md' | 'lg'

type PhenotypeIconProps = {
  id: ChemicalPhenotypeId
  size?: PhenotypeIconSize
  className?: string
}

const PHENOTYPE_SVG: Record<ChemicalPhenotypeId, string> = {
  night_creator: '/icons/phenotype/wolf.svg',
  early_explorer: '/icons/phenotype/lion.svg',
  twilight_transformer: '/icons/phenotype/bear.svg',
  pulse_shifter: '/icons/phenotype/dolphin.svg',
}

/**
 * Chronotype animals in glassmorphic boxes.
 * Glyphs: SVG files in /public/icons/phenotype/.
 */
export function PhenotypeIcon({ id, size = 'md', className }: PhenotypeIconProps) {
  return (
    <span
      className={['dd-pheno-icon', `dd-pheno-icon--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- local static SVG assets */}
      <img
        className="dd-pheno-icon__glyph"
        src={PHENOTYPE_SVG[id]}
        alt=""
        width={64}
        height={64}
        decoding="async"
      />
    </span>
  )
}
