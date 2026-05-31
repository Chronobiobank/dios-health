import { DemoForm } from '@/components/sections/DemoForm'
import { Footer } from '@/components/sections/Footer'
import { Hero } from '@/components/sections/Hero'
import { HomeEvidence } from '@/components/sections/HomeEvidence'
import { HomeGap } from '@/components/sections/HomeGap'
import { HomeHowItWorks } from '@/components/sections/HomeHowItWorks'
import { HomeMedicationCoverage } from '@/components/sections/HomeMedicationCoverage'
import { HomeWhoItIsFor } from '@/components/sections/HomeWhoItIsFor'
import { RoiCalculator } from '@/components/sections/RoiCalculator'
import { StatsBar } from '@/components/sections/StatsBar'
import { TimebotHome } from '@/components/sections/TimebotHome'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black">
      <main>
        <Hero />
        <StatsBar />
        <HomeGap />
        <TimebotHome />
        <HomeHowItWorks />
        <HomeMedicationCoverage />
        <RoiCalculator />
        <HomeWhoItIsFor />
        <HomeEvidence />
        <DemoForm />
        <Footer />
      </main>
    </div>
  )
}
