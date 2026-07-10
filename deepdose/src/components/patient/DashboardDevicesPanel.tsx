'use client'

import type { WearableProvider } from '@/lib/wearables/tiers'
import { WearableDeviceRow, type DeviceConnectionState } from '@/components/patient/WearableDeviceCard'
import { Button } from '@/components/ui/Button'
import { Callout } from '@/components/ui/Form'

type DashboardDevicesPanelProps = {
  wearables: WearableProvider[]
  clinicalKit: WearableProvider[]
  connections: Record<string, DeviceConnectionState | null>
  ouraConfigured: boolean
  whoopConfigured: boolean
  flash?: {
    oura?: 'connected' | 'error'
    whoop?: 'connected' | 'error'
  }
}

export function DashboardDevicesPanel({
  wearables,
  clinicalKit,
  connections,
  ouraConfigured,
  whoopConfigured,
  flash,
}: DashboardDevicesPanelProps) {
  return (
    <div className="dash-meds__form">
      {flash?.oura === 'connected' && (
        <Callout tone="success">Oura connected.</Callout>
      )}
      {flash?.oura === 'error' && (
        <Callout tone="warning">Oura connection failed. Try again.</Callout>
      )}
      {flash?.whoop === 'connected' && (
        <Callout tone="success">Whoop connected.</Callout>
      )}
      {flash?.whoop === 'error' && (
        <Callout tone="warning">Whoop connection failed. Try again.</Callout>
      )}

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="devices-wearables-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="devices-wearables-title" className="dash-meds__section-title">
            Phone &amp; wearables
          </h2>
        </div>

        {wearables.length === 0 ? (
          <p className="dash-meds__empty-copy">Nothing available yet.</p>
        ) : (
          <ul className="dash-meds__list">
            {wearables.map((provider) => (
              <WearableDeviceRow
                key={provider.id}
                provider={provider}
                connection={connections[provider.id] ?? null}
                ouraConfigured={ouraConfigured}
                whoopConfigured={whoopConfigured}
              />
            ))}
          </ul>
        )}
      </section>

      <section
        className="dash-meds__tile seco-app-card p-5 md:p-6"
        aria-labelledby="devices-clinical-title"
      >
        <div className="dash-meds__section-head">
          <h2 id="devices-clinical-title" className="dash-meds__section-title">
            Clinical kit
          </h2>
        </div>

        <ul className="dash-meds__list">
          {clinicalKit.map((provider) => (
            <WearableDeviceRow
              key={provider.id}
              provider={provider}
              connection={connections[provider.id] ?? null}
              ouraConfigured={ouraConfigured}
              whoopConfigured={whoopConfigured}
            />
          ))}
        </ul>
      </section>

      <div className="dash-meds__actions">
        <Button href="/dosage" variant="secondary" className="dash-meds__cancel">
          Back to dash
        </Button>
      </div>
    </div>
  )
}
