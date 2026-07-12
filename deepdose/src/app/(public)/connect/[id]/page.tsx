import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'

import { AppTopBarBack } from '@/components/deepdose/AppTopBar'
import { ProductAppShell } from '@/components/deepdose/ProductAppShell'
import { SleepScoreTipTraqLink } from '@/components/deepdose/SleepScoreTipTraqLink'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import { connectChatHref } from '@/lib/chat/connect-demo-peers'
import { DEEPDOSE_COMMUNITY_MATCHES } from '@/lib/deepdose-marketing/community-content'
import { communityFaceUrl } from '@/lib/deepdose-marketing/community-faces'
import { createClient } from '@/lib/supabase/server'

type PageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const match = DEEPDOSE_COMMUNITY_MATCHES.find((m) => m.id === id)
  if (!match) return { title: `Friend · ${DEEPDOSE_NAME}` }
  return {
    title: `${match.name} · Friends`,
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
  const messageHref = connectChatHref(match.id, Boolean(user))

  return (
    <ProductAppShell
      title={match.name}
      leading={<AppTopBarBack href="/matches" label="Back to matches" />}
      className="dd-connect dd-connect-profile"
    >
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
          <p className="dd-connect-profile__location">{match.location}</p>
          <p className="dd-connect-profile__pct">
            <span className="dd-connect__pct-value tabular-nums">{match.chemistryPct}</span>
            <span className="dd-connect__pct-label">% phenotype overlap</span>
          </p>
          <p className="dd-connect-profile__journey">{match.journey}</p>
          <Link href={messageHref} className="dd-connect__message dd-connect-profile__message">
            Chat
          </Link>
          <SleepScoreTipTraqLink compact className="dd-connect-profile__tiptraq" />
        </div>
      </div>
    </ProductAppShell>
  )
}
