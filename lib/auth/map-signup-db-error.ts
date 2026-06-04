/** Maps Supabase / Postgres errors to user-facing signup messages. */
export function mapSignupDbError(message: string): string {
  const lower = message.toLowerCase()

  if (
    lower.includes('complete_patient_chronoprofile') ||
    lower.includes('complete_patient_signup') ||
    lower.includes('could not find the function')
  ) {
    return (
      'Database setup incomplete. In Supabase → SQL Editor, run the file ' +
      'supabase/run-patient-dashboard-setup.sql (in this project), then try again.'
    )
  }

  if (lower.includes('save_patient_demographics') || lower.includes('schema cache')) {
    return 'Database schema is out of date. Run supabase/run-patient-dashboard-setup.sql in Supabase SQL Editor, then try again.'
  }

  if (lower.includes('column') && lower.includes('does not exist')) {
    return (
      'A database column is missing. Run supabase/run-patient-dashboard-setup.sql in Supabase SQL Editor, then try again.'
    )
  }

  if (lower.includes('date_of_birth')) {
    return 'Date of birth column is missing. Run supabase/run-patient-dashboard-setup.sql in Supabase SQL Editor, then try again.'
  }

  if (lower.includes('row-level security') || lower.includes('policy')) {
    return 'Could not save your profile. Sign out, sign in again, or contact support.'
  }

  if (lower.includes('not authenticated')) {
    return 'Session expired. Sign in and try again.'
  }

  return message || 'Could not save your account. Please try again.'
}
