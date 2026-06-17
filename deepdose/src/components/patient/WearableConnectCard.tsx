'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Layout'
import { FormError } from '@/components/ui/Form'

type WearableConnectCardProps = {
  connected: boolean
  lastSyncAt: string | null
  syncStatus: string | null
  lastError: string | null
  ouraConfigured: boolean
}

export function WearableConnectCard({
  connected,
  lastSyncAt,
  syncStatus,
  lastError,
  ouraConfigured,
}: WearableConnectCardProps) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSync() {
    setSyncing(true)
    setError(null)
    const res = await fetch('/api/wearables/sync', { method: 'POST' })
    const data = await res.json()
    setSyncing(false)
    if (!res.ok) {
      setError(data.error ?? 'Sync failed')
      return
    }
    router.refresh()
  }

  return (
    <div className="seco-app-card space-y-4 p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="seco-page__eyebrow mb-1">Core tier</p>
          <h2 className="seco-app-card__title">Oura Ring</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Sleep onset, wake time, deep and REM — improves your data quality score.
          </p>
        </div>
        <Badge tone={connected ? 'success' : 'warning'}>
          {connected ? 'Connected' : 'Not connected'}
        </Badge>
      </div>

      {connected && lastSyncAt && (
        <p className="text-sm text-ink-muted">
          Last sync: {new Date(lastSyncAt).toLocaleString()}
          {syncStatus === 'error' && lastError ? ` · ${lastError}` : ''}
        </p>
      )}

      {error && <FormError>{error}</FormError>}

      <div className="flex flex-wrap gap-3">
        {!connected && ouraConfigured && (
          <Button href="/api/wearables/oura/authorize">Connect Oura</Button>
        )}
        {!connected && !ouraConfigured && (
          <p className="text-sm text-ink-muted">
            Oura OAuth is not configured yet (set OURA_CLIENT_ID and OURA_CLIENT_SECRET).
          </p>
        )}
        {connected && (
          <Button type="button" variant="secondary" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing…' : 'Sync now'}
          </Button>
        )}
        <Link href="/patient/profile" className="text-sm text-accent underline">
          Clinician sharing →
        </Link>
      </div>
    </div>
  )
}
