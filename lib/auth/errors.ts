import type { AuthError } from '@supabase/supabase-js'

export function mapSignInError(error: AuthError): string {
  const message = error.message.toLowerCase()

  if (error.status === 429 || message.includes('rate') || message.includes('too many')) {
    return 'Too many attempts. Wait 60 seconds.'
  }

  if (message.includes('email not confirmed') || message.includes('confirm your email')) {
    return 'Confirm your email first — check your inbox and spam, then try again.'
  }

  if (message.includes('user not found') || message.includes('no user found')) {
    return 'No account for this email. Create one at Sign up → Patient.'
  }

  if (
    message.includes('invalid login credentials') ||
    message.includes('invalid email or password')
  ) {
    return 'Wrong email or password. Try again or reset your password.'
  }

  if (error.status === 400) {
    return error.message || 'Sign-in failed. Check your email and password.'
  }

  return 'Sign-in failed. Try again or use Forgot password.'
}
