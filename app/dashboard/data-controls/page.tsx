import Link from 'next/link'

import { ChronobiobankConsentPanel } from '@/components/chronobiobank/chronobiobank-consent-panel'
import { CoimbraParadoxStatement } from '@/components/chronobiobank/coimbra-paradox-statement'
import { DataControlsPanel } from '@/components/dashboard/data-controls-panel'
import { DashboardSettingsPage } from '@/components/dashboard/dashboard-settings-page'
import {
  SETTINGS_DATA_LAYOUT,
  SETTINGS_HEADER,
  SETTINGS_SECTION,
} from '@/components/dashboard/dashboard-styles'
import { GpReportButton } from '@/components/dashboard/gp-report-button'
import { PatientTopBar } from '@/components/dashboard/patient-top-bar'
import { TipTraqNightList } from '@/components/dashboard/tiptraq-night-list'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { buildPatientDashboardHeader } from '@/lib/auth/patient-dashboard-header'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { type TipTraqNightRow } from '@/lib/dashboard/mlux-profile'
import { consentStateFromRow } from '@/lib/chronobiobank/consent-toggles'
import { createClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

export default async function DashboardDataControlsPage() {
  const { user, profile, patient } = await requirePatientSession()
  const supabase = await createClient()

  const { data: nights } = await supabase
    .from('tiptraq_nights')
    .select('id, report_date, mlux_phase_time, confidence_score, confidence_label')
    .eq('patient_id', user.id)
    .order('report_date', { ascending: false })

  const nightHistory = (nights ?? []) as TipTraqNightRow[]

  const { data: chronobiobankConsentRow } = await supabase
    .from('chronobiobank_consent')
    .select(
      'consent_academic_research, consent_pharma_discovery, consent_ai_training, consent_open_source_challenges, consent_version, updated_at'
    )
    .eq('patient_id', user.id)
    .maybeSingle()

  const chronobiobankConsent = consentStateFromRow(chronobiobankConsentRow)

  const header = buildPatientDashboardHeader({
    profile,
    patient,
    subtitle: 'Data sharing and TipTraQ preferences.',
  })

  return (
    <DashboardSettingsPage>
      <PatientTopBar {...header} />

      <header className={SETTINGS_HEADER}>
        <Link
          href={PATIENT_ROUTES.profile}
          className="font-mono text-[11px] text-black/45 transition-colors hover:text-black"
        >
          ← Profile & settings
        </Link>
        <h1 className="mt-3">Data controls</h1>
        <p className="mt-2 text-sm text-black/55">
          Manage sharing preferences and recordings. For your photo and personal details, open{' '}
          <Link href={PATIENT_ROUTES.profile} className="text-black underline underline-offset-2">
            Profile & settings
          </Link>
          .
        </p>
      </header>

      <div className={SETTINGS_DATA_LAYOUT}>
        <div className="dashboard-settings-data-layout__main">
          <section className={SETTINGS_SECTION}>
            <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
              Data controls
            </h2>
            <p className="mt-2 text-sm text-black/55">
              You decide who sees your data. Each toggle saves immediately when you change it.
            </p>
            <div className="mt-4">
              <DataControlsPanel
                patientId={user.id}
                dataShareGp={patient.data_share_gp}
                dataShareResearch={patient.data_share_research}
                dataSharePolicy={patient.data_share_policy}
              />
            </div>
          </section>

          <section className={cn(SETTINGS_SECTION, 'border-t border-black/10 pt-8')}>
            <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">
              Chronobiobank
            </h2>
            <div className="mt-4">
              <CoimbraParadoxStatement />
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-black">Research consent dimensions</h3>
              <p className="mt-1 text-sm text-black/55">
                Control how your anonymised data may be used. Each toggle is independent and
                logged.
              </p>
              <div className="mt-4">
                <ChronobiobankConsentPanel initial={chronobiobankConsent} />
              </div>
            </div>
          </section>

          <section className={cn(SETTINGS_SECTION, 'border-t border-black/10 pt-8')}>
            <h2 className="text-xs font-medium uppercase tracking-[0.08em] text-black/45">Account</h2>
            <SignOutButton className="mt-4 md:max-w-xs" />
          </section>
        </div>

        {nightHistory.length > 0 ? (
          <aside className="dashboard-settings-data-layout__aside">
            <TipTraqNightList nights={nightHistory} title="Your TipTraQ recordings" />
            <GpReportButton />
          </aside>
        ) : null}
      </div>
    </DashboardSettingsPage>
  )
}
