import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resolveEnterpriseContext, type EnterpriseContext } from '@/lib/chronobiobank/enterprise-access'

export type EnterpriseGuard = {
  supabase: Awaited<ReturnType<typeof createClient>>
  userId: string
  context: EnterpriseContext
}

/**
 * Server-side guard for the (enterprise) route group. Redirects unauthenticated
 * users to login and non-enterprise tiers to their patient dashboard.
 */
export async function requireEnterprise(nextPath: string): Promise<EnterpriseGuard> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }

  const context = await resolveEnterpriseContext(supabase, user.id)
  if (!context) {
    redirect('/grid')
  }

  return { supabase, userId: user.id, context }
}
