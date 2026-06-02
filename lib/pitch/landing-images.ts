/** Calm UI landing visuals — paths under /public/pitch */

/** Swap .svg → .jpg in this file when AI assets are added under public/pitch/ */
export const PITCH_IMAGES = {
  hook: '/pitch/hook.svg',
  problem: {
    hygia: '/pitch/problem-hygia.svg',
    'biobank-mortality': '/pitch/problem-light.svg',
    'biobank-t2dm': '/pitch/problem-metabolic.svg',
    elliott: '/pitch/problem-safety.svg',
  },
  biomarker: '/pitch/biomarker.svg',
  spectrum: '/pitch/spectrum.svg',
  steps: {
    mel: '/pitch/step-mel.svg',
    camera: '/pitch/step-camera.svg',
    protocol: '/pitch/step-protocol.svg',
  },
  sides: {
    Patients: '/pitch/side-patients.svg',
    Clinicians: '/pitch/side-clinicians.svg',
    NHS: '/pitch/side-nhs.svg',
    Pharma: '/pitch/side-pharma.svg',
  },
  model: '/pitch/model.svg',
} as const
