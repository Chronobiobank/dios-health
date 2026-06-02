import { DEMO_CLINIC_PATIENTS, type DemoClinicPatient } from '@/lib/clinic/demo-patients'

export type DemoPatientInsight = {
  drugName: string
  headline: string
  body: string
  standardGuidance: string
  diosRecommendation: string
  confidenceScore: number | null
  urgency: number
}

export type DemoPatientTwin = DemoClinicPatient & {
  fitzpatrickType: number
  medications: string[]
  lastDataSync: string
  insights: DemoPatientInsight[]
  streams: {
    tiptraq: boolean
    cityLabs: string
    siloton: boolean
    smartphone: boolean
  }
  bodyClockSummary: {
    chronotype: string
    msfsc: string
    nonDipper: 'yes' | 'no' | 'unknown'
    confidenceBand: string
  }
}

const TWIN_DETAILS: Record<string, Omit<DemoPatientTwin, keyof DemoClinicPatient>> = {
  'demo-margaret-t': {
    fitzpatrickType: 2,
    medications: ['Ramipril 5mg', 'Amlodipine 5mg', 'Atorvastatin 20mg'],
    lastDataSync: '2 hours ago',
    insights: [
      {
        drugName: 'Ramipril 5mg',
        headline: 'Blood pressure not dipping overnight',
        body: 'Non-dipper confirmed on 6 of 7 nights. Bedtime dosing indicated.',
        standardGuidance: 'Morning dose',
        diosRecommendation: 'Bedtime dose (22:00)',
        confidenceScore: 87,
        urgency: 1,
      },
    ],
    streams: {
      tiptraq: true,
      cityLabs: 'Results current',
      siloton: false,
      smartphone: true,
    },
    bodyClockSummary: {
      chronotype: 'Night owl',
      msfsc: '04:42 (+1.2h vs population)',
      nonDipper: 'yes',
      confidenceBand: 'High · wearable-backed',
    },
  },
  'demo-james-o': {
    fitzpatrickType: 3,
    medications: ['Simvastatin 20mg', 'Metformin 500mg'],
    lastDataSync: '45 minutes ago',
    insights: [
      {
        drugName: 'Simvastatin 20mg',
        headline: 'Statin taken before liver activity peaks',
        body: 'Morning dose misses midnight cholesterol synthesis window.',
        standardGuidance: 'Morning dose',
        diosRecommendation: 'Evening dose (21:30)',
        confidenceScore: 92,
        urgency: 2,
      },
    ],
    streams: {
      tiptraq: true,
      cityLabs: 'Results current',
      siloton: false,
      smartphone: true,
    },
    bodyClockSummary: {
      chronotype: 'Standard',
      msfsc: '03:18 (population aligned)',
      nonDipper: 'no',
      confidenceBand: 'High · wearable-backed',
    },
  },
  'demo-priya-n': {
    fitzpatrickType: 4,
    medications: ['Prednisolone 5mg', 'Ramipril 2.5mg'],
    lastDataSync: '18 hours ago',
    insights: [
      {
        drugName: 'Prednisolone 5mg',
        headline: 'Blood panel needed before timing confirmed',
        body: 'Vitamin D result missing. Cannot confirm entrainment capacity.',
        standardGuidance: 'Morning dose',
        diosRecommendation: 'Pending blood panel',
        confidenceScore: null,
        urgency: 3,
      },
    ],
    streams: {
      tiptraq: false,
      cityLabs: 'Results pending',
      siloton: false,
      smartphone: false,
    },
    bodyClockSummary: {
      chronotype: 'Unknown',
      msfsc: 'Pending City Labs panel',
      nonDipper: 'unknown',
      confidenceBand: 'Low · awaiting bloods',
    },
  },
  'demo-david-k': {
    fitzpatrickType: 3,
    medications: ['Simvastatin 10mg', 'Aspirin 75mg'],
    lastDataSync: '1 hour ago',
    insights: [
      {
        drugName: 'Simvastatin 10mg',
        headline: 'Current timing matches body clock',
        body: 'Evening dose already aligned with liver activity window.',
        standardGuidance: 'Evening dose',
        diosRecommendation: 'Continue 21:00 dose',
        confidenceScore: 89,
        urgency: 4,
      },
    ],
    streams: {
      tiptraq: true,
      cityLabs: 'Results current',
      siloton: true,
      smartphone: true,
    },
    bodyClockSummary: {
      chronotype: 'Standard',
      msfsc: '03:24 (population aligned)',
      nonDipper: 'no',
      confidenceBand: 'High · stable drift index',
    },
  },
  'demo-sarah-b': {
    fitzpatrickType: 2,
    medications: ['Metformin 500mg', 'Ramipril 2.5mg'],
    lastDataSync: '6 hours ago',
    insights: [
      {
        drugName: 'Metformin 500mg',
        headline: 'Morning light critically low — T2DM risk elevated',
        body: 'MLux 54 m-EDI for 11 consecutive days. Light protocol indicated before dose timing review.',
        standardGuidance: 'Standard metformin timing',
        diosRecommendation: '30 min outdoor light before 09:00 daily',
        confidenceScore: 54,
        urgency: 1,
      },
    ],
    streams: {
      tiptraq: false,
      cityLabs: 'Not ordered',
      siloton: false,
      smartphone: true,
    },
    bodyClockSummary: {
      chronotype: 'Evening type',
      msfsc: '05:18 (+2.1h vs population)',
      nonDipper: 'unknown',
      confidenceBand: 'Low · Mel estimated only',
    },
  },
}

export function getDemoPatientTwin(id: string): DemoPatientTwin | null {
  const base = DEMO_CLINIC_PATIENTS.find((patient) => patient.id === id)
  const details = TWIN_DETAILS[id]
  if (!base || !details) return null

  return { ...base, ...details }
}

export function getSortedInsights(patient: DemoPatientTwin): DemoPatientInsight[] {
  return [...patient.insights].sort((a, b) => a.urgency - b.urgency)
}
