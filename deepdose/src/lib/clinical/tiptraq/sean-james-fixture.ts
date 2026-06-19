/** Sean James canonical TipTraQ block — first 3 nights for clinical demo (from dios-health). */

import type { TipTraqNightInput } from '@/lib/clinical/tiptraq/types'

const CANONICAL = {
  sleep_onset: '00:36',
  sleep_offset: '08:12',
  sleep_latency_minutes: 18,
  tst_minutes: 392,
  waso_minutes: 95,
  sleep_efficiency_pct: 86,
  rem_duration_minutes: 78,
  rem_pct_tst: 19.9,
  first_rem_onset: '02:57',
  ahi: 5.4,
  sns_pct: 72,
  pns_pct: 28,
  mean_pr: 62,
  min_pr: 48,
  min_spo2: 89,
  hypoxic_burden: 12.4,
  signal_quality_pct: 84,
} as const

export const SEAN_JAMES_TIPTRAQ_BLOCK: TipTraqNightInput[] = [
  {
    ...CANONICAL,
    report_date: '2026-05-26',
    night_index: 1,
    day_type: 'weekday',
    ahi: 5.2,
  },
  {
    ...CANONICAL,
    report_date: '2026-05-27',
    night_index: 2,
    day_type: 'weekday',
    ahi: 5.6,
    sleep_onset: '00:42',
  },
  {
    ...CANONICAL,
    report_date: '2026-05-28',
    night_index: 3,
    day_type: 'weekday',
    ahi: 5.1,
    sleep_onset: '00:31',
  },
]
