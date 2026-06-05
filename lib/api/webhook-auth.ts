import { timingSafeEqual } from 'crypto'

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

export function verifyWebhookSecret(request: Request, envVarName: string): boolean {
  const expected = process.env[envVarName]
  if (!expected) return false

  const header =
    request.headers.get('x-webhook-secret') ??
    request.headers.get('x-dios-webhook-secret') ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    ''

  return safeEqual(header, expected)
}
