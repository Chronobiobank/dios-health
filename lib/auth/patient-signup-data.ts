function formatTimeLabel(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'pm' : 'am'
  const displayHour = hours % 12 === 0 ? 12 : hours % 12
  const paddedMinutes = minutes.toString().padStart(2, '0')
  return `${displayHour}:${paddedMinutes}${period}`
}

function buildRange(startHour: number, endHour: number): string[] {
  const slots: string[] = []

  for (let hour = startHour; hour <= endHour; hour += 1) {
    for (const minutes of [0, 15, 30, 45]) {
      if (hour === endHour && minutes > 0) break
      slots.push(formatTimeLabel(hour, minutes))
    }
  }

  return slots
}

/** 4am – 12pm, 15-minute intervals */
export const WAKE_TIME_OPTIONS = buildRange(4, 12)

/** 8pm – 3am next day, 15-minute intervals */
export const SLEEP_TIME_OPTIONS = [
  ...buildRange(20, 23),
  ...buildRange(0, 3),
]

export const ALERTNESS_OPTIONS = [
  { value: 'morning', label: 'Morning (before 10am)' },
  { value: 'midday', label: 'Midday (10am–2pm)' },
  { value: 'evening', label: 'Evening (after 6pm)' },
] as const

export const FITZPATRICK_TYPES = [
  { value: 1, label: 'Very fair', swatch: 'pale ivory', color: '#FDEBD0' },
  { value: 2, label: 'Fair', swatch: 'beige', color: '#F5D5B8' },
  { value: 3, label: 'Medium', swatch: 'warm beige/olive', color: '#E8C4A0' },
  { value: 4, label: 'Olive', swatch: 'moderate brown', color: '#C68642' },
  { value: 5, label: 'Brown', swatch: 'dark brown', color: '#8D5524' },
  { value: 6, label: 'Deep', swatch: 'very dark brown/black', color: '#3B2211' },
] as const

export const SHIFT_PATTERNS = [
  'Fixed night',
  'Rotating',
  'Early morning',
  'Other',
] as const

export const BIOLOGICAL_SEX_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'intersex', label: 'Intersex' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
] as const

export const WEARABLE_OPTIONS = [
  {
    id: 'tiptraq',
    name: 'TipTraQ',
    body: 'Three nights every six months — high-confidence DLMO calibration, like polysomnography. Sets your dose windows until the next block.',
    cta: 'Connect TipTraQ',
    recommended: true,
  },
  {
    id: 'apple_health',
    name: 'Apple Health',
    body: 'Sleep and activity data from your iPhone or Apple Watch.',
    cta: 'Connect Apple Health',
    recommended: false,
  },
  {
    id: 'google_fit',
    name: 'Google Fit',
    body: 'Sleep and activity data from your Android device.',
    cta: 'Connect Google Fit',
    recommended: false,
  },
] as const
