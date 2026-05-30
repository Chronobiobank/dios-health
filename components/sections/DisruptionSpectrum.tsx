import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

import { CONTAINER, SECTION } from './layout'

const MARKERS = [
  'Social jetlag from misaligned social and biological clocks',
  'Metabolic strain from sustained circadian drift',
  'Elevated cancer risk in long-term shift cohorts',
  'Neural decline linked to broken sleep architecture',
] as const

const STAGES = [
  {
    tag: 'Mild acute disruption detected at population scale',
    title: 'Social jetlag and shift-work disorder sit at the earliest point on the curve',
    body: 'Behavioural misalignment between social and biological clocks is the first signal DIOS can detect before pathology develops',
    bg: 'bg-[#EDE8F7]/50',
    dark: false,
  },
  {
    tag: 'Intermediate metabolic disruption before formal diagnosis',
    title: 'Metabolic and cardiovascular strain follows months of sustained clock drift',
    body: 'Population-level insulin and vascular dysfunction often precedes a formal diabetes or heart disease diagnosis by years',
    bg: 'bg-[#FAFAFA]',
    dark: false,
  },
  {
    tag: 'Severe systemic risk in chronically misaligned cohorts',
    title: 'Oncological burden rises when DNA repair cycles lose circadian control',
    body: 'Night-shift populations show measurably higher cancer incidence when clock-driven cell repair fails',
    bg: 'bg-[#FDF6E8]',
    dark: false,
  },
  {
    tag: 'Chronic neurological decline at the far end of the spectrum',
    title: "Dementia risk grows when glymphatic clearance loses nightly circadian drive",
    body: 'Broken sleep architecture stops the brain clearing toxic waste and drift velocity tracks neurodegenerative onset in cohorts',
    bg: 'bg-[#3B1F35]',
    dark: true,
  },
] as const

const PMC_IDS = [
  'PMC7261021',
  'PMC4212693',
  'PMC9974590',
  'PMC7002226',
  'PMC11050388',
  'PMC12254753',
] as const

const PMC_SCIENCE_HREF = `https://pmc.ncbi.nlm.nih.gov/search/?term=${PMC_IDS.join('%20OR%20')}`

export function DisruptionSpectrum() {
  return (
    <section id="spectrum" className={`${SECTION} bg-[#FAFAFA] py-16 sm:py-20`}>
      <div className={CONTAINER}>
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">The evidence</p>
        <h2 className="type-section mt-4">The circadian disruption spectrum runs from mild jetlag to chronic pathology</h2>
        <p className="type-body mt-4 max-w-2xl">
          DIOS intervenes where shift-worker populations sit on the curve from mild jetlag to chronic disease
        </p>

        <div className="mt-12">
          <div className="mb-3 flex justify-between font-mono text-xs uppercase tracking-wider text-black/50">
            <span>Mild / Acute</span>
            <span>Severe / Chronic</span>
          </div>
          <div className="relative pb-2">
            <div
              className="pointer-events-none absolute inset-x-0 top-[11px] z-0 h-2 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #EDE8F7 0%, #A87A97 50%, #3B1F35 100%)',
              }}
              aria-hidden
            />
            <div className="relative z-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
              {MARKERS.map((label) => (
                <div key={label} className="flex flex-col items-center text-center">
                  <div className="flex h-6 w-full items-center justify-center">
                    <span
                      className="block h-3 w-3 shrink-0 rounded-full bg-[#C9973A] ring-4 ring-[#FAFAFA]"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-5 min-h-[2.5em] max-w-[9rem] text-xs font-medium leading-snug text-black text-pretty sm:max-w-none sm:text-sm">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {STAGES.map((stage) => (
            <Card
              key={stage.title}
              className={cn(
                'flex h-full flex-col gap-0 border border-black/10 py-0 shadow-none ring-0',
                stage.bg,
                stage.dark && 'text-white'
              )}
            >
              <CardHeader className="gap-2 px-6 pt-6">
                <p
                  className={cn(
                    'min-h-[2.5em] font-mono text-xs uppercase tracking-wider',
                    stage.dark ? 'text-[#C9973A]' : 'text-black/50'
                  )}
                >
                  {stage.tag}
                </p>
                <CardTitle
                  className={cn(
                    'min-h-[3.25rem] font-sans text-lg font-semibold leading-snug',
                    stage.dark ? 'text-white' : 'text-black'
                  )}
                >
                  {stage.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 px-6 pb-6">
                <p
                  className={cn(
                    'min-h-[4.5em] text-pretty',
                    stage.dark
                      ? 'font-sans text-[0.9375rem] font-normal leading-[1.6] text-[#B8ADB3]'
                      : 'type-body text-black/70'
                  )}
                >
                  {stage.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <blockquote className="mt-12 border-l-2 border-[#C9973A] bg-white px-6 py-8 sm:px-8">
          <p className="font-sans text-xl font-medium leading-snug text-black sm:text-2xl">
            DIOS catches circadian disruption at the behavioural stage — before metabolic, cancer, or neurological pathology — and informs the prescribing decision without prescribing or dosing
          </p>
        </blockquote>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            variant="outline"
            className="type-button h-11 rounded-full border-black/15 bg-white px-6 text-black hover:bg-black/5"
          >
            <Link href={PMC_SCIENCE_HREF} target="_blank" rel="noopener noreferrer">
              PMC reference search
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
