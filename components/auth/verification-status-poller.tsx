'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { CLINIC_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'

type VerificationStatusPollerProps = {
  userId: string
}

/** Redirect to clinic panel when admin marks clinician verified. */
export function VerificationStatusPoller({ userId }: VerificationStatusPollerProps) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const checkVerified = async () => {
      const { data } = await supabase
        .from('clinician_profiles')
        .select('verified')
        .eq('id', userId)
        .maybeSingle<{ verified: boolean }>()

      if (data?.verified) {
        router.refresh()
        router.push(CLINIC_ROUTES.panel)
      }
    }

    void checkVerified()
    const interval = window.setInterval(checkVerified, 20_000)
    return () => window.clearInterval(interval)
  }, [router, userId])

  return null
}
