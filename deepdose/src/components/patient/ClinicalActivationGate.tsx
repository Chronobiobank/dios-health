'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { UNMED_PRODUCT_MANDATE } from '@/lib/unmed/product-philosophy'
import { persistPendingActivation } from '@/lib/care/pending-activation'
import { cn } from '@/lib/utils/cn'

type ClinicalActivationGateProps = {
  isAuthenticated?: boolean
}

export function ClinicalActivationGate({ isAuthenticated = false }: ClinicalActivationGateProps) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    const normalized = code.replace(/\s/g, '').toUpperCase()
    if (normalized.length < 6) {
      setError('Enter the 6-character activation token from your clinician.')
      return
    }

    setLoading(true)
    setError(null)

    if (isAuthenticated) {
      const res = await fetch('/api/care/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: normalized }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) {
        setError(data.error ?? 'Could not authorize clinical setup.')
        return
      }
      router.push('/patient/dashboard/status')
      router.refresh()
      return
    }

    setLoading(false)
    persistPendingActivation(normalized)
    router.push(
      `/login?next=${encodeURIComponent('/patient/dashboard/status')}&activation=${encodeURIComponent(normalized)}`
    )
  }

  return (
    <section className="unmed-gate">
      <header className="unmed-gate__head">
        <h1 className="unmed-gate__brand">unmed</h1>
        <p className="unmed-gate__tagline">{UNMED_PRODUCT_MANDATE.tagline}</p>
        <p className="unmed-gate__mandate">{UNMED_PRODUCT_MANDATE.antiAttention}</p>
      </header>

      <form className="dios-glass-outer unmed-gate__card" onSubmit={handleSubmit}>
        <label className="unmed-gate__label" htmlFor="activation-code">
          Enter clinician activation token
        </label>
        <input
          id="activation-code"
          type="text"
          maxLength={8}
          placeholder="A X 9 4 B 2"
          className="unmed-gate__code font-mono tabular-nums"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
          spellCheck={false}
        />
        {error ? <p className="unmed-gate__error">{error}</p> : null}
        <button
          type="submit"
          className={cn('unmed-gate__submit', loading && 'unmed-gate__submit--busy')}
          disabled={loading}
        >
          {loading ? 'Authorizing…' : 'Authorize clinical setup'}
        </button>
      </form>

      <footer className="unmed-gate__privacy">
        <p>
          <strong>Zero-Cloud Privacy Guard:</strong> {UNMED_PRODUCT_MANDATE.privacyGuard}
        </p>
      </footer>
    </section>
  )
}
