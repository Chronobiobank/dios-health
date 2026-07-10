'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { DEEPDOSE_WORDMARK } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_PRODUCT_MANDATE } from '@/lib/unmed/product-philosophy'
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
      `/?next=${encodeURIComponent('/patient/dashboard/status')}&activation=${encodeURIComponent(normalized)}`
    )
  }

  return (
    <section className="deepdose-gate">
      <header className="deepdose-gate__head">
        <h1 className="deepdose-gate__brand">{DEEPDOSE_WORDMARK}</h1>
        <p className="deepdose-gate__tagline">{DEEPDOSE_PRODUCT_MANDATE.tagline}</p>
        <p className="deepdose-gate__mandate">{DEEPDOSE_PRODUCT_MANDATE.antiAttention}</p>
      </header>

      <form className="dios-glass-outer deepdose-gate__card" onSubmit={handleSubmit}>
        <label className="deepdose-gate__label" htmlFor="activation-code">
          Enter clinician activation token
        </label>
        <input
          id="activation-code"
          type="text"
          maxLength={8}
          placeholder="A X 9 4 B 2"
          className="deepdose-gate__code font-mono tabular-nums"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          autoComplete="off"
          spellCheck={false}
        />
        {error ? <p className="deepdose-gate__error">{error}</p> : null}
        <button
          type="submit"
          className={cn('deepdose-gate__submit', loading && 'deepdose-gate__submit--busy')}
          disabled={loading}
        >
          {loading ? 'Authorizing…' : 'Authorize clinical setup'}
        </button>
      </form>

      <footer className="deepdose-gate__privacy">
        <p>
          <strong>Zero-Cloud Privacy Guard:</strong> {DEEPDOSE_PRODUCT_MANDATE.privacyGuard}
        </p>
      </footer>
    </section>
  )
}
