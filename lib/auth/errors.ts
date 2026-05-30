import type { AuthError } from '@supabase/supabase-js'

export function mapSignInError(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (error.status === 429 || message.includes('rate') || message.includes('too many')) {
    return 'Too many attempts. Wait 60 seconds.'
  }

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password') ||
    error.status === 400
  ) {
    return 'Wrong email or password. Try again.'
  }

  return 'Wrong email or password. Try again.'
}
