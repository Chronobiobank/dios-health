import Anthropic from '@anthropic-ai/sdk'

const EXTRACTION_MODEL = 'claude-sonnet-4-6'

export function getAnthropicApiKey(): string | undefined {
  return process.env.ANTHROPIC_API_KEY?.trim() || undefined
}

export function createAnthropicClient(): Anthropic {
  const apiKey = getAnthropicApiKey()
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  return new Anthropic({ apiKey })
}

export const TIPTRAQ_EXTRACTION_MODEL = EXTRACTION_MODEL

export const TIPTRAQ_EXTRACTION_PROMPT = `You are extracting structured data from a PranaQ TipTraQ nightly sleep report PDF.

Extract the following values exactly as they appear. If a value is not present return null.

Return ONLY valid JSON. No preamble. No markdown. No explanation. No code blocks.

{
  "patient_name": string,
  "report_date": "YYYY-MM-DD",
  "recording_start": "HH:MM",
  "recording_end": "HH:MM",
  "trt_minutes": number,
  "signal_quality_pct": number,
  "sleep_onset": "HH:MM",
  "sleep_offset": "HH:MM",
  "sleep_latency_minutes": number,
  "tst_minutes": number,
  "waso_minutes": number,
  "sleep_efficiency_pct": number,
  "rem_duration_minutes": number,
  "rem_pct_tst": number,
  "nrem_duration_minutes": number,
  "first_rem_onset": "HH:MM or null",
  "ahi": number,
  "ahi_severity": string,
  "rdi": number,
  "odi_3pct": number,
  "odi_4pct": number,
  "t90_pct": number,
  "min_spo2": number,
  "mean_spo2": number,
  "hypoxic_burden": number,
  "event_count": number,
  "mean_pr": number,
  "min_pr": number,
  "max_pr": number,
  "sns_pct": number,
  "pns_pct": number,
  "snoring_minutes": number,
  "algorithm_version": string
}

Important notes:
- Sleep onset is when sleep actually starts, not recording start
- first_rem_onset is the clock time of first REM epoch
- If REM onset cannot be determined from the report return null
- sns_pct and pns_pct should sum to 100
- All times in 24h format HH:MM with leading zeros (e.g. 09:05)
- All numeric fields must be JSON numbers, not strings
- waso_minutes: convert hours and minutes to total minutes`

export function mapAnthropicError(error: unknown): string | null {
  if (error instanceof Anthropic.APIError) {
    if (error.status === 401) {
      return 'Report extraction API key is invalid. Update ANTHROPIC_API_KEY in Vercel environment variables.'
    }
    if (error.status === 404) {
      return 'Report extraction model is unavailable. Contact support.'
    }
    if (error.status === 413 || error.status === 400) {
      return 'This PDF could not be processed. Try a smaller file or re-export from TipTraQ.'
    }
    if (error.status === 429) {
      return 'Report extraction is busy. Wait a minute and try again.'
    }
    if (error.status === 529) {
      return 'Report extraction is temporarily overloaded. Try again shortly.'
    }
    return `Report extraction failed (${error.status}). Please try again.`
  }

  if (error instanceof Error) {
    if (error.message === 'ANTHROPIC_API_KEY is not configured') {
      return 'Report extraction is not configured on the server. Please try again later or contact support.'
    }
    if (error.message === 'AI returned an empty extraction response') {
      return 'Could not read this TipTraQ report. Check the PDF and try again.'
    }
    if (error.message.includes('authentication') || error.message.includes('invalid x-api-key')) {
      return 'Report extraction API key is invalid. Update ANTHROPIC_API_KEY in Vercel environment variables.'
    }
  }

  return null
}

export async function extractTipTraQFromPdf(base64PDF: string): Promise<{ rawText: string }> {
  const anthropic = createAnthropicClient()

  const message = await anthropic.messages.create({
    model: EXTRACTION_MODEL,
    max_tokens: 1500,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'document',
            source: {
              type: 'base64',
              media_type: 'application/pdf',
              data: base64PDF,
            },
          },
          {
            type: 'text',
            text: TIPTRAQ_EXTRACTION_PROMPT,
          },
        ],
      },
    ],
  })

  const rawText = message.content
    .filter((block) => block.type === 'text')
    .map((block) => (block as { type: 'text'; text: string }).text)
    .join('')

  if (!rawText.trim()) {
    throw new Error('AI returned an empty extraction response')
  }

  return { rawText }
}
