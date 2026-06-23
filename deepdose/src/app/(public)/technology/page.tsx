import type { Metadata } from 'next'

import { TechnologyHubPage } from '@/components/deepdose/marketing/TechnologyHubPage'
import { TECHNOLOGY_HUB_META } from '@/lib/deepdose-marketing/technology-content'

export const metadata: Metadata = {
  title: TECHNOLOGY_HUB_META.title,
  description: TECHNOLOGY_HUB_META.description,
}

export default function TechnologyRoute() {
  return <TechnologyHubPage />
}
