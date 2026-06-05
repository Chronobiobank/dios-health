import { CHRONOBIOBANK_CONSENT_TOGGLES } from '@/lib/chronobiobank/consent-toggles'
import type { ChronobiobankConsentState } from '@/lib/chronobiobank/types'

type ChronobiobankConsentSummaryProps = {
  consent: ChronobiobankConsentState
  title?: string
}

export function ChronobiobankConsentSummary({
  consent,
  title = 'Chronobiobank consent state',
}: ChronobiobankConsentSummaryProps) {
  return (
    <section className="chronoimmune-consent-summary">
      <p className="dash-sub uppercase tracking-widest">{title}</p>
      <ul className="mt-2 space-y-1.5 text-xs">
        {CHRONOBIOBANK_CONSENT_TOGGLES.map((toggle) => {
          const on = consent[toggle.key]
          return (
            <li key={toggle.dimension} className="flex items-center justify-between gap-3">
              <span className="text-[var(--text-muted)]">{toggle.label}</span>
              <span
                className={
                  on
                    ? 'font-mono text-[10px] uppercase text-emerald-700'
                    : 'font-mono text-[10px] uppercase text-black/40'
                }
              >
                {on ? 'Allowed' : 'Denied'}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-2 font-mono text-[10px] text-black/40">
        v{consent.consentVersion} · updated{' '}
        {new Date(consent.updatedAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
      </p>
    </section>
  )
}
