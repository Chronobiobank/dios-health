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

function getLocalizedSalutation(
  locationCity?: string | null,
  locationCountry?: string | null
): string {
  return isNewZealand(locationCity, locationCountry) ? 'Kia ora' : 'Hello'
}

/** Salutation for Vaya speech bubble — same locale rules, exclamation for warmth. */
export function getLocalizedPatientGreetingBubble(
  firstName: string,
  locationCity?: string | null,
  locationCountry?: string | null
): string {
  return getLocalizedPatientGreeting(firstName, locationCity, locationCountry).replace(/\.$/, '!')
}

/** Full Vaya session intro — shown in the chatbot speech bubble on first load. */
export function getVayaIntroMessage(
  firstName: string,
  locationCity?: string | null,
  locationCountry?: string | null
): string {
  const salutation = getLocalizedSalutation(locationCity, locationCountry)
  return `${salutation} ${firstName}, I'm Vaya – tell me what pills you take and I'll tailor a plan that suits your body clock.`
}

/** Generic Vaya intro for unauthenticated / marketing surfaces. */
export function getVayaIntroMessageGeneric(): string {
  return "Hello, I'm Vaya – tell me what pills you take and I'll tailor a plan that suits your body clock."
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
