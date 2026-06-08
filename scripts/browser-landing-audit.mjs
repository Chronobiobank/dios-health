/**
 * Browser-level landing audit — desktop + mobile.
 * Run: npx playwright install chromium && node scripts/browser-landing-audit.mjs
 */
import { chromium, devices } from 'playwright'

const BASE = process.env.BASE_URL ?? 'http://localhost:3000'

/** @typedef {{ name: string; pass: boolean; detail?: string }} Result */

/** @type {Result[]} */
const results = []

function record(name, pass, detail = '') {
  results.push({ name, pass, detail })
  const mark = pass ? 'PASS' : 'FAIL'
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function auditHome(page, label) {
  await page.goto(BASE, { waitUntil: 'load', timeout: 90000 })
  await page.waitForSelector('.kz-s', { timeout: 60000 })
  await page.waitForFunction(
    () => document.documentElement.classList.contains('marketing-v2-active'),
    { timeout: 15000 },
  )

  const eyebrow = (await page.locator('.kz-s .kz-ey').first().textContent())?.trim() ?? ''
  record(`${label}: hero eyebrow`, /exiq/i.test(eyebrow), eyebrow)

  const sectionCount = await page.locator('.kz-s').count()
  record(`${label}: snap sections`, sectionCount === 5, `${sectionCount} sections`)

  const snapType = await page.evaluate(() => ({
    htmlClass: document.documentElement.classList.contains('marketing-v2-active'),
    bodySnap: getComputedStyle(document.body).scrollSnapType,
  }))
  record(
    `${label}: scroll-snap active`,
    snapType.htmlClass && snapType.bodySnap.includes('mandatory'),
    `class=${snapType.htmlClass}, snap=${snapType.bodySnap}`,
  )

  const sectionMetrics = await page.evaluate(() => {
    const vh = window.innerHeight
    return [...document.querySelectorAll('.kz-s')].slice(0, 5).map((el) => {
      const h = el.getBoundingClientRect().height
      return { id: el.id, height: Math.round(h), vh: Math.round(vh), ratio: h / vh }
    })
  })

  const fullViewport = sectionMetrics.every((s) => s.ratio >= 0.92 && s.ratio <= 1.08)
  record(
    `${label}: sections ~100vh (first 5)`,
    fullViewport,
    sectionMetrics.map((s) => `${s.id}:${s.height}/${s.vh}`).join(', '),
  )

  const hasTealBg = await page.evaluate(() =>
    [...document.querySelectorAll('.kz-s')].some((el) => el.classList.contains('kz-s--teal')),
  )
  record(`${label}: no teal sections`, !hasTealBg)

  // Scroll to #product (nav links hidden on mobile)
  await page.evaluate(() => {
    const el = document.getElementById('product')
    if (el) el.scrollIntoView({ block: 'start', behavior: 'instant' })
  })
  await page.waitForTimeout(800)
  const productSnap = await page.evaluate(() => {
    const el = document.getElementById('product')
    if (!el) return { ok: false, top: null }
    const top = el.getBoundingClientRect().top
    return { ok: Math.abs(top) < 100, top: Math.round(top) }
  })
  record(`${label}: #product in viewport`, productSnap.ok, `top=${productSnap.top}px`)

  // Proof section — calculator + results on one slide
  await page.evaluate(() => document.getElementById('proof')?.scrollIntoView())
  await page.waitForTimeout(700)
  const roiSlider = page.locator('.kz-roi__range').first()
  const hasRoiControls = (await roiSlider.count()) > 0
  record(`${label}: proof calculator visible`, hasRoiControls)
  if (hasRoiControls) {
    await roiSlider.fill('100')
    await page.waitForTimeout(200)
  }
  const roiTotal = await page.locator('.kz-roi__results-total').textContent()
  const roiVisible = await page.evaluate(() => {
    const el = document.querySelector('.kz-roi__results-total')
    if (!el) return false
    const r = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.opacity !== '0'
  })
  record(`${label}: ROI cost visible`, roiVisible && !!roiTotal?.trim(), roiTotal?.trim() ?? 'empty')

  // CPO briefing CTA
  const briefingHref = await page.locator('a[href="/contact?intent=cpo-briefing"]').first().getAttribute('href')
  record(`${label}: CPO CTA href`, briefingHref === '/contact?intent=cpo-briefing')

  await page.click('a[href="/contact?intent=cpo-briefing"]', { timeout: 5000 })
  await page.waitForURL(/contact/, { timeout: 10000 })
  const contactTitle = await page.locator('h1').first().textContent()
  record(
    `${label}: CPO contact page`,
    /briefing|cpo|corporate/i.test(contactTitle ?? ''),
    contactTitle?.trim(),
  )
}

async function auditEvidence(page, label) {
  await page.goto(`${BASE}/evidence`, { waitUntil: 'load', timeout: 90000 })
  await page.waitForSelector('.kz-s', { timeout: 60000 })

  const ctaHref = await page.locator('a.kz-btn-p, a.kz-cta-btn').first().getAttribute('href')
  record(`${label}: evidence CTA present`, !!ctaHref, ctaHref ?? '')

  if (ctaHref?.includes('/science')) {
    await page.click(`a[href="${ctaHref}"]`)
    await page.waitForURL(/science/, { timeout: 10000 })
    const hasAnchor = await page.evaluate(() => !!document.getElementById('four-cadences'))
    record(`${label}: science four-cadences anchor`, hasAnchor)
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true })

  const desktop = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const desktopPage = await desktop.newPage()
  await auditHome(desktopPage, 'Desktop')
  await auditEvidence(desktopPage, 'Desktop')
  await desktop.close()

  const mobile = await browser.newContext({ ...devices['iPhone 13'] })
  const mobilePage = await mobile.newPage()
  await auditHome(mobilePage, 'Mobile')
  await mobile.close()

  await browser.close()

  const failed = results.filter((r) => !r.pass)
  console.log('\n---')
  console.log(`Results: ${results.length - failed.length}/${results.length} passed`)
  if (failed.length) {
    console.log('Failed:')
    failed.forEach((f) => console.log(`  - ${f.name}${f.detail ? `: ${f.detail}` : ''}`))
    process.exit(1)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
