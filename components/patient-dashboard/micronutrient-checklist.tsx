'use client'

import Link from 'next/link'

import {
  MICRONUTRIENT_LABELS,
  getChronoimmuneZone,
} from '@/lib/chronoimmune/indication-zones'
import { productForMicronutrient, shopProductUrl } from '@/lib/shop/catalog'
import { CLINIC_ROUTES } from '@/lib/auth/routes'
import type { ChronoimmuneProfile } from '@/lib/patient-dashboard/types'
import { cn } from '@/lib/utils'

type MicronutrientChecklistProps = {
  profile: ChronoimmuneProfile
  /** Cohort patient id — enables practitioner order links */
  patientId?: string | null
  orderContext?: 'patient' | 'clinician'
}

export function MicronutrientChecklist({
  profile,
  patientId = null,
  orderContext = 'patient',
}: MicronutrientChecklistProps) {
  const zone = getChronoimmuneZone(profile.zoneId)
  const loggedCount = profile.micronutrientLog.filter((m) => m.logged).length

  return (
    <section className="chronoimmune-micronutrients">
      <p className="dash-sub mb-2 uppercase tracking-widest">
        Micronutrient stack — {loggedCount}/{profile.micronutrientLog.length} confirmed
      </p>
      <ul className="chronoimmune-micronutrient-list chronoimmune-micronutrient-list--actions">
        {profile.micronutrientLog.map((item) => {
          const product = productForMicronutrient(item.id)
          const showOrder = !item.logged && product != null

          const orderHref =
            orderContext === 'clinician' && patientId
              ? `${CLINIC_ROUTES.order(patientId)}?product=${product!.slug}&micronutrient=${item.id}`
              : shopProductUrl(product!.slug, {
                  qty: product!.quantityOptions[0]?.id,
                  source: 'checklist',
                  micronutrient: item.id,
                })

          return (
            <li
              key={item.id}
              className={cn(
                'chronoimmune-micronutrient-item chronoimmune-micronutrient-item--row',
                item.logged && 'chronoimmune-micronutrient-item--logged'
              )}
            >
              <span className="chronoimmune-micronutrient-item__main">
                <span className="chronoimmune-micronutrient-check" aria-hidden>
                  {item.logged ? '✓' : '○'}
                </span>
                {MICRONUTRIENT_LABELS[item.id]}
              </span>
              {showOrder ? (
                <Link
                  href={orderHref}
                  className="chronoimmune-order-btn"
                  onClick={(e) => e.stopPropagation()}
                >
                  Order
                </Link>
              ) : null}
            </li>
          )
        })}
      </ul>
      {zone.id === 2 ? (
        <p className="chronoimmune-panel__meta mt-2">Low-calcium diet mandatory for this zone.</p>
      ) : null}
    </section>
  )
}
