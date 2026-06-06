import { NextResponse } from 'next/server'

import {
  MOCK_PERSONA_KEYS,
  MockIngestionDataGenerator,
  type MockPersonaKey,
} from '@/lib/dios/ingestion'

function isPersonaKey(value: string): value is MockPersonaKey {
  return (MOCK_PERSONA_KEYS as readonly string[]).includes(value)
}

/** Pull-based mock ingestion sync — mirrors dashboard-load trigger from CLAUDE.md §1. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const persona = searchParams.get('persona')
  const syncedAt = searchParams.get('synced_at') ?? undefined

  if (persona) {
    if (!isPersonaKey(persona)) {
      return NextResponse.json(
        { error: 'Unknown persona', valid: MOCK_PERSONA_KEYS },
        { status: 400 }
      )
    }
    return NextResponse.json(
      MockIngestionDataGenerator.generate(persona, { syncedAt })
    )
  }

  return NextResponse.json({
    synced_at: syncedAt ?? new Date().toISOString(),
    patients: MockIngestionDataGenerator.generateAll({ syncedAt }),
  })
}
