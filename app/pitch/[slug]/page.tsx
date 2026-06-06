import { notFound, redirect } from 'next/navigation'

import { PitchDetailView } from '@/components/sections/pitch/pitch-detail-view'
import { getPitchSlugRedirect } from '@/lib/pitch/pitch-redirects'
import { getPitchDetailPage, PITCH_DETAIL_PAGES } from '@/lib/pitch/pitch-minimal'

export function generateStaticParams() {
  return PITCH_DETAIL_PAGES.map((page) => ({ slug: page.slug }))
}

type PitchDetailPageProps = {
  params: Promise<{ slug: string }>
}

export default async function PitchDetailPage({ params }: PitchDetailPageProps) {
  const { slug } = await params
  const legacyRedirect = getPitchSlugRedirect(slug)
  if (legacyRedirect) redirect(legacyRedirect)

  const page = getPitchDetailPage(slug)

  if (!page) notFound()

  return (
    <PitchDetailView
      page={page}
      showFounderOrigin={slug === 'problem' || slug === 'clinical-proof'}
    />
  )
}
