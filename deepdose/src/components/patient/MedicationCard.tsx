import type { MedicationRecommendation } from '@/lib/medications/recommendations'
import { Badge } from '@/components/ui/Layout'
import { checkboxClass, NumberInput, TimeInput } from '@/components/ui/Form'
import { Label } from '@/components/ui/Input'

interface MedicationCardProps {
  medication: MedicationRecommendation
  selected: boolean
  doseMg: string
  currentTiming: string
  onToggle: () => void
  onDoseChange: (value: string) => void
  onTimingChange: (value: string) => void
}

const GRADE_TONE: Record<string, 'accent' | 'warning' | 'neutral'> = {
  A: 'accent',
  B: 'warning',
  C: 'neutral',
}

export default function MedicationCard({
  medication,
  selected,
  doseMg,
  currentTiming,
  onToggle,
  onDoseChange,
  onTimingChange,
}: MedicationCardProps) {
  return (
    <li
      className={`rounded-2xl border p-4 transition-colors md:p-5 ${
        selected ? 'border-aubergine-mid/40 bg-lilac-light/50' : 'border-border bg-surface'
      }`}
    >
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className={`mt-0.5 ${checkboxClass}`}
        />
        <span className="flex-1 space-y-2">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-ink">{medication.displayName}</span>
            <span className="text-xs text-ink-faint">{medication.drugClass}</span>
            <Badge tone={GRADE_TONE[medication.evidenceGrade] ?? 'neutral'}>
              Grade {medication.evidenceGrade}
            </Badge>
          </span>

          <p className="text-sm leading-relaxed text-ink-muted">{medication.rationale}</p>

          <p className="text-sm font-medium text-aubergine-mid">
            Recommended window: {medication.recommendedStart} – {medication.recommendedEnd}
            {medication.phaseAdjusted && (
              <span className="ml-1 font-normal text-ink-muted">
                (adjusted for your chronotype)
              </span>
            )}
          </p>
        </span>
      </label>

      {selected && (
        <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`dose-${medication.code}`}>Dose (mg)</Label>
            <NumberInput
              id={`dose-${medication.code}`}
              min={0}
              step={0.1}
              placeholder="e.g. 10"
              value={doseMg}
              onChange={(e) => onDoseChange(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`timing-${medication.code}`}>Current timing</Label>
            <TimeInput
              id={`timing-${medication.code}`}
              value={currentTiming}
              onChange={(e) => onTimingChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </li>
  )
}
