import { redirect } from 'next/navigation'

import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'

/** Legacy pitch deck entry — home is the canonical narrative (Option 1). */
export default function PitchIndexPage() {
  redirect(MARKETING_ROUTES.home)
}
