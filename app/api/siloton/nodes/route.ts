import { NextResponse } from 'next/server'

import { findNearbySilotonNodes } from '@/lib/retinomic/siloton-nodes'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = Number(searchParams.get('lat'))
  const lng = Number(searchParams.get('lng'))

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 })
  }

  const nodes = findNearbySilotonNodes(lat, lng)
  return NextResponse.json({ nodes })
}
