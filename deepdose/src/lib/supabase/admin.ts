import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is required for the Supabase admin client (server-only).`)
  }
  return value
}

let _adminClient: SupabaseClient | null = null

/** Service-role client — server routes / Server Components only. Never import from client components. */
export function getAdminClient(): SupabaseClient {
  if (typeof window !== 'undefined') {
    throw new Error('Supabase admin client must not be used in the browser.')
  }
  if (!_adminClient) {
    _adminClient = createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _adminClient
}

/** @deprecated Prefer getAdminClient() — kept for existing server imports. */
export const adminClient: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getAdminClient()
    const value = Reflect.get(client, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
