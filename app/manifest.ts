import type { MetadataRoute } from 'next'

import { COACH_DISPLAY_NAME } from '@/lib/coach/brand'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: COACH_DISPLAY_NAME,
    short_name: COACH_DISPLAY_NAME,
    description:
      'Measure your Melanopic Lux. Get your personalised dose intelligence — light, meds, and timing.',
    start_url: '/dashboard/coach',
    display: 'standalone',
    background_color: '#1A0D17',
    theme_color: '#1A0D17',
    orientation: 'portrait',
    icons: [
      {
        src: '/icons/vaya-192.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/vaya-192.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
