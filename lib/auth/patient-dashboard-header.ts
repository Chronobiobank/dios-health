import { getLocalizedPatientGreeting, getPatientFirstName } from '@/lib/auth/greeting'

export type PatientDashboardHeaderProps = {
  fullName: string
  avatarUrl?: string | null
  greeting: string
  subtitle: string
}

export function buildPatientDashboardHeader(input: {
  profile: { full_name?: string | null; avatar_url?: string | null }
  patient: {
    first_name?: string | null
    location_city?: string | null
    location_country?: string | null
  }
  subtitle: string
}): PatientDashboardHeaderProps {
  const firstName = getPatientFirstName({
    firstName: input.patient.first_name,
    fullName: input.profile.full_name,
  })

  return {
    fullName: input.profile.full_name ?? firstName,
    avatarUrl: input.profile.avatar_url,
    greeting: getLocalizedPatientGreeting(
      firstName,
      input.patient.location_city,
      input.patient.location_country
    ),
    subtitle: input.subtitle,
  }
}
