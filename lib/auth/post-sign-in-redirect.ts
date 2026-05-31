import type { SupabaseClient } from '@supabase/supabase-js'

import { getPostAuthPath } from '@/lib/auth/redirects'
import { CLINIC_ROUTES, PATIENT_ROUTES } from '@/lib/auth/routes'

export function isSafeRelativePath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//') && !path.includes('://')
}

export async function resolveSignInDestination(
  supabase: SupabaseClient,
  userId: string,
  nextParam: string | null
): Promise<string> {
  const defaultDestination = await getPostAuthPath(supabase, userId)

  if (!nextParam || !isSafeRelativePath(nextParam)) {
    return defaultDestination
  }

  if (defaultDestination === PATIENT_ROUTES.vaya && nextParam.startsWith('/dashboard')) {
    return nextParam
  }

  if (defaultDestination === CLINIC_ROUTES.panel && nextParam.startsWith('/clinic')) {
    return nextParam
  }

  if (defaultDestination.startsWith('/signup') || defaultDestination === '/pending-verification') {
    return defaultDestination
  }

  return defaultDestination
}
