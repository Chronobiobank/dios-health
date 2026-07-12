'use client'

import { useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'

type AuthUser = {
  id: string
} | null

/**
 * Client auth presence for chrome switching.
 * `ready` is false until the first getUser() settles (SSR-safe empty chrome).
 */
export function useSupabaseUser(): { user: AuthUser; ready: boolean } {
  const [user, setUser] = useState<AuthUser>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const supabase = createClient()

    void (async () => {
      const {
        data: { user: next },
      } = await supabase.auth.getUser()
      if (cancelled) return
      setUser(next ? { id: next.id } : null)
      setReady(true)
    })()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id } : null)
      setReady(true)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  return { user, ready }
}
