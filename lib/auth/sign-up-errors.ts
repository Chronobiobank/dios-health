import type { AuthError } from '@supabase/supabase-js'

export function mapSignUpError(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (error.status === 429 || message.includes('rate') || message.includes('too many')) {
    return 'Too many attempts. Wait 60 seconds.'
  }

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'An account with this email already exists. Sign in instead.'
  }

  if (message.includes('password')) {
    return 'Password must be at least 8 characters.'
  }

  return 'Something went wrong. Please try again.'
}
