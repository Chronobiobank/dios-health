'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

export function ClinicianInvitePanel() {
  const router = useRouter()
  const [code, setCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function createInvite() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/care/invites', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error ?? 'Could not create invite.')
      return
    }
    setCode(data.code)
    router.refresh()
  }

  return (
    <div className="seco-app-card space-y-4 p-5 md:p-6">
      <div>
        <p className="seco-page__eyebrow mb-1">Patient linking</p>
        <h2 className="seco-app-card__title">Invite code</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Patients enter this code in Profile after granting clinical care consent.
        </p>
      </div>
      {code && (
        <p className="font-mono text-2xl tracking-[0.2em] text-ink">{code}</p>
      )}
      {error && <FormError>{error}</FormError>}
      <Button type="button" onClick={createInvite} disabled={loading}>
        {loading ? 'Generating…' : code ? 'Generate new code' : 'Generate invite code'}
      </Button>
    </div>
  )
}
