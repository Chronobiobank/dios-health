'use client'

import { HomeLandingSectionVideo } from '@/components/sections/home/home-landing-section-video'
import { HOME_CTA_MEDIA } from '@/lib/pitch/home-landing-content'

export function HomeCtaVideo() {
  return (
    <HomeLandingSectionVideo
      video={HOME_CTA_MEDIA.video}
      poster={HOME_CTA_MEDIA.poster}
      mediaClassName="home-landing__cta-media"
      videoClassName="home-landing__cta-video"
    />
  )
}
