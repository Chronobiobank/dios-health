/**
 * HeroMedsPreview — polypharmacy sync panel for the patient-landing hero tabs.
 * Drop into DeepDoseHeroTabs.tsx alongside HeroDashPreview and HeroPlanPreview.
 *
 * Visual language: matches seco-dashpreview card system exactly.
 * Data: George's four-med demo profile (no auth required).
 */

// ─── Demo data ───────────────────────────────────────────────────────────────

const DEMO_WAKE = '07:30'
const DEMO_NAME = 'George'

const DEMO_MEDS = [
  {
    name: 'Metformin',
    cls: 'Biguanide',
    timing: 'Morning',
    window: 'Within 1 hr of waking',
    sync: 'synced',
    rec: 'Take within 1 hour of your wake time with food.',
  },
  {
    name: 'Atorvastatin',
    cls: 'Statin',
    timing: 'Evening',
    window: '20:00 – 22:00',
    sync: 'review',
    rec: 'Currently taken in the morning — move to evening to match nocturnal synthesis peak.',
  },
  {
    name: 'Ramipril',
    cls: 'ACE Inhibitor',
    timing: 'Bedtime',
    window: '21:00 – 23:00',
    sync: 'review',
    rec: 'Hygia Trial: bedtime dosing cuts cardiovascular events by up to 45%.',
  },
  {
    name: 'Amlodipine',
    cls: 'CCB',
    timing: 'Morning',
    window: 'Within 1 hr of waking',
    sync: 'synced',
    rec: 'Morning dosing covers the blood pressure surge at wake.',
  },
] as const

// ─── Component ───────────────────────────────────────────────────────────────

export function HeroMedsPreview() {
  const synced  = DEMO_MEDS.filter(m => m.sync === 'synced').length
  const total   = DEMO_MEDS.length
  const allGood = synced === total

  return (
    <div className="seco-dashpreview seco-dashpreview--meds" aria-hidden="true">
      <div className="seco-dashpreview__main">

        {/* Header */}
        <div className="seco-dashpreview__top">
          <div className="seco-dashpreview__id">
            <span className="seco-dashpreview__avatar" />
            <div className="seco-dashpreview__profile">
              <p className="seco-dashpreview__name-row">
                <span className="seco-dashpreview__name">{DEMO_NAME}</span>
                <span className="seco-dashpreview__profile-age">61</span>
              </p>
              <div className="seco-dashpreview__profile-detail">
                <span className="seco-dashpreview__profile-location">London, UK</span>
                <span className="seco-dashpreview__profile-date">Wake {DEMO_WAKE}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sync signal */}
        <div className="seco-dashpreview__hero seco-dashpreview__hero--stack">
          <div className="seco-dashpreview__dial-block">
            <h3 className="seco-dashpreview__metric-title">Medication sync</h3>

            <div className="seco-dashpreview__metric-card seco-dashpreview__anchor-panel">
              <p className="seco-dashpreview__anchor-result">
                {synced} of {total} meds are in sync with your body clock
              </p>

              {/* RAG summary row */}
              <div className="seco-dashpreview__anchor-compare">
                <div className="seco-dashpreview__anchor-node">
                  <span
                    className="seco-dashpreview__anchor-icon"
                    style={{ color: 'var(--status-green)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.2" />
                      <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="seco-dashpreview__anchor-time">{synced}</span>
                  <span className="seco-dashpreview__anchor-label">Synced</span>
                  <span className="seco-dashpreview__anchor-hint">Timing is optimal</span>
                </div>

                <div className="seco-dashpreview__anchor-bridge">
                  <span className="seco-dashpreview__anchor-line" />
                  <span className="seco-dashpreview__anchor-gap">
                    {allGood ? 'All clear' : `${total - synced} to review`}
                  </span>
                  <span className="seco-dashpreview__anchor-line" />
                </div>

                <div className="seco-dashpreview__anchor-node seco-dashpreview__anchor-node--target">
                  <span
                    className="seco-dashpreview__anchor-icon"
                    style={{ color: 'var(--status-amber)' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <circle cx="8" cy="8" r="6" fill="currentColor" opacity="0.2" />
                      <circle cx="8" cy="8" r="3.5" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="seco-dashpreview__anchor-time">{total - synced}</span>
                  <span className="seco-dashpreview__anchor-label">To review</span>
                  <span className="seco-dashpreview__anchor-hint">Small timing shifts needed</span>
                </div>
              </div>
            </div>

            {/* Med rows */}
            <ul className="seco-dashpreview__stats">
              {DEMO_MEDS.map((med) => (
                <li key={med.name} className="seco-dashpreview__stat">
                  <span className="seco-dashpreview__stat-label">
                    <span
                      style={{
                        display: 'inline-block',
                        width: 7,
                        height: 7,
                        borderRadius: '50%',
                        background: med.sync === 'synced'
                          ? 'var(--status-green)'
                          : 'var(--status-amber)',
                        marginRight: 6,
                        verticalAlign: 'middle',
                      }}
                      aria-hidden
                    />
                    {med.name}
                    <span
                      style={{
                        marginLeft: 6,
                        fontSize: '0.7em',
                        color: 'var(--ink-faint)',
                        fontFamily: 'var(--font-data)',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {med.cls}
                    </span>
                  </span>
                  <span className="seco-dashpreview__stat-value">{med.timing}</span>
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>

      {/* Footer ladder */}
      <div className="seco-dashpreview__ladder">
        <div className="seco-dashpreview__ladder-row">
          <p className="seco-dashpreview__ladder-title">No account needed to check</p>
          <ol className="seco-dashpreview__ladder-steps">
            <li className="seco-dashpreview__ladder-step seco-dashpreview__ladder-step--done">
              <span className="seco-dashpreview__ladder-mark" aria-hidden>✓</span>
              <span className="seco-dashpreview__ladder-label">Enter your meds</span>
            </li>
            <li className="seco-dashpreview__ladder-step seco-dashpreview__ladder-step--current">
              <span className="seco-hero-tabs__dot seco-hero-tabs__dot--live" aria-hidden />
              <span className="seco-dashpreview__ladder-label">See timing conflicts</span>
            </li>
            <li className="seco-dashpreview__ladder-step">
              <span className="seco-dashpreview__ladder-mark" aria-hidden>○</span>
              <span className="seco-dashpreview__ladder-label">Save your profile free</span>
            </li>
          </ol>
        </div>
        <p className="seco-dashpreview__ladder-note">
          Based on Hygia Trial, TIME substudy, and UK Biobank circadian data.
        </p>
      </div>
    </div>
  )
}
