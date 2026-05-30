import type { PatientStatus } from '@/lib/clinic/demo-patients'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<PatientStatus, string> = {
  'Act now': 'bg-teal-50 text-teal-800',
  'Earlier dose': 'bg-amber-50 text-amber-800',
  'Need bloods': 'bg-amber-50 text-amber-800',
  'On track': 'bg-black/5 text-black/40',
}

export function StatusPill({ status }: { status: PatientStatus }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium',
        STATUS_STYLES[status]
      )}
    >
      {status}
    </span>
  )
}
