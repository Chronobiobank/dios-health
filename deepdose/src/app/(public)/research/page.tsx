'use client'

import { useEffect } from 'react'

import { CHRONOBIOBANK_RESEARCH_HREF } from '@/lib/deepdose-marketing/site-nav-links'

export default function ResearchRedirectPage() {
  useEffect(() => {
    window.location.replace(CHRONOBIOBANK_RESEARCH_HREF)
  }, [])

  return null
}
