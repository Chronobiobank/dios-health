import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://deepdose.org'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/patient/', '/clinical/', '/enterprise/', '/api/'],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE.replace(/^https?:\/\//, ''),
  }
}
