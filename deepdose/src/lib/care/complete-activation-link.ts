import type { LinkPatientErrorCode } from '@/lib/care/link-patient'
import {
  clearPendingActivation,
  normalizeActivationCode,
  readPendingActivation,
} from '@/lib/care/pending-activation'

export type ActivationLinkResult =
  | { ok: true; clinicianName: string }
  | { ok: false; error: string; code: LinkPatientErrorCode }

export async function completeActivationLink(rawCode?: string): Promise<ActivationLinkResult> {
  const code = normalizeActivationCode(rawCode ?? readPendingActivation() ?? '')
  if (code.length < 6) {
    return { ok: false, error: 'Invalid activation code.', code: 'invalid_code' }
  }

  const res = await fetch('/api/care/link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  })

  const data = (await res.json().catch(() => ({}))) as {
    error?: string
    code?: LinkPatientErrorCode
    clinicianName?: string
  }

  if (!res.ok) {
    return {
      ok: false,
      error: data.error ?? 'Could not link your clinician.',
      code: data.code ?? 'unknown',
    }
  }

  clearPendingActivation()
  return { ok: true, clinicianName: data.clinicianName ?? 'Your clinician' }
}
