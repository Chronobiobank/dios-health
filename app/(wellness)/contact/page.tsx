import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { CARD } from '@/components/sections/layout'
import { RESEARCH_ENQUIRIES_EMAIL } from '@/lib/pitch/landing-content'
import { GRANT_MUNRO_FOUNDER } from '@/lib/pitch/grant-munro-founder'
import { cn } from '@/lib/utils'

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
    lead: 'Tell us your trust or practice group. We will arrange a 20-minute briefing for your clinical team.',
    bullets: [
      'Clinical decision support boundaries and clinician accountability',
      'Care pathway fit (async patient measure → clinician review)',
      'Governance pack: consent model, IG/DPIA starter, research firewall',
      'Pilot design options and evaluation metrics for your priorities',
    ],
  },
  'ics-pilot': {
    title: 'ICS / PCN pilot discussion',
    lead: 'Share your patient priorities. We will outline pilot scope, safety checks, and how to measure results.',
    bullets: [
      'Proposed cohort and inclusion criteria',
      'Outcome measures aligned to your ICS plan',
      'IG and DPIA support for deployment',
      'Implementation timeline and clinical oversight model',
    ],
  },
  'cpo-briefing': {
    title: 'CPO briefing — CLOQ Health / BodycloQ score',
    lead: 'Tell us your cohort size and sector. We will outline the BodycloQ score, Q cue delivery, and Peak Window ROI.',
    bullets: [
      'Connect existing Oura, Whoop, or Apple Watch — feeds BodycloQ, no new hardware',
      'BodycloQ scores circadian alignment; Q delivers light, timing, and movement cues daily',
      'Pilot design: 10–50 professionals, CloQ score movement, productivity recovery model',
      'Founding partner pricing — circadian score for peak cognition, not another wellness perk',
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
      : intent === 'cpo-briefing'
        ? 'BodycloQ%20CPO%20briefing'
        : 'DIOS%20enquiry'

  return (
    <main className="marketing-detail mx-auto max-w-[76rem] px-5 pb-16 sm:px-6">
        <p className="type-label">Contact</p>
        <h1 className="type-section mt-4 max-w-3xl">
          {intentBlock?.title ?? 'Get in touch'}
        </h1>
        <p className="kz-lead mt-4 max-w-3xl text-[#0D0D0D]">
          {intentBlock?.lead ?? 'Email the DIOS team for research, clinical pilots, or product questions.'}
        </p>
        {intentBlock?.bullets ? (
          <ul className="type-body mt-6 max-w-3xl list-none space-y-2 pl-0 text-[#0D0D0D]">
            {intentBlock.bullets.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-relaxed">
                <span className="text-[#0D0D0D]/40" aria-hidden>
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <section
          className={cn(
            CARD,
            'mt-10 max-w-3xl rounded-[var(--calm-radius-card,8px)] p-5 text-[#0D0D0D] sm:mt-12 sm:p-6'
          )}
        >
          <div className="flex items-stretch gap-4 sm:gap-5">
            <div className="relative w-20 shrink-0 overflow-hidden rounded-[var(--calm-radius-card,8px)] sm:w-24">
              <Image
                src={GRANT_MUNRO_FOUNDER.profileImage}
                alt={GRANT_MUNRO_FOUNDER.profileImageAlt}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-medium tracking-tight text-black sm:text-2xl">
                {GRANT_MUNRO_FOUNDER.name}
              </h2>
              <p className="mt-1 text-sm text-[#0D0D0D]/70">{GRANT_MUNRO_FOUNDER.role}</p>
              <p className="mt-0.5 font-mono text-xs leading-relaxed text-[#0D0D0D]/55">
                {GRANT_MUNRO_FOUNDER.affiliation}
              </p>
            </div>
          </div>
          <div className="type-body mt-4 space-y-3 text-[15px] leading-relaxed text-[#0D0D0D]">
            {GRANT_MUNRO_FOUNDER.overview.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <ul className="mt-5 flex flex-col gap-2">
            {GRANT_MUNRO_FOUNDER.links.map((link) => (
              <li key={link.href}>
                {link.external ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80 sm:text-[15px]"
                  >
                    {link.label} →
                  </a>
                ) : (
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80 sm:text-[15px]"
                  >
                    {link.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
        <ul className="type-body mt-8 flex max-w-3xl flex-col gap-4 text-[#0D0D0D]">
          <li>
            <span className="type-label block text-[#0D0D0D]/50">Email</span>
            <a
              href={`mailto:${RESEARCH_ENQUIRIES_EMAIL}?subject=${mailSubject}`}
              className="mt-1 inline-block font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80"
            >
              {RESEARCH_ENQUIRIES_EMAIL}
            </a>
          </li>
          <li>
            <span className="type-label block text-[#0D0D0D]/50">Clinician demo</span>
            <Link
              href="/signup/clinician"
              className="mt-1 inline-block font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80"
            >
              Request a clinician demo →
            </Link>
          </li>
          <li>
            <span className="type-label block text-[#0D0D0D]/50">Evidence</span>
            <Link
              href="/evidence"
              className="mt-1 inline-block font-medium text-[#0D0D0D] underline underline-offset-4 hover:opacity-80"
            >
              Clinical evidence overview →
            </Link>
          </li>
        </ul>
    </main>
  )
}
