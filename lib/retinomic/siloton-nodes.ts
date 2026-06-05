import type { SilotonScanNode } from '@/lib/retinomic/types'

const SEED_HUBS: Omit<SilotonScanNode, 'distanceKm' | 'lat' | 'lng'>[] = [
  {
    id: 'silo-auck-01',
    name: 'Unichem Queen Street',
    hubType: 'pharmacy',
    address: '237 Queen St, Auckland CBD',
    openUntil: '18:30',
    slotsAvailable: 2,
  },
  {
    id: 'silo-auck-02',
    name: 'Life Pharmacy Sylvia Park',
    hubType: 'pharmacy',
    address: 'Sylvia Park Shopping Centre, Mt Wellington',
    openUntil: '21:00',
    slotsAvailable: 4,
  },
  {
    id: 'silo-wlg-01',
    name: 'RetinaNZ Clinical Hub',
    hubType: 'clinical_hub',
    address: '85 The Terrace, Wellington',
    openUntil: '17:00',
    slotsAvailable: 1,
  },
  {
    id: 'silo-chc-01',
    name: 'Pharmacy on Riccarton',
    hubType: 'pharmacy',
    address: '146 Riccarton Rd, Christchurch',
    openUntil: '19:00',
    slotsAvailable: 3,
  },
  {
    id: 'silo-lon-01',
    name: 'Boots Oxford Street',
    hubType: 'pharmacy',
    address: '214 Oxford St, London W1',
    openUntil: '20:00',
    slotsAvailable: 2,
  },
]

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const r = 6371
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return r * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function offsetCoord(lat: number, lng: number, index: number): { lat: number; lng: number } {
  const bearing = (index * 137.5 * Math.PI) / 180
  const km = 0.8 + index * 1.1
  const dLat = (km / 111) * Math.cos(bearing)
  const dLng = (km / (111 * Math.cos((lat * Math.PI) / 180))) * Math.sin(bearing)
  return { lat: lat + dLat, lng: lng + dLng }
}

export function findNearbySilotonNodes(lat: number, lng: number, limit = 5): SilotonScanNode[] {
  return SEED_HUBS.map((hub, index) => {
    const coords = offsetCoord(lat, lng, index)
    const distanceKm = Math.round(haversineKm(lat, lng, coords.lat, coords.lng) * 10) / 10
    return {
      ...hub,
      lat: coords.lat,
      lng: coords.lng,
      distanceKm: Math.max(0.4, distanceKm),
    }
  })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit)
}
