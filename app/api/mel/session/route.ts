import { NextResponse } from 'next/server'

import { melSessionsTable } from '@/lib/dios/core/mel-sessions'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from(melSessionsTable())
    .insert({ patient_id: user.id })
    .select('id, started_at')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Could not start Mel session.' }, { status: 500 })
  }

  return NextResponse.json({
    sessionId: data.id,
    startedAt: data.started_at,
  })
}

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { count, error: countError } = await supabase
    .from(melSessionsTable())
    .select('id', { count: 'exact', head: true })
    .eq('patient_id', user.id)

  if (countError) {
    return NextResponse.json({ error: 'Could not load session history.' }, { status: 500 })
  }

  const { data: latest, error: latestError } = await supabase
    .from(melSessionsTable())
    .select('id, started_at')
    .eq('patient_id', user.id)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (latestError) {
    return NextResponse.json({ error: 'Could not load latest session.' }, { status: 500 })
  }

  return NextResponse.json({
    count: count ?? 0,
    latestSessionId: latest?.id ?? null,
    latestStartedAt: latest?.started_at ?? null,
  })
}
