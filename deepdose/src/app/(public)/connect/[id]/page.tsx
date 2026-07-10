import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'

import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const match = DEEPDOSE_COMMUNITY_MATCHES.find((m) => m.id === id)
  if (!match) return { title: `Match · ${DEEPDOSE_NAME}` }
  return {
    title: `${match.name} · Connect`,
    description: `${match.name} · ${match.location}`,
    robots: { index: false, follow: false },
  }
}

export default async function ConnectMatchProfilePage({ params }: PageProps) {
  const { id } = await params
  const match = DEEPDOSE_COMMUNITY_MATCHES.find((m) => m.id === id)
  if (!match) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const messageHref = user ? '/chat' : '/login?next=/chat'

  return (
    <article className="seco-page seco-marketing-page dd-connect dd-connect-profile">
      <div className="seco-landing__section-inner dd-connect__inner">
        <p className="dd-connect-profile__back">
          <Link href="/connect">← Matches</Link>
        </p>

        <div
          className="dd-connect-profile__card seco-spectrum-tile seco-spectrum-tile--hero"
          style={{ '--cue': '#acd3de' } as CSSProperties}
        >
          <span
            className="dd-connect-profile__face"
            style={{ backgroundImage: `url(${communityFaceUrl(match.face, 640)})` }}
            aria-hidden
          />
          <div className="dd-connect-profile__copy">
            <h1 className="seco-page__title dd-connect-profile__name">
              <span className="seco-landing__hero-spectrum">{match.name}</span>
            </h1>
            <p className="dd-connect-profile__location">{match.location}</p>
            <p className="dd-connect-profile__pct">
              <span className="dd-connect__pct-value">{match.chemistryPct}%</span>
              <span className="dd-connect__pct-label"> chemistry</span>
            </p>
            <p className="dd-connect-profile__journey">{match.journey}</p>
            <Link href={messageHref} className="dd-connect__message dd-connect-profile__message">
              Chat
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
