import { Buyers } from '@/components/sections/Buyers'
import { ClinicianPanel } from '@/components/sections/ClinicianPanel'
import { DataControls } from '@/components/sections/DataControls'
import { DataSovereignty } from '@/components/sections/DataSovereignty'
import { DemoForm } from '@/components/sections/DemoForm'
import { DrugModules } from '@/components/sections/DrugModules'
import { Footer } from '@/components/sections/Footer'
import { FourClusters } from '@/components/sections/FourClusters'
import { Hero } from '@/components/sections/Hero'
import { TimebotHome } from '@/components/sections/TimebotHome'
import { Pricing } from '@/components/sections/Pricing'
import { ResearchersHome } from '@/components/sections/ResearchersHome'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#0D0D0D]">
      <main>
        <Hero />
        <FourClusters />
        <TimebotHome />
        <DrugModules />
        <ClinicianPanel />
        <DataControls />
        <DataSovereignty />
        <Pricing />
        <Buyers />
        <ResearchersHome />
        <DemoForm />
        <Footer />
      </main>
    </div>
  )
}
