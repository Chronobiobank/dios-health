import { PitchDeck } from '@/components/sections/pitch/pitch-deck'
import { PitchFooter } from '@/components/sections/pitch/pitch-footer'

export default function Home() {
  return (
    <div className="bg-black text-white">
      <PitchDeck />
      <PitchFooter />
    </div>
  )
}
