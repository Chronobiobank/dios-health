import { DemoForm } from '@/components/sections/DemoForm'
import { Footer } from '@/components/sections/Footer'
import { LandingClinicians } from '@/components/sections/landing/LandingClinicians'
import { LandingFooterCta } from '@/components/sections/landing/LandingFooterCta'
import { LandingHero } from '@/components/sections/landing/LandingHero'
import { LandingHowItWorks } from '@/components/sections/landing/LandingHowItWorks'
import { LandingMedications } from '@/components/sections/landing/LandingMedications'
import { LandingProblem } from '@/components/sections/landing/LandingProblem'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <main>
        <LandingHero />
        <LandingProblem />
        <LandingHowItWorks />
        <LandingMedications />
        <LandingClinicians />
        <DemoForm />
        <LandingFooterCta />
        <Footer />
      </main>
    </div>
  )
}
