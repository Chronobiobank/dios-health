export const REGISTRATION_BODIES = [
  { value: 'GMC', label: 'GMC (UK)' },
  { value: 'MCNZ', label: 'MCNZ (New Zealand)' },
  { value: 'AHPRA', label: 'AHPRA (Australia)' },
  { value: 'OTHER', label: 'Other' },
] as const

export type RegistrationBody = (typeof REGISTRATION_BODIES)[number]['value']
