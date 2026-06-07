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
    detail: 'Needs attention today — confirm today\'s doses in DINA or complete your monthly MLux proxy.',
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
            ? `Last TipTraQ block shows ${driftLine} — evening dose windows follow that calibration, not wall-clock labels.`
            : 'Complete a TipTraQ three-night block to set your dose windows.',
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
        label: '90-day blood panel',
        subtitle: ctx.bloodPanel.collectedAt
          ? 'Last draw on file — PTH and cofactors confirm whether the protocol is working.'
          : 'Add your 90-day panel — PTH, D, B12, ferritin, calcium.',
        badge: ctx.bloodPanel.collectedAt ? 'Panel on file' : 'Due panel',
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
          ? nights >= 3
            ? `Last ${nights >= 3 ? '3-night' : `${nights}-night`} block — sleep architecture set your dose windows for the next six months.`
            : `${nights} of 3 nights in current block — finish the calibration read.`
          : 'Schedule a TipTraQ three-night block — sets your clock until the next read.',
        badge: ctx.hasTipTraq ? 'Clock calibration' : 'Schedule block',
        badgeTone: 'study' as const,
        panelActions: [
          {
            label: 'Sleep and my script ↗',
            prompt: 'How does my last TipTraQ block affect my dose windows today?',
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
            ? 'Today\'s dose confirmations logged — all four cadences feeding your script.'
            : 'Doses confirmed today — connect remaining cadences for full calibration.'
          : ctx.completenessGaps === 0
            ? 'Streams connected — confirm doses in DINA and refresh monthly MLux proxy.'
            : 'Connect missing cadences: daily DINA, monthly MLux, 90-day bloods, six-month TipTraQ.',
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
