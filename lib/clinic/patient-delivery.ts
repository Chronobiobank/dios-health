import type { PatientDeliveryProfile } from '@/lib/shop/types'
import { getCohortTriagePatient } from '@/lib/clinic/cohort-triage-patients'

/** Demo delivery addresses for cohort triage patients. */
const DEMO_DELIVERY: Record<string, PatientDeliveryProfile> = {
  'sean-001': {
    line1: '14 Ponsonby Road',
    line2: 'Freemans Bay',
    city: 'Auckland',
    postcode: '1011',
    country: 'New Zealand',
  },
  'demo-patient-red': {
    line1: 'Rua Augusta 1200',
    city: 'São Paulo',
    postcode: '01305-100',
    country: 'Brazil',
  },
  'demo-patient-amber': {
    line1: '42 Harley Street',
    city: 'London',
    postcode: 'W1G 9PP',
    country: 'United Kingdom',
  },
}

export function deliveryForCohortPatient(patientId: string): PatientDeliveryProfile | null {
  const patient = getCohortTriagePatient(patientId)
  if (!patient) return null
  return (
    DEMO_DELIVERY[patientId] ?? {
      line1: 'Address on file pending',
      city: '—',
      postcode: '—',
      country: '—',
    }
  )
}
