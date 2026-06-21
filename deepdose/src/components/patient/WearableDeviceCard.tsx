'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { WearableProvider } from '@/lib/wearables/tiers'
import { formatDateTime24 } from '@/lib/utils/time'
import { Button } from '@/components/ui/Button'
import { FormError } from '@/components/ui/Form'

export type DeviceConnectionState = {
  connected: boolean
  lastSyncAt: string | null
  syncStatus: string | null
  lastError: string | null
}

type WearableDeviceRowProps = {
  provider: WearableProvider
  connection: DeviceConnectionState | null
  ouraConfigured?: boolean
  whoopConfigured?: boolean
}

export function WearableDeviceRow({
  provider,
  connection,
  ouraConfigured = false,
  whoopConfigured = false,
}: WearableDeviceRowProps) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
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
    <li className="dash-med-row dios-select-card dios-select-card--selected">
      <button
        type="button"
        className="dash-med-row__toggle"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls={`dash-device-detail-${provider.id}`}
      >
        <span className="dash-med-row__summary min-w-0 flex-1 text-left">
          <span className="dash-med-row__name">{provider.displayName}</span>
          <span className="dash-med-row__meta">
            {connected ? 'Connected' : 'Not connected'}
            {connected && connection?.lastSyncAt
              ? ` · ${new Date(connection.lastSyncAt).toLocaleDateString()}`
              : ''}
          </span>
        </span>
        <span className="dose-dash-expand-icon" aria-hidden>
          {expanded ? '−' : '+'}
        </span>
      </button>

      {expanded && (
        <div
          id={`dash-device-detail-${provider.id}`}
          className="dash-med-row__detail border-t border-border px-4 pb-4 pt-3 md:px-5 md:pb-5"
        >
          <div className="space-y-3">
            {isClinical && (
              <p className="text-sm text-ink-muted">
                🛡️ Verified Clinical-Grade Data via TipTraQ
              </p>
            )}

            <p className="text-sm leading-relaxed text-ink-muted">{provider.description}</p>
            <p className="text-xs text-ink-faint">{provider.streams}</p>
            <p className="text-xs text-ink-faint">
              Data quality cap: {provider.clinicalReliabilityMax}/100
            </p>

            {connected && connection?.lastSyncAt && (
              <p className="text-sm text-ink-muted">
                Last sync: {formatDateTime24(connection.lastSyncAt)}
                {connection.syncStatus === 'error' && connection.lastError
                  ? ` · ${connection.lastError}`
                  : ''}
              </p>
            )}

            {error && <FormError>{error}</FormError>}

            <div className="flex flex-wrap gap-3 pt-1">
              {provider.id === 'oura' && !connected && ouraConfigured && (
                <Button href="/api/wearables/oura/authorize">Connect Oura</Button>
              )}
              {provider.id === 'oura' && !connected && !ouraConfigured && (
                <p className="text-sm text-ink-muted">Oura connect is not available yet.</p>
              )}
              {provider.id === 'whoop' && !connected && whoopConfigured && (
                <Button href="/api/wearables/whoop/authorize">Connect Whoop</Button>
              )}
              {provider.id === 'whoop' && !connected && !whoopConfigured && (
                <p className="text-sm text-ink-muted">Whoop connect is not available yet.</p>
              )}
              {(provider.id === 'oura' || provider.id === 'whoop') && connected && (
                <Button type="button" variant="secondary" onClick={handleSync} disabled={syncing}>
                  {syncing ? 'Syncing…' : 'Sync now'}
                </Button>
              )}
              {provider.id === 'apple_health' && (
                <p className="text-sm text-ink-muted">
                  {connected
                    ? 'Keep the DeepDose Health Shortcut running on your iPhone.'
                    : 'Add the DeepDose Health Shortcut on iPhone to share sleep automatically.'}
                </p>
              )}
              {provider.id === 'tiptraq' && !connected && (
                <p className="text-sm text-ink-muted">
                  Your clinician adds the report after your three-night home kit.
                </p>
              )}
              {(provider.id === 'oura' || provider.id === 'whoop') && (
                <Link href="/patient/profile" className="dash-meds__inline-link text-sm">
                  Clinician sharing
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  )
}

/** @deprecated Use WearableDeviceRow */
export const WearableDeviceCard = WearableDeviceRow
