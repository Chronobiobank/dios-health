'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { AUTH_ROUTES } from '@/lib/auth/routes'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type SignOutButtonProps = {
  className?: string
}

export function SignOutButton({ className }: SignOutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSignOut() {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: signOutError } = await supabase.auth.signOut()

    if (signOutError) {
      setError('Could not sign out. Please try again.')
      setLoading(false)
      return
    }

    router.push(AUTH_ROUTES.signIn)
    router.refresh()
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={loading}
        className={cn(
          'text-sm text-black/60 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-60'
        )}
      >
        {loading ? 'Signing out…' : 'Sign out'}
      </button>
      {error ? (
        <p className="type-body mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
