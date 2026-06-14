/**
 * Live API smoke tests for dios.health Week 1 spine.
 * Run: node scripts/smoke-live-api.mjs
 */

const BASE = process.env.SMOKE_BASE_URL ?? 'https://www.dios.health'

async function request(path, init) {
  const url = `${BASE}${path}`
  const res = await fetch(url, init)
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = { raw: text.slice(0, 200) }
  }
  return { status: res.status, json }
}

async function main() {
  const results = []

  // 1. Pilot form validation (400 = route alive, schema enforced)
  const missingFields = await request('/api/demo-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ full_name: 'Smoke Test' }),
  })
  results.push({
    name: 'demo-request validation',
    pass: missingFields.status === 400,
    status: missingFields.status,
    detail: missingFields.json?.error ?? missingFields.json,
  })

  // 2. Pilot form insert (unique email to avoid duplicate noise)
  const stamp = Date.now()
  const pilot = await request('/api/demo-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      full_name: 'API Smoke Test',
      email: `smoke+${stamp}@example.com`,
      organisation: 'DIOS QA',
      role: 'Clinician',
      patient_count: '1',
      message: 'Automated smoke test — safe to delete',
    }),
  })
  results.push({
    name: 'demo-request insert',
    pass: pilot.status === 200 && pilot.json?.success === true,
    status: pilot.status,
    detail: pilot.json?.error ?? 'ok',
  })

  // 3. Fulfillment requirements (401 without session)
  const requirements = await request('/api/fulfillment/requirements', { method: 'GET' })
  results.push({
    name: 'fulfillment requirements auth',
    pass: requirements.status === 401,
    status: requirements.status,
    detail: requirements.json?.error ?? requirements.json,
  })

  // 4. Dose confirm validation (401 without session)
  const doseAuth = await request('/api/coach/confirm-dose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicationName: 'Vitamin D3', confirmedAt: new Date().toISOString() }),
  })
  results.push({
    name: 'confirm-dose auth',
    pass: doseAuth.status === 401,
    status: doseAuth.status,
    detail: doseAuth.json?.error ?? doseAuth.json,
  })

  // 5. Shop checkout auth gate
  const shop = await request('/api/shop/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productSlug: 'd3-k2-protocol', quantityOptionId: '30' }),
  })
  results.push({
    name: 'shop checkout auth',
    pass: shop.status === 401,
    status: shop.status,
    detail: shop.json?.error ?? shop.json,
  })

  console.log(`Smoke tests against ${BASE}\n`)
  let failed = 0
  for (const r of results) {
    const mark = r.pass ? 'PASS' : 'FAIL'
    if (!r.pass) failed += 1
    console.log(`${mark}  ${r.name}  (${r.status})`)
    if (!r.pass || r.name === 'demo-request insert') {
      console.log(`      ${JSON.stringify(r.detail)}`)
    }
  }

  if (failed > 0) process.exit(1)
  console.log('\nAll smoke tests passed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
