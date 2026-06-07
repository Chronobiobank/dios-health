'use client'

import {
  CHRONOMEDICINE_MATRIX_ROWS,
  MATRIX_TIME_LABELS,
  matrixBandStyle,
  type ChronomedicineMatrixRow,
} from '@/lib/evidence/chronotherapy-model-content'
import { cn } from '@/lib/utils'

type ChronomedicineMatrixProps = {
  activeRowId: string | null
  onRowSelect: (rowId: string) => void
}

function MatrixRow({
  row,
  isActive,
  onSelect,
}: {
  row: ChronomedicineMatrixRow
  isActive: boolean
  onSelect: () => void
}) {
  const band = matrixBandStyle(row.windowStart, row.windowEnd)

  return (
    <button
      type="button"
      className={cn(
        'chronotherapy-matrix__row',
        isActive && 'chronotherapy-matrix__row--active'
      )}
      onClick={onSelect}
      aria-pressed={isActive}
    >
      <div className="chronotherapy-matrix__row-meta">
        <p className="chronotherapy-matrix__row-label">{row.label}</p>
        <p className="chronotherapy-matrix__row-substances">{row.substances}</p>
        <p className="chronotherapy-matrix__row-window">
          {row.windowStart}–{row.windowEnd}
          <span className="chronotherapy-matrix__row-cluster">{row.clusterLabel}</span>
        </p>
      </div>
      <div className="chronotherapy-matrix__track" aria-hidden>
        <div
          className="chronotherapy-matrix__band"
          style={{
            left: band.left,
            width: band.width,
            backgroundColor: row.bandColor,
          }}
        />
      </div>
    </button>
  )
}

export function ChronomedicineMatrix({ activeRowId, onRowSelect }: ChronomedicineMatrixProps) {
  return (
    <section className="chronotherapy-matrix" aria-label="Chronomedicine timing matrix">
      <div className="chronotherapy-matrix__axis" aria-hidden>
        {MATRIX_TIME_LABELS.map((label, index) => (
          <span key={`${label}-${index}`} className="chronotherapy-matrix__axis-tick">
            {label}
          </span>
        ))}
      </div>
      <div className="chronotherapy-matrix__rows">
        {CHRONOMEDICINE_MATRIX_ROWS.map((row) => (
          <MatrixRow
            key={row.id}
            row={row}
            isActive={activeRowId === row.id}
            onSelect={() => onRowSelect(row.id)}
          />
        ))}
      </div>
      <p className="chronotherapy-matrix__hint type-caption">
        Tap a row to open matching evidence below. Biological windows on a 06:00 clinical day.
      </p>
    </section>
  )
}
