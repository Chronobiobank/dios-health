import type { FirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import type {
  BloodPanel,
  CohortTriageStatus,
  MeasureTileData,
  Medication,
  PatientSnapshot,
} from '@/lib/patient-dashboard/types'

export type ScriptFirstNarrativeContext = {
  sleepDelay: number
  hasTipTraq: boolean
  tipTraqNightsCount: number
  bloodPanel: BloodPanel
  completenessGaps: number
  hasRetinomicScan: boolean
  firstLightDailyStatus?: FirstLightDailyStatus | null
}

export const PATIENT_TRIAGE_STRIP: Record<
  CohortTriageStatus,
  { label: string; detail: string }
> = {
  green: {
    label: 'Green',
    detail: 'On protocol — tonight\'s doses follow today\'s body-clock anchor.',
  },
  amber: {
    label: 'Amber',
    detail: 'Needs attention today — complete your morning scan or safety checkpoints.',
  },
  red: {
    label: 'Red',
    detail: 'Immediate attention — your clinician should review this week.',
  },
}

export function resolvePatientTriageStatus(
  firstLightDailyStatus: FirstLightDailyStatus | null | undefined,
  options?: { chronoimmuneTriage?: CohortTriageStatus | null }
): CohortTriageStatus {
  if (options?.chronoimmuneTriage === 'red') return 'red'
  if (!firstLightDailyStatus?.completeToday) return 'amber'
  if (firstLightDailyStatus.riskStatus === 'amber') return 'amber'
  if (options?.chronoimmuneTriage === 'amber') return 'amber'
  return 'green'
}

export function applyScriptFirstMedications(
  medications: Medication[],
  dlmoEstimate: string
): Medication[] {
  return medications.map((med) => ({
    ...med,
    reason:
      med.reason && med.reason.length > 20
        ? med.reason
        : `Timed to your body clock (${dlmoEstimate}) — not the label default.`,
  }))
}

export function applyScriptFirstMeasureTiles(
  tiles: MeasureTileData[],
  ctx: ScriptFirstNarrativeContext
): MeasureTileData[] {
  const scanComplete = ctx.firstLightDailyStatus?.completeToday === true
  const nights = ctx.tipTraqNightsCount
  const drift = ctx.sleepDelay

  return tiles.map((tile) => {
    if (tile.id === 'sleep') {
      const driftLine =
        drift > 0
          ? `+${drift}m slip`
          : 'on target'
      return {
        ...tile,
        label: 'Clock drift',
        subtitle:
          nights > 0
            ? `TipTraQ shows ${driftLine} — your evening dose windows shift with this anchor, not wall-clock labels.`
            : 'Connect sleep data to refine when your evening dose windows open.',
        badge: 'Feeds dose timing',
        badgeTone: 'watch' as const,
        panelActions: [
          {
            label: 'How drift changes my script ↗',
            prompt: 'How does clock drift change when I should take my evening medications?',
          },
        ],
      }
    }

    if (tile.id === 'vitd') {
      return {
        ...tile,
        label: 'Layer 2 — bloods',
        subtitle: ctx.bloodPanel.collectedAt
          ? 'Bloods on file — refine D and metabolic modules behind your script.'
          : 'Add baseline bloods to refine biochemical modules behind your script.',
        badge: ctx.bloodPanel.collectedAt ? 'L2 connected' : 'Unlock L2',
        badgeTone: ctx.bloodPanel.collectedAt ? ('watch' as const) : ('act' as const),
        panelActions: [
          {
            label: 'Why bloods matter for timing ↗',
            prompt: 'How do baseline bloods improve my medication timing plan?',
          },
        ],
      }
    }

    if (tile.id === 'tiptraq') {
      return {
        ...tile,
        subtitle: ctx.hasTipTraq
          ? nights >= 5
            ? `${nights} nights graded — sleep architecture validates your DLMO estimate for tonight's windows.`
            : `${nights} TipTraQ night${nights === 1 ? '' : 's'} — more nights sharpen tonight's dose windows.`
          : 'Upload TipTraQ nights to validate your DLMO estimate for dose timing.',
        badge: ctx.hasTipTraq ? 'Layer 3 · sleep' : 'Add sleep',
        badgeTone: 'study' as const,
        panelActions: [
          {
            label: 'Sleep and my script ↗',
            prompt: 'How does last night\'s sleep affect my dose windows today?',
          },
        ],
      }
    }

    if (tile.id === 'completeness') {
      const gapLabel =
        ctx.completenessGaps === 0
          ? 'All streams connected'
          : ctx.completenessGaps === 1
            ? '1 gap left'
            : `${ctx.completenessGaps} gaps left`
      return {
        ...tile,
        subtitle: scanComplete
          ? ctx.completenessGaps === 0
            ? 'First Light complete today — all streams feeding your script.'
            : 'First Light complete today — connect remaining streams for full calibration.'
          : ctx.completenessGaps === 0
            ? 'Streams connected — run First Light to anchor today\'s windows.'
            : 'Connect missing streams and complete First Light for full script precision.',
        badge: gapLabel,
        badgeTone: ctx.completenessGaps > 0 ? ('action' as const) : ('watch' as const),
        panelActions: [
          {
            label: 'Complete streams ↗',
            prompt: 'What data gaps still affect my dose window precision?',
          },
        ],
      }
    }

    return tile
  })
}

export function applyScriptFirstSnapshot(
  snapshot: PatientSnapshot,
  ctx: ScriptFirstNarrativeContext
): PatientSnapshot {
  return {
    ...snapshot,
    medications: applyScriptFirstMedications(snapshot.medications, snapshot.dlmoEstimate),
    measureTiles: applyScriptFirstMeasureTiles(snapshot.measureTiles, ctx),
    patientTriageStatus: resolvePatientTriageStatus(ctx.firstLightDailyStatus, {
      chronoimmuneTriage: snapshot.chronoimmuneProfile?.cohortTriageStatus ?? null,
    }),
  }
}
