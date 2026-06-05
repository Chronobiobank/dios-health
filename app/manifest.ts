import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DIOS Coach',
    short_name: 'DIOS Coach',
    description:
      'Measure your Melanopic Lux. Get your personalised dose intelligence — light, meds, and timing.',
    start_url: '/dashboard/coach',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
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
