import { FlagBadge } from '@/components/ui/flag-badge'
import type { PatientStatus } from '@/lib/clinic/demo-patients'

const STATUS_SEVERITY: Record<
  PatientStatus,
  'red' | 'amber' | 'green' | 'blue'
> = {
  'Act now': 'red',
  'Earlier dose': 'amber',
  'Need bloods': 'amber',
  'On track': 'green',
}

export function StatusPill({ status }: { status: PatientStatus }) {
  return <FlagBadge label={status} severity={STATUS_SEVERITY[status]} />
}
