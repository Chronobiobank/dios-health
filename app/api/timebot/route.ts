import { NextResponse } from 'next/server'

import type { MLuxProfileRow } from '@/lib/dashboard/mlux-profile'
import { buildTimebotContext, buildTimebotData } from '@/lib/dashboard/timebot-data'
import {
  buildSupplementContextBlock,
  buildTimebotSystemPrompt,
  extractMedicationsFromMessage,
  extractSupplementsFromMessage,
  mergeSupplementLists,
  resolveTimebotPhaseMinutes,
} from '@/lib/dashboard/timebot-supplements'
import { formatMinutesLabel } from '@/lib/dashboard/time-utils'
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

    // Pre-flight: check API key is configured
    if (!process.env.ANTHROPIC_API_KEY?.trim()) {
      return NextResponse.json(
        {
          error:
            'Vaya is not yet configured on this server. The ANTHROPIC_API_KEY environment variable is missing. Add it in Vercel → Settings → Environment Variables.',
        },
        { status: 503 }
      )
    }

    const body = (await request.json()) as { message?: string }
    const message = body.message?.trim()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const [{ data: mluxProfile }, { data: patient }, { count: nightsCount }] = await Promise.all([
      supabase.from('mlux_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
      supabase
        .from('patient_profiles')
        .select(
          'first_name, location_city, location_country, chronotype_q3, current_supplements, current_medications'
        )
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('tiptraq_nights')
        .select('id', { count: 'exact', head: true })
        .eq('patient_id', user.id),
    ])

    const hasTipTraqData = (nightsCount ?? 0) > 0
    const profileRow = (mluxProfile as MLuxProfileRow | null) ?? null
    const fallbackSleepTime = patient?.chronotype_q3 ?? '11:00pm'
    const currentSupplements = (patient?.current_supplements as string[] | null) ?? []

    const extractedSupplements = extractSupplementsFromMessage(message)
    const extractedMedications = extractMedicationsFromMessage(message)
    const mergedSupplements = mergeSupplementLists(currentSupplements, extractedSupplements)

    if (
      extractedSupplements.length > 0 &&
      mergedSupplements.join('|') !== currentSupplements.join('|')
    ) {
      const { error: saveError } = await supabase
        .from('patient_profiles')
        .update({ current_supplements: mergedSupplements })
        .eq('id', user.id)

      if (saveError) {
        console.error('[timebot] current_supplements update failed', saveError.message)
        return NextResponse.json(
          { error: 'Could not save supplements to your profile. Try again.' },
          { status: 500 }
        )
      }
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
      fallbackSleepTime,
      currentSupplements: mergedSupplements,
    })

    const { minutes: phaseMinutes, estimated } = resolveTimebotPhaseMinutes(
      profileRow,
      fallbackSleepTime
    )

    const supplementContext = buildSupplementContextBlock({
      currentSupplements: mergedSupplements,
      newlyExtracted: extractedSupplements,
      extractedMedications,
      phaseMinutes,
      phaseTimeLabel: formatMinutesLabel(phaseMinutes),
      estimated,
    })

    const context = buildTimebotContext(profileRow, schedule, supplementContext)
    const isFirstTimeUser = schedule.precisionLabel === 'ESTIMATED'

    const anthropic = createAnthropicClient()

    const response = await anthropic.messages.create({
      model: TIMEBOT_MODEL,
      max_tokens: 500,
      system: buildTimebotSystemPrompt(isFirstTimeUser),
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
      return NextResponse.json({ error: 'Vaya returned an empty response. Try again.' }, { status: 502 })
    }

    return NextResponse.json({
      answer,
      supplementsSaved: extractedSupplements.length > 0 ? mergedSupplements : undefined,
    })
  } catch (error) {
    const mapped = mapAnthropicError(error)
    if (mapped) {
      return NextResponse.json({ error: mapped.replace('Report extraction', 'Vaya') }, { status: 502 })
    }
    return NextResponse.json({ error: 'Could not reach Vaya. Please try again.' }, { status: 500 })
  }
}
