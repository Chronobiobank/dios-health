'use client'

import { MEDICATION_TIMING_CATALOG } from '@/lib/medication/timing-catalog'
import { cn } from '@/lib/utils'

type MedicationChipPickerProps = {
  selectedIds: ReadonlySet<string>
  onToggle: (id: string) => void
  disabled?: boolean
  className?: string
}

export function MedicationChipPicker({
  selectedIds,
  onToggle,
  disabled = false,
  className,
}: MedicationChipPickerProps) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      {MEDICATION_TIMING_CATALOG.map((medication) => {
        const active = selectedIds.has(medication.id)
        return (
          <li key={medication.id}>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onToggle(medication.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-left text-sm transition-colors disabled:opacity-60',
                active
                  ? 'border-[rgb(201,151,58)]/45 bg-[rgb(201,151,58)]/12 text-[var(--text-primary)]'
                  : 'border-black/12 bg-white/50 text-[var(--text-secondary)] hover:border-black/25 hover:text-[var(--text-primary)]'
              )}
              aria-pressed={active}
            >
              <span className="font-medium">{medication.name}</span>
              <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wide text-black/45">
                {medication.standardGuidance.replace('Standard: ', '')}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
