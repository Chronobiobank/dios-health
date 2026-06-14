'use client'

import Link from 'next/link'

import { DiosWordmark } from '@/components/brand/dios-wordmark'
import { MobileOverflowMenu } from '@/components/navigation/mobile-overflow-menu'
import { SECOPEUTIC_CLINICIANS_NAV_LINKS } from '@/lib/secopeutic/clinicians-nav-links'
import { DIOS_CLINICIANS_PATH } from '@/lib/secopeutic/site'

type SecopeuticSiteNavProps = {
  context?: string
}

export function SecopeuticSiteNav({ context }: SecopeuticSiteNavProps) {
  return (
    <header className="clinical-site-nav">
      <Link href={DIOS_CLINICIANS_PATH} className="clinical-site-nav__brand">
        <DiosWordmark />
      </Link>
      {context ? <span className="clinical-site-nav__context">{context}</span> : null}
      <div className="clinical-site-nav__actions">
        <MobileOverflowMenu
          links={SECOPEUTIC_CLINICIANS_NAV_LINKS}
          alwaysVisible
          tone="dark"
          eyebrow="Menu"
          panelTop="var(--seco-nav-height, 4rem)"
        />
      </div>
    </header>
  )
}
