import type { LinkPatientResult } from '@/lib/care/link-patient'
import { adminClient } from '@/lib/supabase/admin'
import { linkPatientToClinician } from '@/lib/care/link-patient'

export async function tryActivationLinkForUser(
  patientId: string,
  rawCode: string
): Promise<LinkPatientResult> {
  return linkPatientToClinician(adminClient, patientId, rawCode)
}

/** @deprecated Import from resolve-activation-path (client-safe) or tryActivationLinkForUser above. */
export {
  DEFAULT_ACTIVATION_NEXT,
  resolvePathAfterActivationAttempt,
} from '@/lib/care/resolve-activation-path'
