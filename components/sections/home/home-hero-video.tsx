'use client'

import { HomeLandingSectionVideo } from '@/components/sections/home/home-landing-section-video'
import { HOME_HERO } from '@/lib/pitch/home-landing-content'

export function HomeHeroVideo() {
  return <HomeLandingSectionVideo video={HOME_HERO.video} poster={HOME_HERO.poster} />
}
