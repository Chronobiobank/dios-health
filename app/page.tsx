import { PitchDeck } from '@/components/sections/pitch/pitch-deck'
import { PitchLandingBackdrop, PitchShadowStyles } from '@/components/sections/pitch/pitch-backgrounds'

export default function Home() {
  return (
    <div className="calm-landing relative min-h-svh bg-[#F7FAFC] text-[#0D0D0D]">
      <PitchShadowStyles />
      <PitchLandingBackdrop fixed />
      <div className="calm-landing__deck relative z-10 flex min-h-0 flex-1 flex-col">
        <PitchDeck />
      </div>
    </div>
  )
}
