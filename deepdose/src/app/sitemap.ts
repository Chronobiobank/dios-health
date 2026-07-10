import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.deepdose.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/mission`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/science`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/technology`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/technology/dlmo-proxy`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/membership`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/tiptraq`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/testkit`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/profile`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/dosage`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/share`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/connect`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${BASE}/chat`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/safety`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/take-it-down`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/report`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE}/2257`, lastModified, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
