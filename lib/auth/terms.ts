import type { SupabaseClient } from '@supabase/supabase-js'

export async function hasAcceptedTerms(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from('profiles')
    .select('terms_accepted_at')
    .eq('id', userId)
    .maybeSingle<{ terms_accepted_at: string | null }>()

  return Boolean(data?.terms_accepted_at)
}

export async function recordTermsAcceptance(
  supabase: SupabaseClient,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('profiles')
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq('id', userId)

  return { error: error ? new Error(error.message) : null }
}
