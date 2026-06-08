'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

import { PrgcMonitoringDemo } from '@/components/clinic/prgc-monitoring-demo'
import { GpCohortTriageDashboard } from '@/components/clinicians/gp-cohort-triage-dashboard'
import {
  CLINICIANS_TRIAGE_DEMO,
  type CliniciansTriageTabId,
} from '@/lib/pitch/clinicians-triage-demo-content'
import { cn } from '@/lib/utils'

const TABS = [CLINICIANS_TRIAGE_DEMO.tabs.queue, CLINICIANS_TRIAGE_DEMO.tabs.prgc] as const

function parseTab(value: string | null | undefined): CliniciansTriageTabId {
  return value === 'prgc' ? 'prgc' : 'queue'
}

type ClinicianTriageDemoProps = {
  initialTab?: CliniciansTriageTabId
}

export function ClinicianTriageDemo({ initialTab = 'queue' }: ClinicianTriageDemoProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<CliniciansTriageTabId>(() =>
    parseTab(searchParams.get('tab') ?? initialTab)
  )

  const selectTab = useCallback(
    (tab: CliniciansTriageTabId) => {
      setActiveTab(tab)
      const params = new URLSearchParams(searchParams.toString())
      if (tab === 'queue') {
        params.delete('tab')
      } else {
        params.set('tab', tab)
      }
      const query = params.toString()
      router.replace(query ? `/clinicians/triage?${query}` : '/clinicians/triage', { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div className="clinicians-triage-demo">
      <header className="clinicians-triage-demo__intro">
        <p className="clinicians-triage-demo__eyebrow">{CLINICIANS_TRIAGE_DEMO.eyebrow}</p>
        <h1 className="clinicians-triage-demo__title">{CLINICIANS_TRIAGE_DEMO.headline}</h1>
        <p className="clinicians-triage-demo__lede kz-lead">{CLINICIANS_TRIAGE_DEMO.lede}</p>
        <p className="clinicians-triage-demo__bridge">{CLINICIANS_TRIAGE_DEMO.bridge}</p>

        <div className="clinicians-triage-demo__tabs" role="tablist" aria-label="Clinician triage views">
          {TABS.map((tab) => {
            const selected = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`triage-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`triage-panel-${tab.id}`}
                className={cn('clinicians-triage-demo__tab', selected && 'clinicians-triage-demo__tab--active')}
                onClick={() => selectTab(tab.id)}
              >
                <span className="clinicians-triage-demo__tab-label">{tab.label}</span>
                <span className="clinicians-triage-demo__tab-detail">{tab.detail}</span>
              </button>
            )
          })}
        </div>
      </header>

      <div
        id="triage-panel-queue"
        role="tabpanel"
        aria-labelledby="triage-tab-queue"
        hidden={activeTab !== 'queue'}
        className="clinicians-triage-demo__panel"
      >
        <GpCohortTriageDashboard />
      </div>

      <div
        id="triage-panel-prgc"
        role="tabpanel"
        aria-labelledby="triage-tab-prgc"
        hidden={activeTab !== 'prgc'}
        className="clinicians-triage-demo__panel"
      >
        <PrgcMonitoringDemo embedded />
      </div>
    </div>
  )
}
