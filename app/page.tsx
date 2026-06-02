import { PitchDeck } from '@/components/sections/pitch/pitch-deck'
import { PitchLandingBackdrop, PitchShadowStyles } from '@/components/sections/pitch/pitch-backgrounds'

export default function Home() {
  return (
    <div className="calm-landing relative min-h-svh bg-[#F7FAFC] text-[#0D0D0D]">
      <PitchShadowStyles />
      <PitchLandingBackdrop fixed />
      <div className="relative z-10">
        <PitchDeck />
      </div>
    </div>
  )
}
