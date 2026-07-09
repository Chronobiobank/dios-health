/**
 * Responsive funnel checklist — public marketing pages at mobile / tablet / desktop.
 *
 * Local:  pnpm test:funnel
 * Live:   PLAYWRIGHT_BASE_URL=https://deepdose.org pnpm test:funnel
 */
import { test, expect, type Locator, type Page } from '@playwright/test'

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
    await expect(desktop, 'desktop inline nav at ≥1024px').toBeVisible()
    await expect(toggle, 'hamburger hidden at ≥1024px').toBeHidden()
  } else {
    await expect(toggle, 'hamburger visible below 1024px').toBeVisible()
    await expect(desktop, 'inline nav hidden below 1024px').toBeHidden()
  }
}

/** Element text should not be truncated by -webkit-line-clamp. */
async function assertNotLineClamped(locator: Locator) {
  const clamped = await locator.evaluate((el) => {
    const style = window.getComputedStyle(el)
    const lineClamp = style.webkitLineClamp
    if (lineClamp && lineClamp !== 'none' && lineClamp !== '0') {
      return el.scrollHeight > el.clientHeight + 2
    }
    return false
  })
  expect(clamped, 'copy should not be line-clamped').toBe(false)
}

async function assertFullyRendered(locator: Locator) {
  await expect(locator).toBeVisible()
  const box = await locator.boundingBox()
  expect(box?.height ?? 0).toBeGreaterThan(8)
  const clipped = await locator.evaluate((el) => {
    let node: Element | null = el
    while (node) {
      const style = window.getComputedStyle(node)
      if (style.overflow === 'hidden' && el.scrollHeight > node.clientHeight + 2) {
        return true
      }
      node = node.parentElement
    }
    return false
  })
  expect(clipped, 'copy should not be clipped by overflow:hidden ancestor').toBe(false)
}

for (const viewport of VIEWPORTS) {
  test.describe(`Funnel · ${viewport.label} (${viewport.width}px)`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } })

    test('home /', async ({ page }) => {
      await page.goto('/')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Activate precision sleep.')

      const lede = page.locator('.seco-splash__hero-marketing .seco-landing__hero-lede')
      await assertFullyRendered(lede)
      await expect(lede).toContainText(/creates precision dosing plans/i)
      await expect(lede).toContainText(/live your best life/i)
      await expect(page.getByRole('link', { name: /Find out your risk/i })).toBeVisible()
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

    test('the fix /problem', async ({ page }) => {
      await page.goto('/problem')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toContainText(/Clock time/i)
      await expect(page.getByRole('heading', { level: 1 })).toContainText(/body time/i)
      await expect(page.getByText(/Many drugs vary in effect/i)).toBeVisible()
      await expect(page.getByRole('link', { name: /Pilot timing-smart prescriptions/i })).toBeVisible()
      await expect(page.getByText(/Order on the advice of your GP/i)).toHaveCount(0)
    })

    test('mission /chronobiobank', async ({ page }) => {
      await page.goto('/chronobiobank')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toContainText(/chronobiobank/i)
      await expect(page.getByRole('heading', { name: /Phone not cloud/i })).toBeVisible()

      const beats = page.locator('.seco-chronobiobank__plane-visual__beat')
      await expect(beats).toHaveCount(4)

      for (let i = 0; i < 4; i += 1) {
        const beat = beats.nth(i)
        await beat.scrollIntoViewIfNeeded()
        await assertFullyRendered(beat)
      }

      await expect(beats.nth(3)).toContainText(/Timing, recovery/i)
    })

    test('pricing', async ({ page }) => {
      await page.goto('/pricing')
      await assertNavForViewport(page, viewport.width)
      await assertNoHorizontalOverflow(page)

      await expect(page.getByRole('heading', { level: 1 })).toContainText(/pricing/i)
      await expect(page.getByText(/Body clock baseline/i).first()).toBeVisible()
      await expect(page.getByRole('link', { name: /How Testkit works/i })).toBeVisible()
      await expect(page.getByText(/Order on the advice of your GP/i)).toHaveCount(0)
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
