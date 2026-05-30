/**
 * Sean James TipTraQ validation — run with: npx tsx scripts/test-sean-james-dlmo.ts
 * Expected: DLMO ~22:57, confidence ~38%, band ±75, high_sympathetic + rem_delay true
 */
import { calculateNightDLMO, type TipTraQNight } from '../lib/dlmo'

const seanJamesNight: TipTraQNight = {
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
}

const result = calculateNightDLMO(seanJamesNight)

console.log('Sean James DLMO test results:')
console.log(JSON.stringify(result, null, 2))

const checks = [
  { label: 'DLMO ~22:57', pass: result.proxy_dlmo_time === '22:57' },
  { label: 'Confidence ~38%', pass: result.confidence_score >= 36 && result.confidence_score <= 40 },
  { label: 'Band ±75 min', pass: result.confidence_band_minutes === 75 },
  { label: 'High sympathetic', pass: result.high_sympathetic_flag === true },
  { label: 'REM delay', pass: result.rem_delay_flag === true },
  { label: 'No apnea confound (AHI 5.4)', pass: result.apnea_confound_flag === false },
]

console.log('\nValidation:')
for (const check of checks) {
  console.log(`${check.pass ? '✓' : '✗'} ${check.label}`)
}

const failed = checks.filter((c) => !c.pass)
process.exit(failed.length > 0 ? 1 : 0)
