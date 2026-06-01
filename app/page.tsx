import { PitchDeck } from '@/components/sections/pitch/pitch-deck'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'

export default function Home() {
  return (
    <div className="calm-landing min-h-svh bg-calm-bg text-white">
      <PitchDeck />
      <PitchFooter />
    </div>
  )
}
