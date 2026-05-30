export const COUNTRIES = [
  'Australia',
  'Canada',
  'Ireland',
  'New Zealand',
  'Singapore',
  'United Kingdom',
  'United States',
  'Other',
] as const

const LOCALE_COUNTRY: Record<string, string> = {
  AU: 'Australia',
  CA: 'Canada',
  GB: 'United Kingdom',
  IE: 'Ireland',
  NZ: 'New Zealand',
  SG: 'Singapore',
  US: 'United States',
}

export function guessCountryFromLocale(): string {
  if (typeof navigator === 'undefined') return 'United Kingdom'

  const locale = navigator.language || 'en-GB'
  const region = locale.split('-')[1]?.toUpperCase()
  if (region && LOCALE_COUNTRY[region]) {
    return LOCALE_COUNTRY[region]
  }

  return 'United Kingdom'
}
