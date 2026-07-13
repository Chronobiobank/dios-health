import type { CSSProperties } from 'react'

import { PhenotypeIcon } from '@/components/deepdose/PhenotypeIcon'
import {
  CHEMICAL_PHENOTYPE_BY_ID,
  type ChemicalPhenotypeId,
} from '@/lib/brand/chemical-phenotypes'
import { HOW_IT_WORKS_PHENOTYPES } from '@/lib/deepdose-marketing/how-it-works-content'
import { cn } from '@/lib/utils/cn'

/** Tile washes — four distinct hues (avoid mid/indigo clash). */
const CHRONOTYPE_TILE_CUE: Record<ChemicalPhenotypeId, string> = {
  night_creator: 'var(--seco-spectrum-lilac)', // lilac — night
  early_explorer: 'var(--seco-spectrum-cyan)', // cyan — dawn
  twilight_transformer: '#f2b8a2', // coral — twilight
  pulse_shifter: 'var(--seco-spectrum-mid)', // indigo — shift
}

type ChronotypeTilesProps = {
  className?: string
}

/** Cue-tinted spectrum tiles for the four chronotype animals. */
export function ChronotypeTiles({ className }: ChronotypeTilesProps) {
  return (
    <ul
      className={cn(
        'seco-spectrum-tiles seco-spectrum-tiles--2-sm seco-how-page__phenotypes',
        className
      )}
      aria-label={HOW_IT_WORKS_PHENOTYPES.title}
    >
      {HOW_IT_WORKS_PHENOTYPES.items.map((tile) => {
        const pheno = CHEMICAL_PHENOTYPE_BY_ID[tile.id]
        return (
          <li
            key={tile.id}
            className="seco-spectrum-tile seco-how-page__pheno-tile"
            style={{ '--cue': CHRONOTYPE_TILE_CUE[tile.id] } as CSSProperties}
          >
            <div className="seco-how-page__pheno-row">
              <PhenotypeIcon id={tile.id} size="md" className="seco-how-page__pheno-icon" />
              <div className="seco-how-page__pheno-rule" aria-hidden />
              <div className="seco-how-page__pheno-copy">
                <p className="seco-how-page__pheno-name">{tile.label}</p>
                <p className="seco-how-page__pheno-peak">{pheno.peak}</p>
              </div>
            </div>
            <p className="seco-how-page__pheno-body">{tile.body}</p>
          </li>
        )
      })}
    </ul>
  )
}
