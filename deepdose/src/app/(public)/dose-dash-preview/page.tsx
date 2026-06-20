import { DoseDashStack } from '@/components/patient/DoseDashStack'
import { ZEITGEBER_DOMAINS, type ZeitgeberId } from '@/lib/chronobiology/zeitgebers'
import type { DoseCluster, DoseDashModel } from '@/lib/patient/dose-dash-types'

/**
 * No-auth visual preview of the patient dose dash with mock data.
 * For design review only — not linked from navigation. Safe to delete.
 */

const LABEL_BY_ID = Object.fromEntries(
  ZEITGEBER_DOMAINS.map((d) => [d.id, d.label])
) as Record<ZeitgeberId, string>

const CLUSTER_MOCK: Array<
  Pick<DoseCluster, 'id' | 'timeLabel' | 'activeNow' | 'summary' | 'detail'>
> = [
  {
    id: 'light',
    timeLabel: '06:40',
    activeNow: true,
    summary: 'Get outside before 06:40.',
    detail:
      'Morning light reaches the retina and sets the master clock (SCN). Get outside before 06:40 to lock your rhythm for the day.',
  },
  {
    id: 'meals',
    timeLabel: '07:40',
    activeNow: false,
    summary: 'First meal around 07:40.',
    detail:
      'Meal timing entrains the peripheral clocks in your liver and gut. Aim for your first meal around 07:40.',
  },
  {
    id: 'meds',
    timeLabel: '08:30 – 10:00',
    activeNow: true,
    summary: 'Window open: take between 08:30–10:00.',
    detail:
      'Absorption and clearance shift across the day. Your personalised window is open now — take between 08:30 and 10:00.',
  },
  {
    id: 'exercise',
    timeLabel: '16:00',
    activeNow: false,
    summary: 'Move your body around 16:00.',
    detail:
      'Movement raises core temperature and cortisol, reinforcing the clock. Late afternoon suits performance and recovery.',
  },
  {
    id: 'cognition',
    timeLabel: '10:30',
    activeNow: false,
    summary: 'Save deep focus for mid-morning.',
    detail:
      'Alertness and dopamine peak through the day. Save demanding focus for mid-morning, then ease into a mindful evening downshift.',
  },
  {
    id: 'sleep',
    timeLabel: '06:10 wake · 22:30 sleep',
    activeNow: false,
    summary: 'Dim lights by 21:00; sleep near 22:30.',
    detail:
      'Darkness triggers melatonin release, the signal for deep sleep and repair. Dim lights by 21:00 and aim to sleep near 22:30.',
  },
]

const MOCK_MODEL: DoseDashModel = {
  dlmoLabel: '22:30',
  dlmoSource: {
    label: 'TipTraQ clinical block',
    confidenceLabel: 'high',
    bandMinutes: null,
    detail: 'Measured from 3 nights of clinical-grade sleep data.',
  },
  clockDriftMinutes: 25,
  tiptraqNights: 3,
  tiptraqComplete: true,
  triageLabel: 'Needs attention',
  risks: [
    {
      id: 'sleep-apnoea',
      label: 'Sleep breathing',
      severity: 'low',
      headline: 'AHI 3 — within normal range',
      detail:
        'Breathing looks stable across your block. Dose timing can follow body-clock cues.',
    },
    {
      id: 'clock-drift',
      label: 'Body clock',
      severity: 'watch',
      headline: '+25m late vs sleep target',
      detail:
        'You are slipping past your DLMO anchor — tighten evening light and bedtime.',
    },
    {
      id: 'metabolic-rhythm',
      label: 'Metabolic rhythm',
      severity: 'low',
      headline: 'Metabolic rhythm steady',
      detail: 'Weekday and weekend timing look aligned enough for stable dosing.',
    },
  ],
  nextSteps: [
    {
      id: 'med-window',
      title: 'Medicine window is open',
      detail: 'Window open: take between 08:30–10:00.',
    },
    {
      id: 'evening-curfew',
      title: 'Dim lights by 21:00',
      detail: 'Aim to sleep near 22:30. +25m late vs sleep target',
    },
  ],
  clusters: CLUSTER_MOCK.map((c) => ({ ...c, label: LABEL_BY_ID[c.id] })),
}

const MOCK_MED_DETAIL = 'Metformin: 08:30–10:00 · Atorvastatin: 21:00–22:00'

export default function DoseDashPreviewPage() {
  return (
    <div className="seco-page seco-app-page">
      <div className="seco-landing__section-inner">
        <div className="space-y-8">
          <header>
            <p className="seco-page__eyebrow">Dose dash · preview</p>
            <h1 className="seco-page__title">Your timing today</h1>
            <p className="seco-page__lede">
              One view: metabolic risk from your sleep block, what to do next, and when to dose each
              daily cue.
            </p>
            <p className="mt-2 text-xs text-ink-faint">
              Design preview with mock data — not a live patient record.
            </p>
          </header>

          <DoseDashStack model={MOCK_MODEL} medDetail={MOCK_MED_DETAIL} />
        </div>
      </div>
    </div>
  )
}
