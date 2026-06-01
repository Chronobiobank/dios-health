export type LayerKey = 'L1' | 'L2' | 'L3'

export type SpectrumConfidence = 'ESTIMATED' | 'PRECISION' | 'CONFIRMED'

export type SpectrumScore = {
  nodeId: string
  score: number
  confidence: SpectrumConfidence
  layer: LayerKey
}
