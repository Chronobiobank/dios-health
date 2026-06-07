import type { PatientDeliveryProfile } from '@/lib/shop/types'
import { getCohortTriagePatient } from '@/lib/clinic/cohort-triage-patients'

/** Demo delivery addresses for cohort triage patients. */
const DEMO_DELIVERY: Record<string, PatientDeliveryProfile> = {
  'sarah-mitchell': {
    line1: '18 Cavendish Square',
    city: 'London',
    postcode: 'W1G 0PP',
    country: 'United Kingdom',
  },
  'ngozi-eze': {
    line1: '24 Bishopsgate',
    city: 'London',
    postcode: 'EC2N 4AJ',
    country: 'United Kingdom',
  },
  'sean-001': {
    line1: '14 Ponsonby Road',
    line2: 'Freemans Bay',
    city: 'Auckland',
    postcode: '1011',
    country: 'New Zealand',
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
