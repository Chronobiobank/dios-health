import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import {
  buildTimebotTimeline,
  formatDlmoHeaderTime,
  formatTimelineForContext,
  resolveTimebotPrecisionLabel,
  resolveTimelineDlmoMinutes,
  type ScheduleStatus,
  type TimebotTimelineEvent,
  type TimebotTimelineGroup,
} from '@/lib/dashboard/timebot-timeline'

export type { ScheduleStatus, TimebotTimelineEvent, TimebotTimelineGroup }
export { resolvePointStatus, groupTimelineEvents } from '@/lib/dashboard/timebot-timeline'

export type TimebotPrecisionLabel = 'ESTIMATED' | 'PRECISION' | 'CONFIRMED'

export type TimebotData = {
  hasDlmoData: boolean
  precisionLabel: TimebotPrecisionLabel
  firstName: string
  dlmoTimeLabel: string
  chronotype: string | null
  confidenceLabel: string | null
  currentSupplements: string[]
  timelineEvents: TimebotTimelineEvent[]
  timelineGroups: TimebotTimelineGroup[]
  hasTimeline: boolean
}

export function buildTimebotData(input: {
  profile: DlmoProfileRow | null
  hasTipTraqData: boolean
  firstName: string
  locationCity?: string | null
  locationCountry?: string | null
  fallbackSleepTime?: string
  currentSupplements?: string[]
  currentMedications?: string[] | null
  now?: Date
}): TimebotData {
  const fallbackSleepTime = input.fallbackSleepTime ?? '11:00pm'
  const precisionLabel = resolveTimebotPrecisionLabel(input.profile?.dominant_layer)
  const dlmoTimeLabel = formatDlmoHeaderTime(input.profile, fallbackSleepTime)

  const { events, groups } = buildTimebotTimeline({
    profile: input.profile,
    fallbackSleepTime,
    currentSupplements: input.currentSupplements ?? [],
    currentMedications: input.currentMedications,
    locationCity: input.locationCity,
    locationCountry: input.locationCountry,
    now: input.now,
  })

  const { fromRolling } = resolveTimelineDlmoMinutes(input.profile, fallbackSleepTime)
  // hasDlmoData: Vaya can always respond — questionnaire fallback gives an estimated MLux / timing basis.
  // The precisionLabel (ESTIMATED / PRECISION / CONFIRMED) communicates quality to the user.
  const hasDlmoData = true

  return {
    hasDlmoData,
    precisionLabel,
    firstName: input.firstName,
    dlmoTimeLabel: `${dlmoTimeLabel}${fromRolling ? '' : ' (estimated)'}`,
    chronotype: input.profile?.chronotype ?? null,
    confidenceLabel: input.profile?.confidence_label ?? null,
    currentSupplements: input.currentSupplements ?? [],
    timelineEvents: events,
    timelineGroups: groups,
    hasTimeline: events.length > 0,
  }
}

export function buildTimebotContext(
  profile: DlmoProfileRow | null,
  data: TimebotData,
  supplementContext?: string
): string {
  const profileBlock = profile
    ? `- Confidence: ${data.confidenceLabel ?? 'unknown'} (${profile.confidence_score ?? 'n/a'}%)
- Nights uploaded: ${profile.nights_count ?? 0}
- Dominant layer: ${profile.dominant_layer ?? 'none'}`
    : '- No mlux_profiles row yet (questionnaire estimate for MLux phase)'

  const scheduleBlock = formatTimelineForContext(data.timelineGroups)

  const supplementBlock = supplementContext
    ? `\n\n${supplementContext}`
    : data.currentSupplements.length > 0
      ? `\n\nSupplements on profile: ${data.currentSupplements.join(', ')}`
      : ''

  return `Patient DLMO profile:
- Proxy DLMO: ${data.dlmoTimeLabel}
- Schedule precision: ${data.precisionLabel}
- Chronotype: ${data.chronotype ?? 'unknown'}
${profileBlock}

Today's unified schedule (authoritative — quote exact times from here when asked about timing):
${scheduleBlock}

When the patient asks when to take a medication or supplement, answer with the exact time from this schedule.${supplementBlock}`
}
