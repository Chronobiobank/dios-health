import type { TimebotTimelineGroup } from '@/lib/dashboard/timebot-timeline'
import { formatMinutes24h } from '@/lib/dashboard/time-utils'

/** Shown when the patient has no medications on profile yet — keeps protocol zone demo-ready. */
export function buildDemoProtocolGroup(): TimebotTimelineGroup {
  const minutes = 22 * 60

  return {
    minutes,
    timeDisplay: formatMinutes24h(minutes),
    events: [
      {
        id: 'demo-atorvastatin',
        name: 'Atorvastatin',
        minutes,
        timeDisplay: formatMinutes24h(minutes),
        category: 'Medication',
        instruction: 'Take at night with water — timed to your MLux phase',
        status: 'upcoming',
      },
    ],
  }
}
