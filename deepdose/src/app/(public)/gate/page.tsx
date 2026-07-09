import { createClient } from '@/lib/supabase/server'
import { ClinicalActivationGate } from '@/components/patient/ClinicalActivationGate'

export default async function GatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <section className="seco-page seco-auth-page deepdose-gate-page">
      <div className="seco-landing__section-inner seco-auth-page__inner">
        <ClinicalActivationGate isAuthenticated={Boolean(user)} />
      </div>
    </section>
  )
}
