#!/usr/bin/env node
/**
 * Notify search engines of the DeepDose sitemap after deploy.
 * Usage: node scripts/submit-google-index.mjs
 *
 * For full Google Search Console control (ranking, coverage), verify the domain at
 * https://search.google.com/search-console and submit the sitemap manually once.
 */
const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://deepdose.org'
const sitemapUrl = `${BASE}/sitemap.xml`

const endpoints = [
  `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
  `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
]

for (const url of endpoints) {
  try {
    const res = await fetch(url)
    console.log(`${res.ok ? '✓' : '✗'} ${url} → ${res.status}`)
  } catch (err) {
    console.error(`✗ ${url}`, err.message)
  }
}

console.log('\nNext: verify deepdose.org in Google Search Console and submit:', sitemapUrl)
