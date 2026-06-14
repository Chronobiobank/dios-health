import type { ClinicianTriageDashboardRow } from '@/lib/clinicians/clinician-triage-dashboard'
import {
  pthStatus,
  type PrgcMetricCell,
  type PrgcMonitoringPatient,
} from '@/lib/clinic/prgc-monitoring'
import type { TriageStatus } from '@/lib/clinicians/triage-types'

function trendFromDb(trend: string | null): PrgcMetricCell['trend'] {
  if (trend === 'up') return 'worsening'
  if (trend === 'down') return 'improving'
  return 'stable'
}

function actionForTriage(status: TriageStatus, deviceAlert: boolean): string {
  if (deviceAlert) return 'Check wearable link or TipTraQ sync before next review.'
  if (status === 'URGENT') return 'Review labs and timing — protocol may need adjustment.'
  if (status === 'REVIEW') return 'Schedule follow-up labs or timing education.'
  return 'On track — continue current protocol cadence.'
}

function clinicalReadForTriage(row: ClinicianTriageDashboardRow): string {
  if (row.device_alert_triggered) {
    return 'Device data stale — pRGC read incomplete until telemetry returns.'
  }
  if (row.triage_status === 'URGENT') {
    return 'PTH or timing signals need urgent clinician review.'
  }
  if (row.triage_status === 'REVIEW') {
    return 'One or more signals drifting — review before next lab window.'
  }
  return 'Core signals within protocol targets.'
}

function telemetryCell(row: ClinicianTriageDashboardRow): PrgcMetricCell {
  if (row.device_alert_triggered) {
    return {
      value: 'No sync',
      status: 'amber',
      hint: row.last_telemetry_sync_at
        ? 'Last sync over 36 hours ago'
        : 'Wearable or TipTraQ not linked',
    }
  }
  return { value: 'Linked', status: 'green', hint: 'Telemetry current' }
}

function pthCell(row: ClinicianTriageDashboardRow): PrgcMetricCell {
  if (row.pth_pgml == null) {
    return { value: 'Pending', status: 'amber', hint: 'No lab on file' }
  }
  return {
    value: `${row.pth_pgml} pg/mL`,
    status: pthStatus(row.pth_pgml, trendFromDb(row.pth_trend)),
    trend: trendFromDb(row.pth_trend),
  }
}

/** Map clinician_triage_dashboard row to pRGC table shape (partial metrics when telemetry sparse). */
export function triageRowToPrgcPatient(row: ClinicianTriageDashboardRow): PrgcMonitoringPatient {
  const premium = row.is_premium_tier
  return {
    id: row.patient_id,
    displayName: row.patient_name,
    age: 0,
    recordId: row.patient_ref,
    sleepEfficiency: telemetryCell(row),
    remLatency: {
      value: premium ? 'TipTraQ' : 'Wearable',
      status: row.device_alert_triggered ? 'amber' : 'green',
      hint: premium ? 'Premium sleep block on file' : 'Phone or wearable proxy',
    },
    pth: pthCell(row),
    d3Timing: {
      value: row.triage_status === 'ON_TRACK' ? 'On file' : 'Review',
      status:
        row.triage_status === 'URGENT'
          ? 'red'
          : row.triage_status === 'REVIEW'
            ? 'amber'
            : 'green',
      hint: 'From dose confirmations when logged',
    },
    clinicalRead: clinicalReadForTriage(row),
    action: actionForTriage(row.triage_status, row.device_alert_triggered),
  }
}

export type ClinicCohortEntry = {
  prgc: PrgcMonitoringPatient
  protocol: string
  patientProfileId: string
  triageStatus: TriageStatus
}

export function triageRowToClinicCohortEntry(row: ClinicianTriageDashboardRow): ClinicCohortEntry {
  return {
    prgc: triageRowToPrgcPatient(row),
    protocol: row.protocol,
    patientProfileId: row.patient_id,
    triageStatus: row.triage_status,
  }
}
