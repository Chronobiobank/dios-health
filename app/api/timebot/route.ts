import { NextResponse } from 'next/server'

import type { DlmoProfileRow } from '@/lib/dashboard/dlmo-profile'
import { buildTimebotContext, buildTimebotData } from '@/lib/dashboard/timebot-data'
import {
  buildSupplementContextBlock,
  buildTimebotSystemPrompt,
  extractMedicationsFromMessage,
  extractSupplementsFromMessage,
  mergeSupplementLists,
  resolveTimebotDlmoMinutes,
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

    const body = (await request.json()) as { message?: string }
    const message = body.message?.trim()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const [{ data: dlmoProfile }, { data: patient }, { count: nightsCount }] = await Promise.all([
      supabase.from('dlmo_profiles').select('*').eq('patient_id', user.id).maybeSingle(),
      supabase
        .from('patient_profiles')
        .select('first_name, location_city, location_country, chronotype_q3, current_supplements')
        .eq('id', user.id)
        .maybeSingle(),
      supabase
        .from('tiptraq_nights')
        .select('id', { count: 'exact', head: true })
        .eq('patient_id', user.id),
    ])

    const hasTipTraqData = (nightsCount ?? 0) > 0
    const profileRow = (dlmoProfile as DlmoProfileRow | null) ?? null
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

    const { minutes: dlmoMinutes, estimated } = resolveTimebotDlmoMinutes(
      profileRow,
      fallbackSleepTime
    )

    const supplementContext = buildSupplementContextBlock({
      currentSupplements: mergedSupplements,
      newlyExtracted: extractedSupplements,
      extractedMedications,
      dlmoMinutes,
      dlmoTimeLabel: formatMinutesLabel(dlmoMinutes),
      estimated,
    })

    const context = buildTimebotContext(profileRow, schedule, supplementContext)
    const isFirstTimeUser = !hasTipTraqData || schedule.dlmoEstimated

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
      return NextResponse.json({ error: 'Timebot returned an empty response. Try again.' }, { status: 502 })
    }

    return NextResponse.json({
      answer,
      supplementsSaved: extractedSupplements.length > 0 ? mergedSupplements : undefined,
    })
  } catch (error) {
    const mapped = mapAnthropicError(error)
    if (mapped) {
      return NextResponse.json({ error: mapped.replace('Report extraction', 'Timebot') }, { status: 502 })
    }
    return NextResponse.json({ error: 'Could not reach Timebot. Please try again.' }, { status: 500 })
  }
}
