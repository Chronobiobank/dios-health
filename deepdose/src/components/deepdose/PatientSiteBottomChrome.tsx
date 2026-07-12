'use client'

import { AppBottomNav, AppBottomNavSpacer } from '@/components/deepdose/AppBottomNav'

/** Same bottom nav as public product routes — one consumer chrome. */
export function PatientSiteBottomChrome() {
  return (
    <>
      <AppBottomNavSpacer />
      <AppBottomNav />
    </>
  )
}
