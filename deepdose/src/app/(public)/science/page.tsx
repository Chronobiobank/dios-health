'use client'

import { useEffect } from 'react'

import { CHRONOBIOBANK_SCIENCE_HREF } from '@/lib/deepdose-marketing/site-nav-links'

export default function ScienceRedirectPage() {
  useEffect(() => {
    window.location.replace(CHRONOBIOBANK_SCIENCE_HREF)
  }, [])

  return null
}
