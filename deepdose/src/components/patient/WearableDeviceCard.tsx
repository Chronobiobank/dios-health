'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { WearableProvider } from '@/lib/wearables/tiers'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Layout'
import { FormError } from '@/components/ui/Form'

type ConnectionState = {
  connected: boolean
  lastSyncAt: string | null
  syncStatus: string | null
  lastError: string | null
}

type WearableDeviceCardProps = {
  provider: WearableProvider
  connection: ConnectionState | null
  ouraConfigured?: boolean
}

export function WearableDeviceCard({
  provider,
  connection,
  ouraConfigured = false,
}: WearableDeviceCardProps) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connected = connection?.connected ?? false
  const isClinical = provider.tier === 'clinical'

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
    <div
      className={`seco-app-card space-y-4 p-5 md:p-6 ${isClinical ? 'ring-1 ring-accent/25' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="seco-page__eyebrow mb-1">
            {provider.eyebrow}
            {isClinical && (
              <span className="ml-2 normal-case tracking-normal text-accent">
                · Highest clinical accuracy
              </span>
            )}
          </p>
          <h2 className="seco-app-card__title">{provider.displayName}</h2>
          <p className="mt-1 text-sm text-ink-muted">{provider.description}</p>
          <p className="mt-1 text-xs text-ink-faint">{provider.streams}</p>
          <p className="mt-2 text-xs text-ink-faint">
            Data quality cap: {provider.clinicalReliabilityMax}/100
          </p>
        </div>
        <Badge tone={connected ? 'success' : isClinical ? 'warning' : 'warning'}>
          {connected ? 'Connected' : 'Not connected'}
        </Badge>
      </div>

      {isClinical && (
        <p className="text-sm text-ink-muted">
          🛡️ Verified Clinical-Grade Data via TipTraQ — unlocks clinician premium badge when
          connected.
        </p>
      )}

      {connected && connection?.lastSyncAt && (
        <p className="text-sm text-ink-muted">
          Last sync: {new Date(connection.lastSyncAt).toLocaleString()}
          {connection.syncStatus === 'error' && connection.lastError
            ? ` · ${connection.lastError}`
            : ''}
        </p>
      )}

      {error && <FormError>{error}</FormError>}

      <div className="flex flex-wrap gap-3">
        {provider.id === 'oura' && !connected && ouraConfigured && (
          <Button href="/api/wearables/oura/authorize">Connect Oura</Button>
        )}
        {provider.id === 'oura' && !connected && !ouraConfigured && (
          <p className="text-sm text-ink-muted">
            Oura OAuth is not configured yet (set OURA_CLIENT_ID and OURA_CLIENT_SECRET).
          </p>
        )}
        {provider.id === 'oura' && connected && (
          <Button type="button" variant="secondary" onClick={handleSync} disabled={syncing}>
            {syncing ? 'Syncing…' : 'Sync now'}
          </Button>
        )}
        {!provider.connectable && !connected && (
          <p className="text-sm text-ink-muted">
            {provider.id === 'tiptraq'
              ? 'On your GP’s advice: wear the kit for three nights at home (£149). Your clinician adds the report — then your dashboard shows the best times for light, meals, medicines, exercise, and sleep.'
              : 'Connection coming soon. Oura is available today.'}
          </p>
        )}
        {provider.id === 'oura' && (
          <Link href="/patient/profile" className="text-sm text-accent underline">
            Clinician sharing →
          </Link>
        )}
      </div>
    </div>
  )
}
