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
  await page.waitForSelector('.clq-section', { timeout: 60000 })

  const eyebrow = (await page.locator('.clq-section--hero .clq-eyebrow').first().textContent())?.trim() ?? ''
  record(`${label}: hero eyebrow`, /circadian nootropics/i.test(eyebrow), eyebrow)

  const sectionCount = await page.locator('.clq-section').count()
  record(`${label}: landing sections`, sectionCount === 5, `${sectionCount} sections`)

  const scrollType = await page.evaluate(() => ({
    hasClqSite: document.querySelector('.clq-site') !== null,
    bodySnap: getComputedStyle(document.body).scrollSnapType,
    sectionOverflow: getComputedStyle(document.querySelector('#mechanism .clq-container') || document.body).overflowY,
  }))
  record(
    `${label}: normal document scroll`,
    scrollType.hasClqSite && scrollType.bodySnap === 'none',
    `snap=${scrollType.bodySnap}`,
  )

  const mechanismOverflow = await page.evaluate(() => {
    const el = document.getElementById('mechanism')
    if (!el) return 'missing'
    return getComputedStyle(el).overflowY
  })
  record(`${label}: no section scroll trap`, mechanismOverflow === 'visible', mechanismOverflow)

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
  const roiSlider = page.locator('.clq-roi__range').first()
  const hasRoiControls = (await roiSlider.count()) > 0
  record(`${label}: proof calculator visible`, hasRoiControls)
  if (hasRoiControls) {
    await roiSlider.fill('100')
    await page.waitForTimeout(200)
  }
  const roiTotal = await page.locator('.clq-roi__results-total').textContent()
  const roiVisible = await page.evaluate(() => {
    const el = document.querySelector('.clq-roi__results-total')
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
  await page.waitForSelector('.clq-section', { timeout: 60000 })

  const ctaHref = await page.locator('a.clq-btn, a.clq-nav__cta').first().getAttribute('href')
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
