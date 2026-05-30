import type { AuthError } from '@supabase/supabase-js'

export const SIGN_UP_EMAIL_EXISTS_MESSAGE =
  'An account with this email already exists.'

export function mapSignUpError(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (error.status === 429 || message.includes('rate') || message.includes('too many')) {
    return 'Too many attempts. Wait 60 seconds.'
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return SIGN_UP_EMAIL_EXISTS_MESSAGE
  }

  if (message.includes('password')) {
    return 'Password must be at least 8 characters.'
  }

  return 'Something went wrong. Please try again.'
}
