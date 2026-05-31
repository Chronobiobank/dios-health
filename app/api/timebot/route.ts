import { NextResponse } from 'next/server'

import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { buildTimebotContext, buildTimebotData } from '@/lib/dashboard/timebot-data'
import { getPatientFirstName } from '@/lib/auth/greeting'
import { createAnthropicClient, mapAnthropicError } from '@/lib/tiptraq/anthropic-client'
import { createClient } from '@/lib/supabase/server'

const TIMEBOT_MODEL = 'claude-sonnet-4-6'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const body = (await request.json()) as { message?: string }
    const message = body.message?.trim()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const [{ data: dlmoProfile }, { data: patient }, { count: nightsCount }] = await Promise.all([
      supabase.from('dlmo_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
      supabase
        .from('patient_profiles')
        .select('first_name, location_city, location_country')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('tiptraq_nights')
        .select('id', { count: 'exact', head: true })
        .eq('patient_id', user.id),
    ])

    const hasTipTraqData = (nightsCount ?? 0) > 0
    const profileRow = (dlmoProfile as DlmoProfileRow | null) ?? null

    if (!hasTipTraqData || !profileRow) {
      return NextResponse.json(
        { error: 'Upload your first TipTraQ night to activate your Timebot.' },
        { status: 422 }
      )
    }

    const firstName = getPatientFirstName({
      firstName: patient?.first_name,
      fullName: user.user_metadata?.full_name as string | undefined,
    })

    const schedule = buildTimebotData({
      profile: profileRow,
      hasTipTraqData,
      firstName,
      locationCity: patient?.location_city,
      locationCountry: patient?.location_country,
    })

    const context = buildTimebotContext(profileRow, schedule)
    const anthropic = createAnthropicClient()

    const response = await anthropic.messages.create({
      model: TIMEBOT_MODEL,
      max_tokens: 500,
      system: `You are DIʘS Timebot — a calm, clinical timing assistant for patients on chronotherapy.
Answer in plain English using the patient's DLMO profile and today's schedule.
Keep answers under 120 words. Never diagnose or change prescriptions. Encourage discussing changes with their GP.
If asked about medications not in the schedule, explain you only track their four DIʘS timing modules.`,
      messages: [
        {
          role: 'user',
          content: `${context}\n\nPatient question: ${message}`,
        },
      ],
    })

    const answer = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('')
      .trim()

    if (!answer) {
      return NextResponse.json({ error: 'Timebot returned an empty response. Try again.' }, { status: 502 })
    }

    return NextResponse.json({ answer })
  } catch (error) {
    const mapped = mapAnthropicError(error)
    if (mapped) {
      return NextResponse.json({ error: mapped.replace('Report extraction', 'Timebot') }, { status: 502 })
    }
    return NextResponse.json({ error: 'Could not reach Timebot. Please try again.' }, { status: 500 })
  }
}
