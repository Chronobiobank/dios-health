'use client'

import { useCallback, useEffect, useState } from 'react'

import type { SilotonScanNode } from '@/lib/retinomic/types'

type SilotonNodeLocatorProps = {
  className?: string
  onGeoResolved?: (coords: { lat: number; lng: number }) => void
}

export function SilotonNodeLocator({ className, onGeoResolved }: SilotonNodeLocatorProps) {
  const [nodes, setNodes] = useState<SilotonScanNode[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const loadNodes = useCallback(async (lat: number, lng: number) => {
    setStatus('loading')
    setCoords({ lat, lng })
    onGeoResolved?.({ lat, lng })
    try {
      const res = await fetch(`/api/siloton/nodes?lat=${lat}&lng=${lng}`)
      if (!res.ok) throw new Error('fetch failed')
      const json = (await res.json()) as { nodes: SilotonScanNode[] }
      setNodes(json.nodes)
      setStatus('ready')
    } catch {
      setStatus('error')
      setNodes([])
    }
  }, [onGeoResolved])

  useEffect(() => {
    if (!navigator.geolocation) {
      void loadNodes(-36.8485, 174.7633)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => void loadNodes(pos.coords.latitude, pos.coords.longitude),
      () => void loadNodes(-36.8485, 174.7633),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120_000 }
    )
  }, [loadNodes, onGeoResolved])

  return (
    <div className={className}>
      <div className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="calm-auth-eyebrow">Find a scan node</p>
          <p className="dash-sub mt-1 text-xs">
            Siloton GiraffeOCT nodes · pharmacy & clinical hubs
          </p>
        </div>
        {coords ? (
          <p className="dash-sub font-mono text-[10px]">
            {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
          </p>
        ) : null}
      </div>

      <div className="dios-glass-outer retinomic-siloton-map p-0">
        <div className="retinomic-siloton-map__canvas" aria-hidden>
          {nodes.slice(0, 4).map((node, i) => (
            <span
              key={node.id}
              className="absolute h-2 w-2 rounded-full bg-[var(--photic-core)] shadow-[0_0_12px_var(--photic-core)]"
              style={{
                left: `${18 + i * 18}%`,
                top: `${30 + (i % 2) * 22}%`,
              }}
            />
          ))}
        </div>
        <div className="retinomic-siloton-node-list">
          {status === 'loading' ? (
            <p className="calm-auth-muted text-center text-xs">Resolving nearby nodes…</p>
          ) : null}
          {status === 'error' ? (
            <p className="text-center text-xs text-red-600/90">Could not load nodes. Retry shortly.</p>
          ) : null}
          {nodes.map((node) => (
            <button key={node.id} type="button" className="dios-glass-inner retinomic-siloton-node">
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[var(--text-primary)]">{node.name}</span>
                <span className="dash-sub mt-0.5 block text-xs">{node.address}</span>
                <span className="dash-sub mt-1 block font-mono text-[10px]">
                  Open until {node.openUntil} · {node.slotsAvailable} slot
                  {node.slotsAvailable === 1 ? '' : 's'}
                </span>
              </span>
              <span className="retinomic-siloton-node__distance">{node.distanceKm} km</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
