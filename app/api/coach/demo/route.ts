import { NextResponse } from 'next/server'

import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'
import { buildSeanDemoCoachContext } from '@/lib/coach/sean-demo-context'
import { createAnthropicClient, mapAnthropicError } from '@/lib/tiptraq/anthropic-client'

const DEMO_MODEL = 'claude-sonnet-4-6'

const DEMO_SYSTEM = `You are ${COACH_DISPLAY_NAME} — the DIOS Dose Intelligence Agent for patients.

DIOS COPY RULES (mandatory):
- Plain English only — no pharmacological jargon. Use everyday names: blood pressure tablet, bone tablet, thyroid tablet, statin, D3, calcium.
- Maximum 3 sentences per response.
- No exclamation marks.
- Warm, calm, BBC-science-presenter tone — never alarmist.
- Never diagnose or change prescriptions. Encourage discussing changes with their GP when needed.

You are answering questions in the Sean James public demo. Use the patient context provided.`

export async function POST(request: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY?.trim()) {
      return NextResponse.json(
        {
          error: `${COACH_DISPLAY_NAME} demo is not configured on this server.`,
        },
        { status: 503 }
      )
    }

    const body = (await request.json()) as { message?: string }
    const message = body.message?.trim()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const context = buildSeanDemoCoachContext()
    const anthropic = createAnthropicClient()

    const response = await anthropic.messages.create({
      model: DEMO_MODEL,
      max_tokens: 400,
      system: DEMO_SYSTEM,
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
      return NextResponse.json(
        { error: `${COACH_DISPLAY_NAME} returned an empty response.` },
        { status: 502 }
      )
    }

    return NextResponse.json({ answer })
  } catch (error) {
    const mapped = mapAnthropicError(error)
    if (mapped) {
      return NextResponse.json({ error: mapped }, { status: 502 })
    }
    return NextResponse.json(
      { error: `Could not reach ${COACH_DISPLAY_NAME}. Please try again.` },
      { status: 500 }
    )
  }
}
