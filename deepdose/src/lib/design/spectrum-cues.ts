/** Shared spectrum cue colours for glass tiles (--cue custom property). */
export const SPECTRUM_TILE_CUES = [
  '#f2b8a2',
  '#acd3de',
  '#c9b6f2',
  '#8b9cf8',
  '#f2a3c0',
  '#eef4f8',
] as const

export const SCHOLAR_TONE_CUES = {
  violet: '#c9b6f2',
  amber: '#f2b8a2',
  teal: '#acd3de',
} as const

export function spectrumCue(index: number): string {
  return SPECTRUM_TILE_CUES[index % SPECTRUM_TILE_CUES.length] ?? SPECTRUM_TILE_CUES[0]
}

export function scholarToneCue(tone?: keyof typeof SCHOLAR_TONE_CUES): string | undefined {
  return tone ? SCHOLAR_TONE_CUES[tone] : undefined
}
