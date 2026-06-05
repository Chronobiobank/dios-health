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
  }, [])

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
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7eb8ff]">
            Find a scan node
          </p>
          <p className="mt-1 text-xs text-[rgb(250_250_247/0.55)]">
            Siloton GiraffeOCT nodes · pharmacy & clinical hubs
          </p>
        </div>
        {coords ? (
          <p className="font-mono text-[10px] text-[rgb(250_250_247/0.4)]">
            {coords.lat.toFixed(2)}, {coords.lng.toFixed(2)}
          </p>
        ) : null}
      </div>

      <div className="retinomic-siloton-map">
        <div className="retinomic-siloton-map__canvas" aria-hidden>
          {nodes.slice(0, 4).map((node, i) => (
            <span
              key={node.id}
              className="absolute h-2 w-2 rounded-full bg-[#7eb8ff] shadow-[0_0_12px_#7eb8ff]"
              style={{
                left: `${18 + i * 18}%`,
                top: `${30 + (i % 2) * 22}%`,
              }}
            />
          ))}
        </div>
        <div className="retinomic-siloton-node-list">
          {status === 'loading' ? (
            <p className="text-center text-xs text-[rgb(250_250_247/0.5)]">Resolving nearby nodes…</p>
          ) : null}
          {status === 'error' ? (
            <p className="text-center text-xs text-[#f87171]">Could not load nodes. Retry shortly.</p>
          ) : null}
          {nodes.map((node) => (
            <button key={node.id} type="button" className="retinomic-siloton-node">
              <span className="min-w-0">
                <span className="block text-sm font-medium text-[#fafaf7]">{node.name}</span>
                <span className="mt-0.5 block text-xs text-[rgb(250_250_247/0.5)]">{node.address}</span>
                <span className="mt-1 block font-mono text-[10px] text-[rgb(250_250_247/0.4)]">
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
