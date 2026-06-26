/**
 * Smoke tests for home → patient landing plan resolution.
 * Run: npx tsx scripts/test-plan-flow.ts
 */
import assert from 'node:assert/strict'

import { DEEPDOSE_HOME_DEFAULT_MED_CODES } from '../src/lib/deepdose-marketing/landing-content'
import {
  buildPatientLandingPath,
  earliestTakeTime,
  parsePatientLandingParams,
} from '../src/lib/medications/home-to-onboarding'
import { resolveHomePlanRows } from '../src/lib/patient/home-plan-rows'

const defaults = [...DEEPDOSE_HOME_DEFAULT_MED_CODES]

// Default 4 rows with no catalog picks → placeholder meds + take times
const defaultRows = resolveHomePlanRows(
  [
    { selectedCode: null, takeTime: '07:30' },
    { selectedCode: null, takeTime: '08:00' },
    { selectedCode: null, takeTime: '20:00' },
    { selectedCode: null, takeTime: '12:00' },
  ],
  4,
  defaults
)
assert.deepEqual(defaultRows.medCodes, defaults)
assert.deepEqual(defaultRows.medTimes, ['07:30', '08:00', '20:00', '12:00'])

// Selected med overrides default for that slot
const mixed = resolveHomePlanRows(
  [
    { selectedCode: 'omeprazole', takeTime: '07:00' },
    { selectedCode: null, takeTime: '08:00' },
    { selectedCode: null, takeTime: '20:00' },
    { selectedCode: null, takeTime: '12:00' },
  ],
  4,
  defaults
)
assert.deepEqual(mixed.medCodes, ['omeprazole', 'ramipril', 'atorvastatin', 'sertraline'])

// Fifth row without selection is skipped
const fifth = resolveHomePlanRows(
  [
    ...defaults.map((code, i) => ({
      selectedCode: code,
      takeTime: ['07:30', '08:00', '20:00', '12:00'][i],
    })),
    { selectedCode: null, takeTime: '22:00' },
  ],
  5,
  defaults
)
assert.equal(fifth.medCodes.length, 4)

// URL round-trip
const path = buildPatientLandingPath({
  medCodes: defaultRows.medCodes,
  medTimes: defaultRows.medTimes,
})
assert.ok(path.startsWith('/patient-landing?'))
const qs = path.split('?')[1]!
const parsed = parsePatientLandingParams(new URLSearchParams(qs))
assert.deepEqual(parsed.medCodes, defaults)
assert.deepEqual(parsed.medTimes, defaultRows.medTimes)
assert.equal(parsed.wake, earliestTakeTime(defaultRows.medTimes))

console.log('plan-flow tests passed')
