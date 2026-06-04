export const AUTH_ROUTES = {
  signIn: '/signin',
  forgotPassword: '/signin/forgot-password',
  resetPassword: '/signin/reset-password',
  /** Patient account creation (email + password). */
  signUp: '/signup/patient',
  signUpPatient: '/signup/patient',
  /** Demographics wizard — builds chronoprofile before dashboard. */
  patientChronoprofile: '/signup/patient/chronoprofile',
  signUpClinician: '/signup/clinician',
  pendingVerification: '/pending-verification',
} as const

export const PATIENT_ROUTES = {
  dashboard: '/dashboard',
  coach: '/dashboard/coach',
  /** @deprecated Use {@link PATIENT_ROUTES.coach}. */
  mel: '/dashboard/coach',
  /** @deprecated Use {@link PATIENT_ROUTES.coach}. */
  timebot: '/dashboard/coach',
  insights: '/dashboard/insights',
  streams: '/dashboard/streams',
  streamsBloods: '/dashboard/streams/bloods',
  dataControls: '/dashboard/data-controls',
  profile: '/dashboard/profile',
  report: '/dashboard/report',
} as const

export const CLINIC_ROUTES = {
  panel: '/clinic',
  patients: '/clinic/patients',
  settings: '/clinic/settings',
  patient: (id: string) => `/clinic/patients/${id}`,
  consult: (id: string) => `/clinic/patients/${id}/consult`,
} as const

export const PROTECTED_PREFIXES = ['/dashboard', '/clinic', '/pending-verification'] as const

export const PUBLIC_AUTH_PREFIXES = ['/signin', '/signup'] as const
