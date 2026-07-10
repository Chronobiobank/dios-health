'use client'

import { useMemo } from 'react'
import Link from 'next/link'

import { DoseIcon, DOSE_TIMING } from '@/components/chronobiology/DoseVisual'
import { SpectrumTile, SpectrumTileGrid } from '@/components/deepdose/SpectrumTile'
import { DOSAGE_PAGE } from '@/lib/deepdose-marketing/dosage-content'
import {
  resolvePolyPlanMeds,
  syncStateForRisk,
  SYNC_LABEL,
} from '@/lib/medications/poly-plan-meds'
import { RISK_RANK } from '@/lib/medications/polypharmacy-timing'
import { buildTakeTimeMap } from '@/lib/patient/plan-dose-preview'
import { inferLandingBodyClock } from '@/lib/patient/infer-landing-body-clock'
import { buildSixDoseStrip } from '@/lib/patient/six-dose-strip'
import { cn } from '@/lib/utils/cn'
import type { ZeitgeberId } from '@/lib/chronobiology/zeitgebers'

type PatientDosageDashboardProps = {
  medCodes: string[]
  medTimes?: string[]
  wake: string | null
  signupHref: string
}

const TRIAGE_CLASS: Record<'synced' | 'review' | 'conflict', string> = {
  synced: 'dose-dash-triage--on-track',
  review: 'dose-dash-triage--attention',
  conflict: 'dose-dash-triage--review',
}

export function PatientDosageDashboard({
  medCodes,
  medTimes = [],
  wake,
  signupHref,
}: PatientDosageDashboardProps) {
  const bodyClock = useMemo(
    () => inferLandingBodyClock(wake, medTimes),
    [wake, medTimes]
  )
  const doses = useMemo(
    () => buildSixDoseStrip(bodyClock.dlmoEstimateHours),
    [bodyClock.dlmoEstimateHours]
  )
  const meds = useMemo(() => resolvePolyPlanMeds(medCodes), [medCodes])
  const sortedMeds = useMemo(
    () => [...meds].sort((a, b) => RISK_RANK[b.meta.risk] - RISK_RANK[a.meta.risk]),
    [meds]
  )
  const takeTimes = useMemo(() => buildTakeTimeMap(medCodes, medTimes), [medCodes, medTimes])
  const copy = DOSAGE_PAGE

  return (
    <div className="sw-dash">
      <div className="sw-dash__tiles">
        <article
          className="dios-glass-outer sw-dash__tile sw-dash__tile--protocol"
          aria-label="Your dosage protocol"
        >
          <div className="sw-dash__dose-grid seco-patient-doses">
            <SpectrumTileGrid as="ul" cols={2} sm2 aria-label="Your dosage protocol">
              {doses.map((dose) => {
                const zeitgeberId = dose.id as ZeitgeberId
                const timing = DOSE_TIMING[zeitgeberId]
                const isBiomedical = dose.id === 'meds'

                return (
                  <SpectrumTile
                    key={dose.id}
                    as="li"
                    className={cn(
                      isBiomedical && 'sw-dash__dose-tile--biomedical',
                      isBiomedical && sortedMeds.length > 0 && 'sw-dash__dose-tile--with-meds'
                    )}
                    cue={timing.color}
                    label={dose.cue}
                    title={dose.label}
                    body={
                      isBiomedical && sortedMeds.length > 0 ? (
                        <div className="sw-dash__biomedical">
                          <ul className="sw-dash__biomedical-meds" aria-label="Medicines">
                            {sortedMeds.map((med) => {
                              const sync = syncStateForRisk(med.meta.risk)
                              const takeTime = takeTimes[med.code]
                              return (
                                <li
                                  key={med.code}
                                  className={cn(
                                    'dios-glass-inner sw-dash__biomedical-med',
                                    `sw-dash__med-row--${sync}`
                                  )}
                                >
                                  <div className="sw-dash__med-head">
                                    <p className="dash-med-row__name">{med.name}</p>
                                    <span className={cn('dose-dash-triage', TRIAGE_CLASS[sync])}>
                                      {SYNC_LABEL[sync]}
                                    </span>
                                  </div>
                                  <p className="dash-med-row__meta">
                                    {takeTime ? (
                                      <span className="font-mono tabular-nums">{takeTime}</span>
                                    ) : (
                                      med.meta.timing
                                    )}
                                  </p>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      ) : null
                    }
                    titleTag="h3"
                    titleVariant="default"
                    icon={<DoseIcon id={zeitgeberId} />}
                    foot={
                      <div className="sw-dash__dose-foot">
                        <span className="sw-dash__dose-time font-mono tabular-nums">
                          {dose.timeLabel}
                        </span>
                        <span className="sw-dash__dose-status">
                          {dose.status === 'now'
                            ? 'Now'
                            : dose.status === 'done'
                              ? 'Done'
                              : 'Upcoming'}
                        </span>
                      </div>
                    }
                  />
                )
              })}
            </SpectrumTileGrid>
          </div>
        </article>
      </div>

      <div className="sw-dash__cta">
        <Link href={signupHref} className="dd-profile__action dd-profile__action--primary sw-dash__cta-btn">
          {copy.cta}
        </Link>
      </div>
    </div>
  )
}
