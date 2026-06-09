import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { MarketingPublicShell } from '@/components/sections/marketing/marketing-public-shell'
import { CLOQ_DESCRIPTOR, CLOQ_HEALTH_LEGAL_NAME } from '@/lib/brand/cloq-health'
import { GRANT_MUNRO_FOUNDER } from '@/lib/pitch/grant-munro-founder'
import { MARKETING_ROUTES } from '@/lib/pitch/marketing-routes'
import { cn } from '@/lib/utils'

const PARTNERSHIP_EMAIL = 'hello@cloq.health'

export const metadata: Metadata = {
  title: 'Contact — CLOQ Health',
  description: `Partner briefings and enquiries for ${CLOQ_DESCRIPTOR}.`,
}

const INTENT_COPY: Record<string, { title: string; lead: string; bullets: readonly string[] }> = {
  'cpo-briefing': {
    title: 'CPO briefing — BodycloQ score',
    lead: 'Tell us your cohort size and sector. We will outline BodycloQ, Q cue delivery, and Peak Window ROI.',
    bullets: [
      'Connect existing Oura, Whoop, or Apple Watch — feeds BodycloQ, no new hardware',
      'BodycloQ scores circadian alignment; Q delivers light, timing, and movement cues daily',
      'Pilot design: 10–50 professionals, score movement, productivity recovery model',
      'Founding partner pricing — circadian nootropics for your cohort',
    ],
  },
}

type ContactPageProps = {
  searchParams: Promise<{ intent?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { intent } = await searchParams
  const intentBlock = intent && INTENT_COPY[intent] ? INTENT_COPY[intent] : null
  const mailSubject =
    intent === 'cpo-briefing' ? 'BodycloQ%20CPO%20briefing' : 'CLOQ%20Health%20enquiry'

  return (
    <MarketingPublicShell>
      <main className="kz-detail mx-auto max-w-[76rem] px-5 pb-16 pt-[calc(var(--kz-nav-height,4.5rem)+2rem)] sm:px-6">
        <p className="kz-ey">Contact</p>
        <h1 className="kz-h1 mt-4 max-w-3xl text-[clamp(2rem,4vw,3rem)]">
          {intentBlock?.title ?? 'Partner with CLOQ Health'}
        </h1>
        <p className="kz-sup mt-4 max-w-3xl">
          {intentBlock?.lead ??
            `Email ${CLOQ_HEALTH_LEGAL_NAME} for founding partner briefings, pilot design, and product questions.`}
        </p>
        {intentBlock?.bullets ? (
          <ul className="mt-6 max-w-3xl list-none space-y-2 pl-0">
            {intentBlock.bullets.map((item) => (
              <li key={item} className="flex gap-2 text-[15px] leading-relaxed text-[var(--kz-ink-muted)]">
                <span aria-hidden>—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <section
          className={cn(
            'mt-10 max-w-3xl rounded-2xl border border-black/[0.08] bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] sm:mt-12 sm:p-6'
          )}
        >
          <div className="flex items-stretch gap-4 sm:gap-5">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl sm:w-24">
              <Image
                src={GRANT_MUNRO_FOUNDER.profileImage}
                alt={GRANT_MUNRO_FOUNDER.profileImageAlt}
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-medium tracking-tight sm:text-2xl">
                {GRANT_MUNRO_FOUNDER.name}
              </h2>
              <p className="mt-1 text-sm text-[var(--kz-ink-muted)]">{GRANT_MUNRO_FOUNDER.role}</p>
            </div>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-[var(--kz-ink-muted)]">
            {GRANT_MUNRO_FOUNDER.overview[0]}
          </p>
        </section>

        <ul className="mt-8 flex max-w-3xl flex-col gap-4 text-[15px]">
          <li>
            <span className="kz-ey block">Email</span>
            <a
              href={`mailto:${PARTNERSHIP_EMAIL}?subject=${mailSubject}`}
              className="mt-1 inline-block font-medium underline underline-offset-4 hover:opacity-80"
            >
              {PARTNERSHIP_EMAIL}
            </a>
          </li>
          <li>
            <span className="kz-ey block">Briefing</span>
            <Link
              href={MARKETING_ROUTES.cpoBriefing}
              className="mt-1 inline-block font-medium underline underline-offset-4 hover:opacity-80"
            >
              Request CPO briefing →
            </Link>
          </li>
          <li>
            <span className="kz-ey block">Home</span>
            <Link
              href="/"
              className="mt-1 inline-block font-medium underline underline-offset-4 hover:opacity-80"
            >
              Back to CLOQ Health →
            </Link>
          </li>
        </ul>
      </main>
    </MarketingPublicShell>
  )
}
