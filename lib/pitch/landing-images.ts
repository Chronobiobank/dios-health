/** Calm UI landing visuals — assets under /public/pitch and /public video */

export const PITCH_IMAGES = {
  hook: '/your-eye-scan.avif',
  evidence: '/evidence.jpg',
  outcomes: {
    waste: '/Medicines-waste.jpeg',
    cardiovascular: '/Cardiovascular-prevention.jpg',
    metabolic: '/metabolic-risk.jpg',
    safety: '/medicines-safety.jpg',
  },
  problem: {
    hygia: '/pitch/problem-hygia.jpg',
    'biobank-mortality': '/pitch/problem-light.jpg',
    'biobank-t2dm': '/pitch/problem-metabolic.jpg',
    elliott: '/pitch/problem-safety.jpg',
  },
  biomarker: {
    uk: '/pitch/biomarker-uk.jpg',
    hours: '/pitch/biomarker-hours.jpg',
    cie: '/pitch/biomarker-cie.jpg',
    mlux: '/pitch/biomarker-mlux.jpg',
  },
  spectrum: '/pitch/spectrum.jpg',
  steps: {
    dina: '/pitch/step-mel.jpg',
    camera: '/pitch/step-camera.jpg',
    protocol: '/pitch/step-protocol.jpg',
  },
  sides: {
    Patients: '/pitch/side-patients.jpg',
    Clinicians: '/pitch/side-clinicians.jpg',
    NHS: '/pitch/side-nhs.jpg',
    Pharma: '/pitch/side-pharma.jpg',
  },
  model: '/pitch/model.jpg',
  governance: {
    regulatory: '/governance-regulatory.jpeg',
    consentFirewall: '/consent-firewall.jpg',
  },
  /** Dose Intelligence deck — section tiles */
  retinomic: {
    howWeThink: '/how-we-think.webp',
    lightDose: '/your-light-dose.jpg',
    eyeScan: '/your-eye-scan.avif',
    bloodFuel: '/city-labs-panel.jpg',
    sleepCheck: '/your-sleep-check.jpg',
  },
} as const

export const PITCH_HERO = {
  poster: '/standardised.jpg',
  /** @deprecated Hero uses still image only — was first-light.mp4 */
  video: '/first-light.mp4',
} as const
