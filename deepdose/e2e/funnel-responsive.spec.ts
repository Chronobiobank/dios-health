/**
 * Responsive funnel checklist — public marketing pages at mobile / tablet / desktop.
 *
 * Local:  pnpm test:funnel
 * Live:   PLAYWRIGHT_BASE_URL=https://deepdose.org pnpm test:funnel
 */
import { test, expect, type Page } from '@playwright/test'

const VIEWPORTS = [
  { label: 'mobile', width: 375, height: 812 },
  { label: 'tablet', width: 768, height: 1024 },
  { label: 'desktop', width: 1280, height: 900 },
] as const

const PATIENT_LANDING_PATH =
  '/profile?meds=metformin,ramipril,atorvastatin,sertraline&times=07:30,08:00,20:00,12:00&wake=07:30'

const DESKTOP_NAV_MIN = 1024

async function assertNoHorizontalOverflow(page: Page) {
  const overflows = await page.evaluate(() => {
    const doc = document.documentElement
    return doc.scrollWidth > doc.clientWidth + 1
  })
  expect(overflows, 'page should not scroll horizontally').toBe(false)
}

async function assertNavForViewport(page: Page, width: number) {
  const toggle = page.locator('.seco-nav__toggle')
  const desktop = page.locator('.seco-nav__desktop')

  if (width >= DESKTOP_NAV_MIN) {
    await expect(desktop, 'desktop inline nav at >=1024px').toBeVisible()
    await expect(toggle, 'hamburger hidden at >=1024px').toBeHidden()
  } else {
    await expect(toggle, 'hamburger visible below 1024px').toBeVisible()
    await expect(desktop, 'inline nav hidden below 1024px').toBeHidden()
  }
}

for (const viewport of VIEWPORTS) {
  test.describe(`Funnel · ${viewport.label} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('home /', async ({ page }) => {
      await page.goto('/')
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Chemistry That\s*Connects/i)
      await expect(
        page.getByText(/Discover your chemical phenotype and find people who move through life like you/i)
      ).toBeVisible()
      await expect(page.getByRole('link', { name: /^About us$/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /^Sign in$/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /Find Your Sync/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /Discover Your Phenotype/i })).toBeVisible()
      await expect(page.getByText('You must be 18+ y/o to enter and agree to our')).toBeVisible()
      await expect(page.getByRole('link', { name: /^Terms$/i })).toBeVisible()
      await expect(page.getByRole('link', { name: /^Report$/i })).toBeVisible()
    })

    test('patient landing', async ({ page }) => {
      await page.goto(PATIENT_LANDING_PATH)
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Your sleep–wake plan')
      await expect(page.getByText('Sleep')).toBeVisible()
      await expect(page.getByText('Wake')).toBeVisible()
      await expect(page.getByText(/Sleep–wake regularity/i)).toBeVisible()
      await expect(page.getByText('Medicines & timing')).toBeVisible()
      await expect(page.getByRole('link', { name: 'Save my plan' })).toBeVisible()
      await expect(page.getByText(/Body clock/i)).toHaveCount(0)
      await expect(page.getByText('My risk')).toHaveCount(0)
    })

    test('legacy /problem redirects to mission', async ({ page }) => {
      await page.goto('/problem')
      await expect(page).toHaveURL(/\/mission/)
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toContainText(/Chemical/i)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/soul-matching/i)
    })

    test('mission /mission', async ({ page }) => {
      await page.goto('/mission')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      await assertNoHorizontalOverflow(page)
    })

    test('connect /connect', async ({ page }) => {
      await page.goto('/connect')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toContainText(/Sync/i)
      await expect(page.getByRole('link', { name: /Message|Chat/i }).first()).toBeVisible()
    })

    test('clinician landing', async ({ page }) => {
      await page.goto('/clinician-landing')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toContainText(/Scripts/i)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/timed right/i)
      await expect(page.getByRole('link', { name: /Sign in/i }).first()).toBeVisible()
    })
  })
}
