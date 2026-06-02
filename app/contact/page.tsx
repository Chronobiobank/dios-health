import type { Metadata } from 'next'
import Link from 'next/link'

import { RESEARCH_ENQUIRIES_EMAIL } from '@/lib/pitch/landing-content'

export const metadata: Metadata = {
  title: 'Contact — DIOS Health',
  description: 'Clinical briefings, ICS pilots, research enquiries, and general contact for DIOS Health.',
}

const INTENT_COPY: Record<
  string,
  { title: string; lead: string; bullets?: readonly string[] }
> = {
  'clinical-briefing': {
    title: 'Clinical briefing & governance pack',
    lead: 'Tell us your ICS, trust, or PCN and we will arrange a 20-minute clinical briefing for your medical leadership team.',
    bullets: [
      'Clinical decision support boundaries and clinician accountability',
      'Care pathway fit (async patient measure → clinician review)',
      'Governance pack: consent model, IG/DPIA starter, research firewall',
      'Pilot design options and evaluation metrics for your priorities',
    ],
  },
  'ics-pilot': {
    title: 'ICS / PCN pilot discussion',
    lead: 'Share your population health priorities and we will outline pilot scope, safety monitoring, and an evaluation template.',
    bullets: [
      'Proposed cohort and inclusion criteria',
      'Outcome measures aligned to your ICS plan',
      'IG and DPIA support for deployment',
      'Implementation timeline and clinical oversight model',
    ],
  },
}

type ContactPageProps = {
  searchParams: Promise<{ intent?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { intent } = await searchParams
  const intentBlock = intent && INTENT_COPY[intent] ? INTENT_COPY[intent] : null
  const mailSubject = intent === 'clinical-briefing'
    ? 'Clinical%20briefing%20request'
    : intent === 'ics-pilot'
      ? 'ICS%20pilot%20enquiry'
      : 'DIOS%20enquiry'

  return (
    <main className="mx-auto max-w-[76rem] px-5 pb-16 sm:px-6">
        <p className="type-label">Contact</p>
        <h1 className="type-section mt-4 max-w-3xl">
          {intentBlock?.title ?? 'Get in touch'}
        </h1>
        <p className="type-body mt-4 max-w-3xl">
          {intentBlock?.lead ??
            'For Chronobiobank research, clinical partnerships, or product questions, reach the DIOS team by email or book a demo.'}
        </p>
        {intentBlock?.bullets ? (
          <ul className="type-body mt-6 max-w-3xl list-none space-y-2 pl-0">
            {intentBlock.bullets.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-relaxed text-black/70">
                <span className="text-black/40" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <ul className="type-body mt-8 flex max-w-3xl flex-col gap-4">
          <li>
            <span className="type-label block text-[#0D0D0D]/50">Email</span>
            <a
              href={`mailto:${RESEARCH_ENQUIRIES_EMAIL}?subject=${mailSubject}`}
              className="mt-1 inline-block font-medium underline underline-offset-4 hover:opacity-80"
            >
              {RESEARCH_ENQUIRIES_EMAIL}
            </a>
          </li>
          <li>
            <span className="type-label block text-[#0D0D0D]/50">Clinician demo</span>
            <Link
              href="/signup/clinician"
              className="mt-1 inline-block font-medium underline underline-offset-4 hover:opacity-80"
            >
              Request a clinician demo →
            </Link>
          </li>
          <li>
            <span className="type-label block text-[#0D0D0D]/50">Evidence</span>
            <Link
              href="/evidence"
              className="mt-1 inline-block font-medium underline underline-offset-4 hover:opacity-80"
            >
              Clinical evidence overview →
            </Link>
          </li>
        </ul>
    </main>
  )
}
