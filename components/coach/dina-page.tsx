import Link from 'next/link'

import { DinaScenariosGallery } from '@/components/coach/dina-scenarios-gallery'
import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'
import { DINA_PAGE_INTRO } from '@/lib/coach/dina-scenarios'
import { PATIENT_PREVIEW_ENTRY } from '@/lib/pitch/audience-entry-content'

export function DinaPage() {
  return (
    <div className="dina-page dios-nav-tone-paper">
      <section className="dina-page__hero dios-page-top-bleed">
        <div className="dina-page__inner">
          <p className="dina-page__eyebrow">{DINA_PAGE_INTRO.eyebrow}</p>
          <h1 className="dina-page__title">{DINA_PAGE_INTRO.title}</h1>
          <p className="kz-lead dina-page__lead">{DINA_PAGE_INTRO.lead}</p>
        </div>
      </section>

      <section className="dina-page__scenarios">
        <div className="dina-page__inner">
          <DinaScenariosGallery apiEndpoint="/api/coach/demo" />
        </div>
      </section>

      <section className="dina-page__cta">
        <div className="dina-page__inner">
          <p className="dina-page__cta-copy">
            Sign in to run {COACH_DISPLAY_NAME} on your own stack — same intelligence, your body clock.
          </p>
          <div className="dina-page__cta-actions">
            <Link className="dina-page__btn-solid" href={PATIENT_PREVIEW_ENTRY.href}>
              {PATIENT_PREVIEW_ENTRY.ctaLabel}
            </Link>
            <Link className="dina-page__btn-ghost" href="/dashboard/coach">
              Open {COACH_DISPLAY_NAME}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
