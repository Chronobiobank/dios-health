/**
 * Image briefs — each must visually match the tile copy on the landing deck.
 * Filenames map 1:1 to public/pitch/*.jpg
 */

export const PITCH_TILE_BRIEFS = {
  'hero-poster': {
    file: 'hook.jpg',
    tileText: '£300M in wasted NHS medicines yearly. None of it fixes timing.',
    prompt:
      'Editorial photo concept: unused NHS prescription medicines in blister packs on dark surface, clock face showing wrong time, money waste metaphor, UK healthcare, cinematic dark background #080808 subtle amber #C9973A accent, no text no logos',
  },
  'problem-hygia': {
    file: 'problem-hygia.jpg',
    tileText: 'Bedtime antihypertensives cut major cardiovascular events.',
    prompt:
      'Bedside table at night: single blood pressure pill and glass of water, soft moonlight through window, cardiovascular health mood, dark cinematic medical editorial, amber accent, no text',
  },
  'problem-biobank-mortality': {
    file: 'problem-light.jpg',
    tileText: 'Brighter nights, darker days — higher mortality.',
    prompt:
      'Split composition: left side bright artificial light at night from wrist wearable glow, right side person in healthy bright daylight, contrast mortality risk, UK biobank study mood, dark edges amber accent, no text',
  },
  'problem-biobank-t2dm': {
    file: 'problem-metabolic.jpg',
    tileText: 'Light exposure predicts type 2 diabetes.',
    prompt:
      'Abstract: personal light sensor data waves flowing into glucose molecule and pancreas silhouette, type 2 diabetes prevention science, dark background teal and amber, no text no charts with labels',
  },
  'problem-elliott': {
    file: 'problem-safety.jpg',
    tileText: '237M medication errors in England yearly.',
    prompt:
      'Primary care pharmacy: two different prescription bottles nearly swapped, medication error prevention concept, NHS England primary care, serious but calm, dark editorial lighting amber accent, no text no numbers',
  },
  'biomarker-uk': {
    file: 'biomarker-uk.jpg',
    tileText: '89k — UK Biobank with light sensors',
    prompt:
      'UK Biobank study concept: wrist-worn light sensor device on arm in everyday outdoor UK light, large scale population research, 89000 participants mood, scientific minimal dark background, no text',
  },
  'biomarker-hours': {
    file: 'biomarker-hours.jpg',
    tileText: '13M — Hours of sensor data',
    prompt:
      'Visualization mood: endless stream of light sensor readings over time as glowing timeline, 13 million hours of data concept, dark background flowing light trails amber gold, no text no digits',
  },
  'biomarker-cie': {
    file: 'biomarker-cie.jpg',
    tileText: 'CIE S026 melanopic standard',
    prompt:
      'Scientific melanopic action spectrum curve glowing on dark screen, international photometry standard mood, precise spectral science blue amber purple gradient, laboratory aesthetic, no text no axis labels',
  },
  'biomarker-mlux': {
    file: 'biomarker-mlux.jpg',
    tileText: 'MLux — Smartphone-measurable biomarker',
    prompt:
      'Smartphone front camera measuring user face for melanopic lux circadian light, soft natural daylight on face, health tech selfie session, minimal UI glow, dark room amber accent, no text no app UI',
  },
  spectrum: {
    file: 'spectrum.jpg',
    tileText: 'Seven nodes. One circadian cascade.',
    prompt:
      'Infographic abstract: seven connected nodes in a horizontal cascade from sleep to cancer risk, circadian desynchrony spectrum, gradient bars purple amber blue on black, medical data viz aesthetic, no text no labels',
  },
  'step-mel': {
    file: 'step-mel.jpg',
    tileText: 'Mel — Measures melanopic lux, your clock signal.',
    prompt:
      'Glowing soft teal and gold spherical AI voice assistant orb floating on pure black, melanopic clock signal metaphor, premium health tech, minimal, no face no text',
  },
  'step-camera': {
    file: 'step-camera.jpg',
    tileText: 'Camera — 60 seconds. No wearable.',
    prompt:
      'Person holding smartphone at arms length for 60 second front camera health scan, soft daylight on face, no smartwatch no wearable, quick session mood, clean minimal background, no text',
  },
  'step-protocol': {
    file: 'step-protocol.jpg',
    tileText: 'Protocol — Timed doses and zeitgebers.',
    prompt:
      'Personal chronotherapy protocol concept: pill organizer with morning and evening slots, sun and moon zeitgeber icons subtle, meal and light timing, clean dark editorial layout, no readable text',
  },
  'side-patients': {
    file: 'side-patients.jpg',
    tileText: 'Patients — Free Mel sessions and protocols.',
    prompt:
      'Patient at home using smartphone health app comfortably on sofa, free accessible healthcare mood, warm natural light, hopeful calm, diverse UK adult, no logos no text on screen',
  },
  'side-clinicians': {
    file: 'side-clinicians.jpg',
    tileText: 'Clinicians — Spectrum review and exports.',
    prompt:
      'GP or clinician reviewing patient circadian spectrum chart on tablet in NHS clinic room, professional focused, export report mood, clean modern clinic lighting, no readable text on screen',
  },
  'side-nhs': {
    file: 'side-nhs.jpg',
    tileText: 'NHS — Population dose-timing infrastructure.',
    prompt:
      'UK NHS hospital exterior at dusk with warm window lights, population health infrastructure scale, trustworthy institutional, blue hour sky, no NHS logo no text',
  },
  'side-pharma': {
    file: 'side-pharma.jpg',
    tileText: 'Pharma — Governed anonymised research data.',
    prompt:
      'Secure anonymised health data vault: glowing data streams behind frosted glass and lock, pharmaceutical research governance, dark premium scientific, no company logos no text',
  },
  model: {
    file: 'model.jpg',
    tileText: 'Chronobiobank — Clinical consent, optional research.',
    prompt:
      'Dynamic consent interface mood: two pathways clinical use vs optional research contribution, toggle and padlock privacy, chronobiobank data ethics, dark UI amber accents, no readable text',
  },
} as const
