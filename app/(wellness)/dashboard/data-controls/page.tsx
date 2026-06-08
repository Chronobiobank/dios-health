import Link from 'next/link'

import { ChronobiobankConsentPanel } from '@/components/chronobiobank/chronobiobank-consent-panel'
import { CoimbraParadoxStatement } from '@/components/chronobiobank/coimbra-paradox-statement'
import { DataControlsPanel } from '@/components/dashboard/data-controls-panel'
import { DashboardSettingsPage } from '@/components/dashboard/dashboard-settings-page'
import {
  SECTION_LABEL,
  SETTINGS_BACK_LINK,
  SETTINGS_DATA_LAYOUT,
  SETTINGS_HEADER,
  SETTINGS_LEDE,
  SETTINGS_SECTION,
  SETTINGS_SECTION_DIVIDED,
} from '@/components/dashboard/dashboard-styles'
import { GpReportButton } from '@/components/dashboard/gp-report-button'
import { TipTraqNightList } from '@/components/dashboard/tiptraq-night-list'
import { SignOutButton } from '@/components/auth/sign-out-button'
import { requirePatientSession } from '@/lib/auth/require-patient'
import { PATIENT_ROUTES } from '@/lib/auth/routes'
import { type TipTraqNightRow } from '@/lib/dashboard/mlux-profile'
import { consentStateFromRow } from '@/lib/chronobiobank/consent-toggles'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardDataControlsPage() {
  const { user, patient } = await requirePatientSession()
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

  return (
    <DashboardSettingsPage>
      <header className={SETTINGS_HEADER}>
        <Link href={PATIENT_ROUTES.profile} className={SETTINGS_BACK_LINK}>
          ← Profile & settings
        </Link>
        <h1>Data controls</h1>
        <p className={SETTINGS_LEDE}>
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
            <h2 className={SECTION_LABEL}>Data controls</h2>
            <p className={SETTINGS_LEDE}>
              You decide who sees your data. Each toggle saves immediately when you change it.
            </p>
            <DataControlsPanel
              patientId={user.id}
              dataShareGp={patient.data_share_gp}
              dataShareResearch={patient.data_share_research}
              dataSharePolicy={patient.data_share_policy}
            />
          </section>

          <section className={SETTINGS_SECTION_DIVIDED}>
            <h2 className={SECTION_LABEL}>Chronobiobank</h2>
            <CoimbraParadoxStatement />
            <div className={SETTINGS_SECTION}>
              <h3 className="text-sm font-medium text-black">Research consent dimensions</h3>
              <p className={SETTINGS_LEDE}>
                Control how your anonymised data may be used. Each toggle is independent and logged.
              </p>
              <ChronobiobankConsentPanel initial={chronobiobankConsent} />
            </div>
          </section>

          <section className={SETTINGS_SECTION_DIVIDED}>
            <h2 className={SECTION_LABEL}>Account</h2>
            <SignOutButton className="md:max-w-xs" />
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
