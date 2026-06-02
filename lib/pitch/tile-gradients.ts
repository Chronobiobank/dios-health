/** Glow tile palette — smart-health dark UI (teal · magenta · blue · orange) */

export type PitchGlowVariant = 'teal' | 'magenta' | 'blue' | 'orange'

export const PITCH_GLOW_GRADIENT: Record<
  PitchGlowVariant,
  { css: string; glow: string }
> = {
  teal: {
    css: 'linear-gradient(145deg, rgb(13 148 136 / 0.55) 0%, rgb(15 23 42 / 0.92) 55%, rgb(8 8 8 / 1) 100%)',
    glow: 'rgb(45 212 191 / 0.35)',
  },
  magenta: {
    css: 'linear-gradient(145deg, rgb(192 38 211 / 0.5) 0%, rgb(88 28 135 / 0.85) 50%, rgb(8 8 8 / 1) 100%)',
    glow: 'rgb(213 63 140 / 0.38)',
  },
  blue: {
    css: 'linear-gradient(145deg, rgb(37 99 235 / 0.45) 0%, rgb(26 54 93 / 0.9) 55%, rgb(8 8 8 / 1) 100%)',
    glow: 'rgb(26 54 93 / 0.5)',
  },
  orange: {
    css: 'linear-gradient(145deg, rgb(237 137 54 / 0.55) 0%, rgb(180 83 9 / 0.75) 45%, rgb(8 8 8 / 1) 100%)',
    glow: 'rgb(201 151 58 / 0.4)',
  },
}
