export const AUTH_ROUTES = {
  signIn: '/signin',
  /** Retinomic sign-in (preferred). */
  authSignIn: '/auth/signin',
  forgotPassword: '/signin/forgot-password',
  resetPassword: '/signin/reset-password',
  /** Patient account creation (email + password). */
  signUp: '/auth/signup',
  signUpPatient: '/auth/signup',
  authSignUp: '/auth/signup',
  /** Legacy path — redirects to authSignUp */
  legacySignUpPatient: '/signup/patient',
  /** Demographics wizard — builds chronoprofile before dashboard. */
  patientChronoprofile: '/signup/patient/chronoprofile',
  signUpClinician: '/signup/clinician',
  pendingVerification: '/pending-verification',
} as const

export const PATIENT_ROUTES = {
  dashboard: '/dashboard',
  firstLight: '/dashboard/first-light',
  firstLightComplete: '/dashboard/first-light/complete',
  premium: '/dashboard/premium',
  coach: '/dashboard/coach',
  /** @deprecated Legacy alias — same as {@link PATIENT_ROUTES.coach}. Kept for old URLs only. */
  mel: '/dashboard/coach',
  /** @deprecated Legacy alias — same as {@link PATIENT_ROUTES.coach}. Kept for old URLs only. */
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
  order: (patientId: string) => `/clinic/order/${patientId}`,
} as const

export const SHOP_ROUTES = {
  catalog: '/shop',
  product: (slug: string) => `/shop/${slug}`,
  success: '/shop/success',
} as const

/** Protocol-driven fulfillment — labs, assessments, protocol supplements */
export const FULFILLMENT_ROUTES = {
  patientOrders: '/dashboard/orders',
  clinicOrders: '/clinic/orders',
  clinicPatientOrder: (patientId: string) => `/clinic/order/${patientId}`,
} as const

export const PROTECTED_PREFIXES = ['/dashboard', '/clinic', '/shop', '/pending-verification'] as const

export const PUBLIC_AUTH_PREFIXES = ['/signin', '/signup', '/auth'] as const
