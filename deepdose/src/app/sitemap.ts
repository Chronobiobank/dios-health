import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://deepdose.org'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/chronobiobank`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/technology`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/technology/dlmo-proxy`, lastModified, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${BASE}/home-test`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/terms`, lastModified, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE}/login`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/consent`, lastModified, changeFrequency: 'yearly', priority: 0.4 },
  ]
}
