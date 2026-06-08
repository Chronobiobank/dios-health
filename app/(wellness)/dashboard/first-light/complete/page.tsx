import type { Metadata } from 'next'

import { FirstLightComplete } from '@/components/first-light/first-light-complete'
import { FIRST_LIGHT_PROTOCOL } from '@/lib/product/dose-intelligence-model'

import '../first-light.css'

export const metadata: Metadata = {
  title: `${FIRST_LIGHT_PROTOCOL.name} complete — DIOS`,
}

export default function FirstLightCompletePage() {
  return <FirstLightComplete />
}
