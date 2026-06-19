import type { ZeitgeberScheduleItem } from '@/lib/chronobiology/build-zeitgeber-schedule'
import type { ZeitgeberId } from '@/lib/chronobiology/zeitgebers'
import { DOSE_ZEITGEBER_EDUCATION } from '@/lib/chronobiology/zeitgebers'
import { Badge } from '@/components/ui/Layout'

const ZEITGEBER_ICONS: Record<ZeitgeberId, string> = {
  light: '☀️',
  meals: '🍽️',
  meds: '💊',
  exercise: '🏃',
  sleep: '🌙',
}

export function ZeitgeberSchedulePanel({ items }: { items: ZeitgeberScheduleItem[] }) {
  return (
    <section className="space-y-4">
      <div>
        <p className="seco-page__eyebrow">Your doses</p>
        <h2 className="seco-app-section-title">Daily timing cues</h2>
        <p className="mt-2 text-sm text-ink-muted">{DOSE_ZEITGEBER_EDUCATION}</p>
      </div>

      <div className="seco-app-card overflow-hidden !p-0">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.id} className="flex gap-4 p-5 md:p-6">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-lg"
                aria-hidden="true"
              >
                {ZEITGEBER_ICONS[item.id]}
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-ink">{item.label}</p>
                  {item.activeNow ? <Badge tone="success">Good time now</Badge> : null}
                </div>
                <p className="font-mono text-lg tracking-tight text-ink">{item.timeLabel}</p>
                <p className="text-sm text-ink-muted">{item.instruction}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
