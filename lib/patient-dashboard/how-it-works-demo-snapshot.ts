import { DEFAULT_DASHBOARD_AVATAR } from '@/components/patient-dashboard/constants'
import { buildPatientNextStepsBlock } from '@/lib/patient-dashboard/build-patient-next-steps'
import { applyScriptFirstSnapshot } from '@/lib/patient-dashboard/script-first-narrative'
import { buildSeanJamesSnapshot } from '@/lib/patient-dashboard/sean-james-tiptraq'
import type { Medication, PatientDashboardProps, PatientSnapshot } from '@/lib/patient-dashboard/types'
import type { FirstLightDailyStatus } from '@/lib/product/first-light-daily-status'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'
import { resolveFirstLightWindow } from '@/lib/product/first-light-window'
import type { FeedFreshness } from '@/lib/retinomic/feed-retention'

function formatClockTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true })
}

function eatingWindowFromScan(scanAt: Date) {
  const open = new Date(scanAt)
  open.setHours(
    open.getHours() + FIRST_LIGHT_PROTOCOL.eatingWindowOpenHoursAfterFirstLight,
    open.getMinutes(),
    0,
    0
  )
  const close = new Date(open)
  close.setHours(open.getHours() + FIRST_LIGHT_PROTOCOL.eatingWindowDurationHoursMin)
  return { opens: formatClockTime(open), closes: formatClockTime(close) }
}

function demoScanCompletedAt(): string {
  const scanAt = new Date()
  scanAt.setHours(7, 15, 0, 0)
  return scanAt.toISOString()
}

export function buildDemoFirstLightDailyStatus(): FirstLightDailyStatus {
  const completedAt = demoScanCompletedAt()
  const scanAt = new Date(completedAt)
  return {
    completeToday: true,
    completedAt,
    scanWithinWindow: true,
    adherenceComplete: true,
    riskStatus: 'green',
    eatingWindow: eatingWindowFromScan(scanAt),
    scanNote: null,
    missedCheckpoints: [],
  }
}

const DEMO_MEDICATIONS: Medication[] = [
  {
    name: 'Ramipril',
    dose: '5 mg',
    time: '9:30pm',
    reason: 'Evening cardiovascular window — aligned to DLMO after this morning\'s First Light scan.',
    status: 'tonight',
    colour: 'var(--researcher-avatar-text)',
  },
  {
    name: 'Metformin',
    dose: '500 mg',
    time: '8:15pm',
    reason: 'Pre-sleep glycaemic window — taken on schedule earlier tonight.',
    status: 'taken',
    colour: 'var(--color-brand)',
  },
]

/**
 * Public demo — Sean James with Option 1 narrative: med timing lead, First Light loop closed.
 */
export function buildHowItWorksDemoSnapshot(): PatientSnapshot {
  const base = buildSeanJamesSnapshot()
  const firstLightDailyStatus = buildDemoFirstLightDailyStatus()
  const medicationsDueTonight = DEMO_MEDICATIONS.filter((m) => m.status === 'tonight').length

  const nextSteps = buildPatientNextStepsBlock({
    medicationsDueTonight,
    medications: DEMO_MEDICATIONS,
    clockDrift: base.clockDrift,
    dlmoEstimate: base.dlmoEstimate,
    bloodPanel: base.bloodPanel,
    completenessGaps: 1,
    spectrumNodes: base.spectrumNodes,
    tipTraqNightsCount: 5,
    hasTipTraq: true,
    recoveryYears: base.recoveryYears,
    feedFreshness: 'fresh' satisfies FeedFreshness,
    hasRetinomicScan: base.retinomicBaseline != null,
    firstLightDailyStatus,
    firstLightScanActionable: false,
  })

  const patched: PatientSnapshot = {
    ...base,
    medications: DEMO_MEDICATIONS,
    medicationsDueTonight,
    eatingWindow: firstLightDailyStatus.eatingWindow,
    nextSteps,
    completenessGaps: 1,
  }

  return applyScriptFirstSnapshot(patched, {
    sleepDelay: base.clockDrift,
    hasTipTraq: true,
    tipTraqNightsCount: 5,
    bloodPanel: base.bloodPanel,
    completenessGaps: 1,
    hasRetinomicScan: base.retinomicBaseline != null,
    firstLightDailyStatus,
  })
}

export function buildHowItWorksDemoProps(): PatientDashboardProps {
  return {
    greeting: 'Kia ora, Sean.',
    firstName: 'Sean',
    fullName: 'Sean James',
    avatarUrl: DEFAULT_DASHBOARD_AVATAR,
    snapshot: buildHowItWorksDemoSnapshot(),
    feedFreshness: 'fresh',
    firstLightWindow: resolveFirstLightWindow(),
    firstLightDailyStatus: buildDemoFirstLightDailyStatus(),
    confirmedDosesToday: ['Metformin'],
    lightCheckIn: null,
  }
}
