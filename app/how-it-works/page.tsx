import type { Metadata } from 'next'

import { HowItWorksLanding } from '@/components/sections/how-it-works/how-it-works-landing'
import { HOW_IT_WORKS_META } from '@/lib/pitch/how-it-works-content'

import '@/app/styles/home-landing.css'

export const metadata: Metadata = {
  title: HOW_IT_WORKS_META.title,
  description: HOW_IT_WORKS_META.description,
}

export default function HowItWorksPage() {
  return <HowItWorksLanding />
}
