import { TIPTRAQ_CALIBRATION } from '@/lib/product/intelligence-cadence'

export type CalibrationGateStatus = 'pending' | 'partial' | 'complete'

export function resolveCalibrationGate(nightsCount: number): CalibrationGateStatus {
  if (nightsCount <= 0) return 'pending'
  if (nightsCount < TIPTRAQ_CALIBRATION.nightsPerBlock) return 'partial'
  return 'complete'
}

export function nightsRemainingInBlock(nightsCount: number): number {
  if (nightsCount <= 0) return TIPTRAQ_CALIBRATION.nightsPerBlock
  return Math.max(0, TIPTRAQ_CALIBRATION.nightsPerBlock - nightsCount)
}

export function isCalibrationComplete(nightsCount: number): boolean {
  return resolveCalibrationGate(nightsCount) === 'complete'
}

export function calibrationGateLabel(gate: CalibrationGateStatus, nightsCount: number): string {
  if (gate === 'pending') return 'Calibrate with TipTraQ'
  if (gate === 'partial') {
    return `${nightsCount} of ${TIPTRAQ_CALIBRATION.nightsPerBlock} nights`
  }
  return 'Calibrated'
}
