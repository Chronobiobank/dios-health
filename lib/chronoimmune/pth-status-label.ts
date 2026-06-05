import { calculatePthTarget } from '@/lib/chronoimmune/pth-target'
import type { ChronoimmuneProfile } from '@/lib/patient-dashboard/types'

export type PthStatusTone = 'target' | 'middle' | 'ceiling' | 'floor'

export type PthStatusLabel = {
  label: string
  tone: PthStatusTone
}

export function pthStatusFromProfile(profile: ChronoimmuneProfile): PthStatusLabel {
  const latest = profile.labHistory[profile.labHistory.length - 1]
  const result = calculatePthTarget(
    latest.pth,
    profile.pthReferenceLower,
    profile.pthReferenceUpper,
    profile.pthFloorThreshold
  )

  if (result.nearFloor) {
    return { label: 'PTH floor alert', tone: 'floor' }
  }
  if (result.inLowerThird) {
    return { label: 'PTH in lower third', tone: 'target' }
  }
  if (result.inUpperTwoThirds && latest.pth > profile.pthReferenceUpper * 0.66) {
    return { label: 'PTH upper range', tone: 'ceiling' }
  }
  return { label: 'PTH middle third', tone: 'middle' }
}
