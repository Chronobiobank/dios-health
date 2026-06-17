'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

export function ClinicianLinkForm() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    const res = await fetch('/api/care/link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Could not link clinician.')
      return
    }

    setSuccess(`Linked to ${data.clinicianName}.`)
    setCode('')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label className="block text-sm text-ink-muted">
        Clinician invite code
        <input
          className="dios-input mt-1.5 w-full uppercase tracking-widest"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ABCD1234"
          autoComplete="off"
          maxLength={12}
        />
      </label>
      {error && <FormError>{error}</FormError>}
      {success && <p className="text-sm text-success">{success}</p>}
      <Button type="submit" disabled={loading || !code.trim()}>
        {loading ? 'Linking…' : 'Link clinician'}
      </Button>
    </form>
  )
}
