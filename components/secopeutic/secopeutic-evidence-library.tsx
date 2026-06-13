'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { CLINICAL_GUIDE_CLINICIANS } from '@/lib/secopeutic/clinical-guide-clinicians'
import {
  SECOPEUTIC_EVIDENCE_PAGE,
  SECOPEUTIC_EVIDENCE_PATHWAYS,
  SECOPEUTIC_EVIDENCE_STUDIES,
  type SecopeuticEvidencePathway,
  type SecopeuticEvidenceStudy,
} from '@/lib/secopeutic/evidence-library'
import { cn } from '@/lib/utils'

function FindingText({ text, emphasis }: { text: string; emphasis: string }) {
  const parts = text.split(emphasis)
  if (parts.length < 2) return <>{text}</>
  return (
    <>
      {parts[0]}
      <strong>{emphasis}</strong>
      {parts.slice(1).join(emphasis)}
    </>
  )
}

function ClinicianStack({
  clinicians,
}: {
  clinicians: SecopeuticEvidenceStudy['clinicians']
}) {
  if (clinicians.length === 0) return null

  const label = clinicians.map((key) => CLINICAL_GUIDE_CLINICIANS[key].name).join(', ')

  return (
    <div className="seco-evidence__card-footer">
      <div className="seco-evidence__avatars" aria-hidden="true">
        {clinicians.map((key) => {
          const clinician = CLINICAL_GUIDE_CLINICIANS[key]
          return (
            <Image
              key={key}
              src={clinician.image}
              alt=""
              width={28}
              height={28}
              className="seco-evidence__avatar"
            />
          )
        })}
      </div>
      <p className="seco-evidence__prescribers">{label}</p>
    </div>
  )
}

function EvidenceCard({ study, index }: { study: SecopeuticEvidenceStudy; index: number }) {
  const isExternal = study.href.startsWith('http')

  return (
    <a
      id={study.id}
      href={study.href}
      className="seco-evidence__card"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      <p className="seco-evidence__badge">{study.badge}</p>
      <p className="seco-evidence__finding">
        <FindingText text={study.finding} emphasis={study.emphasis} />
      </p>
      <p className="seco-evidence__cite">{study.cite}</p>
      <p className="seco-evidence__meta">{study.doseLine}</p>
      <p className="seco-evidence__meta seco-evidence__meta--outcome">{study.outcomeLine}</p>
      <ClinicianStack clinicians={study.clinicians} />
      <span className="seco-evidence__rank" aria-hidden="true">
        {index + 1}
      </span>
    </a>
  )
}

export function SecopeuticEvidenceLibrary() {
  const [activePathway, setActivePathway] = useState<SecopeuticEvidencePathway>('all')

  const filteredStudies = useMemo(() => {
    if (activePathway === 'all') return SECOPEUTIC_EVIDENCE_STUDIES
    return SECOPEUTIC_EVIDENCE_STUDIES.filter((study) => study.pathways.includes(activePathway))
  }, [activePathway])

  return (
    <div className="seco-evidence">
      <header className="seco-evidence__intro">
        <p className="seco-evidence__eyebrow">{SECOPEUTIC_EVIDENCE_PAGE.eyebrow}</p>
        <h1 className="seco-evidence__title">{SECOPEUTIC_EVIDENCE_PAGE.headline}</h1>
        <p className="seco-evidence__support">{SECOPEUTIC_EVIDENCE_PAGE.support}</p>
      </header>

      <div className="seco-evidence__filters" role="tablist" aria-label="Evidence pathways">
        {SECOPEUTIC_EVIDENCE_PATHWAYS.map((pathway) => {
          const isActive = pathway.id === activePathway
          return (
            <button
              key={pathway.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={cn('seco-evidence__filter', isActive && 'seco-evidence__filter--active')}
              onClick={() => setActivePathway(pathway.id)}
            >
              {pathway.label}
            </button>
          )
        })}
      </div>

      <div className="seco-evidence__panel">
        <div className="seco-evidence__grid">
          {filteredStudies.map((study, index) => (
            <EvidenceCard key={study.id} study={study} index={index} />
          ))}
        </div>
      </div>

      <div className="seco-evidence__cta">
        <Link href={SECOPEUTIC_EVIDENCE_PAGE.pilotCta.href} className="seco-landing__btn seco-landing__btn--primary">
          {SECOPEUTIC_EVIDENCE_PAGE.pilotCta.label} →
        </Link>
      </div>
    </div>
  )
}
