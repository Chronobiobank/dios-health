import {
  DIOS_CLINICIANS_CLINICS_PATH,
  DIOS_CLINICIANS_DEMO_PATH,
  DIOS_CLINICIANS_EVIDENCE_PATH,
  DIOS_CLINICIANS_PATH,
  DIOS_CLINICIANS_PILOT_PATH,
} from '@/lib/secopeutic/site'

import type { MobileNavLink } from '@/lib/auth/mobile-nav-links'

/** Clinicians marketing site — all routes in the off-canvas menu. */
export const SECOPEUTIC_CLINICIANS_NAV_LINKS: MobileNavLink[] = [
  { label: 'Clinicians home', href: DIOS_CLINICIANS_PATH },
  { label: 'Monitoring demo', href: DIOS_CLINICIANS_DEMO_PATH },
  { label: 'Evidence library', href: DIOS_CLINICIANS_EVIDENCE_PATH },
  { label: 'Certified clinics', href: DIOS_CLINICIANS_CLINICS_PATH },
  { label: 'Claim pilot', href: DIOS_CLINICIANS_PILOT_PATH, cta: true },
]
