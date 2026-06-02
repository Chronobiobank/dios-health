/** Calm UI landing visuals — assets under /public/pitch and /public video */

export const PITCH_HERO = {
  /** NHS medicines waste — matches hook copy */
  video: '/pills.mp4',
  poster: '/pitch/hook.jpg',
} as const

export const PITCH_IMAGES = {
  hook: '/pitch/hook.jpg',
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
    mel: '/pitch/step-mel.jpg',
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
} as const
