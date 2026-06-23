'use client'

import { useEffect } from 'react'

import { EVIDENCE_HREF } from '@/lib/deepdose-marketing/site-nav-links'

export default function ResearchRedirectPage() {
  useEffect(() => {
    window.location.replace(EVIDENCE_HREF)
  }, [])

  return null
}
