export function getTimeGreeting(date = new Date()): 'morning' | 'afternoon' | 'evening' {
  const hour = date.getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

function normalizeCountry(country?: string | null): string {
  return country?.trim().toLowerCase() ?? ''
}

function isNewZealand(locationCity?: string | null, locationCountry?: string | null): boolean {
  const country = normalizeCountry(locationCountry)
  if (country === 'new zealand' || country === 'nz' || country === 'aotearoa') return true

  const city = locationCity?.trim().toLowerCase() ?? ''
  return (
    city.includes('auckland') ||
    city.includes('wellington') ||
    city.includes('christchurch') ||
    city.includes('hamilton') ||
    city.includes('dunedin')
  )
}

/** Patient dashboard salutation from profile location — e.g. Kia ora in Aotearoa, Hello elsewhere. */
export function getLocalizedPatientGreeting(
  firstName: string,
  locationCity?: string | null,
  locationCountry?: string | null
): string {
  if (isNewZealand(locationCity, locationCountry)) {
    return `Kia ora, ${firstName}.`
  }

  return `Hello, ${firstName}.`
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || 'there'
}

export function getPatientFirstName(options: {
  firstName?: string | null
  fullName?: string | null
}): string {
  const direct = options.firstName?.trim()
  if (direct) return direct
  return getFirstName(options.fullName ?? 'Patient')
}
