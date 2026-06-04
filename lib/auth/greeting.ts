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

/** Casual dashboard salutation — e.g. Hey Alex */
export function getPatientDashboardGreeting(firstName: string): string {
  return `Hey ${firstName}`
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

/** Salutation for DIOS Coach speech bubble — same locale rules, exclamation for warmth. */
export function getLocalizedPatientGreetingBubble(
  firstName: string,
  locationCity?: string | null,
  locationCountry?: string | null
): string {
  return getLocalizedPatientGreeting(firstName, locationCity, locationCountry).replace(/\.$/, '!')
}

/** Full DIOS Coach intro — shown in the chatbot speech bubble on first load. */
export function getCoachIntroMessage(
  firstName: string,
  locationCity?: string | null,
  locationCountry?: string | null
): string {
  const salutation = getLocalizedSalutation(locationCity, locationCountry)
  return `${salutation} ${firstName}, I'm DIOS Coach — tell me what pills you take and I'll tailor a plan that suits your body clock.`
}

/** Generic DIOS Coach intro for unauthenticated / marketing surfaces. */
export function getCoachIntroMessageGeneric(): string {
  return "Hello, I'm DIOS Coach — tell me what pills you take and I'll tailor a plan that suits your body clock."
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
