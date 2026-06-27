import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/** PRD /dashboard — routes to biochemical status when signed in, else clinical gate. */
export default async function DashboardAliasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/patient/dashboard/status')
  }
  redirect('/gate')
}
