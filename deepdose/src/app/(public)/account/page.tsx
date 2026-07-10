import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import SignOutButton from '@/components/auth/SignOutButton'
import { ProfilePanel } from '@/components/patient/ProfilePanel'
import { DEEPDOSE_NAME } from '@/lib/brand/deepdose-brand'
import {
  getConsentPurposes,
  getCurrentFramework,
  getPatientConsents,
} from '@/lib/consent/dynamic-consent'
import {
  buildProfileConsentRows,
  type LinkedClinician,
} from '@/lib/patient/profile-settings'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: `${DEEPDOSE_NAME} · Account`,
  description: 'Privacy, consent, devices, and sign out.',
  alternates: { canonical: '/account' },
  robots: { index: false, follow: false },
}

const ACCOUNT_SHORTCUTS = [
  { href: '/patient/dashboard/data', label: 'Devices' },
  { href: '/patient/dashboard/medications', label: 'Medicines' },
  { href: '/patient/dashboard/rhythm', label: 'Sleep rhythm' },
  { href: '/dosage', label: 'Chemistry' },
] as const

export default async function AccountPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/?next=/account')
  }

  const { framework } = await getCurrentFramework(supabase)

  const [
    { data: profile },
    { data: userProfile },
    { data: careLinks },
    patientConsentsResult,
    purposesResult,
  ] = await Promise.all([
    supabase
      .from('patient_profiles')
      .select('reminders_enabled')
      .eq('id', user.id)
      .maybeSingle(),
    supabase.from('user_profiles').select('display_name').eq('id', user.id).maybeSingle(),
    supabase
      .from('care_relationships')
      .select('clinician_id')
      .eq('patient_id', user.id)
      .eq('active', true),
    getPatientConsents(supabase, user.id),
    framework
      ? getConsentPurposes(supabase, framework.id)
      : Promise.resolve({ purposes: [], error: null }),
  ])

  const patientConsents = patientConsentsResult.consents ?? []
  const clinicianIds = (careLinks ?? []).map((l) => l.clinician_id)
  const { data: clinicianProfiles } = clinicianIds.length
    ? await supabase.from('user_profiles').select('id, display_name').in('id', clinicianIds)
    : { data: [] }

  const clinicians: LinkedClinician[] = (clinicianProfiles ?? []).map((c) => ({
    id: c.id,
    displayName: c.display_name,
  }))

  const clinicalConsent = patientConsents.find((c) => c.purpose_code === 'clinical_care')
  const sharingEnabled =
    clinicalConsent?.granted === true && !clinicalConsent?.withdrawn_at

  const consentRows = buildProfileConsentRows(purposesResult.purposes, patientConsents)
  const displayName = userProfile?.display_name?.trim() || user.email?.split('@')[0] || 'Member'

  return (
    <article className="seco-page seco-marketing-page dd-account">
      <div className="seco-landing__section-inner dd-account__inner">
        <header className="dd-account__head seco-reveal seco-reveal--1">
          <h1 className="seco-page__title dd-account__title">
            <span className="seco-landing__hero-spectrum">Account</span>
          </h1>
          <Link href="/profile" className="dd-account__back">
            Profile
          </Link>
        </header>

        <section className="seco-spectrum-tile seco-spectrum-tile--hero dd-account__identity seco-reveal seco-reveal--2">
          <p className="dd-account__name">{displayName}</p>
          {user.email ? <p className="dd-account__email">{user.email}</p> : null}
        </section>

        {framework ? (
          <div className="dd-account__panel seco-reveal seco-reveal--3">
            <ProfilePanel
              remindersEnabled={profile?.reminders_enabled ?? true}
              sharingEnabled={sharingEnabled}
              frameworkId={framework.id}
              consents={consentRows}
              clinicians={clinicians}
            />
          </div>
        ) : (
          <p className="dd-account__empty seco-reveal seco-reveal--3">
            Account settings are unavailable right now.
          </p>
        )}

        <section
          className="seco-spectrum-tile dd-account__shortcuts seco-reveal seco-reveal--4"
          aria-label="More"
        >
          <ul className="dd-account__shortcut-list">
            {ACCOUNT_SHORTCUTS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="dd-account__shortcut">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="dd-account__signout seco-reveal seco-reveal--5">
          <SignOutButton className="dd-account__signout-btn" />
        </div>
      </div>
    </article>
  )
}
