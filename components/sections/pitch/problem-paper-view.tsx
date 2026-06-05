import Link from 'next/link'
import { Download } from 'lucide-react'

import { CARD } from '@/components/sections/layout'
import { PitchFounderOrigin } from '@/components/sections/pitch/pitch-founder-origin'
import {
  GRANT_MUNRO_PROBLEM_PAPER,
  type GrantMunroProblemPaper,
} from '@/lib/pitch/grant-munro-problem-paper'
import { cn } from '@/lib/utils'

function PaperDownloadBar({ paper }: { paper: GrantMunroProblemPaper }) {
  return (
    <div
      className={cn(
        CARD,
        'sticky top-[calc(var(--dios-site-nav-height)+0.5rem)] z-20 mb-8 flex flex-col gap-4 rounded-[var(--calm-radius-card,8px)] border-black/10 bg-white/95 p-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-5'
      )}
    >
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">Download</p>
        <p className="mt-1 truncate text-sm font-medium text-black sm:text-base">{paper.title}</p>
        <p className="mt-0.5 text-xs text-black/55">
          {paper.author.name} · {paper.published}
        </p>
      </div>
      <a
        href={paper.pdfPath}
        download={paper.pdfFilename}
        className="dios-btn-on-light shrink-0 gap-2"
      >
        <Download className="h-4 w-4" aria-hidden />
        Download PDF
      </a>
    </div>
  )
}

function PaperSection({ section }: { section: GrantMunroProblemPaper['sections'][number] }) {
  return (
    <section id={section.id} className="scroll-mt-[calc(var(--dios-site-nav-height)+5rem)]">
      <h2 className="text-xl font-medium tracking-tight text-black sm:text-2xl">{section.title}</h2>
      <div className="mt-4 space-y-4">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className="type-body text-base leading-relaxed text-black/75 sm:text-[17px]">
            {paragraph}
          </p>
        ))}
      </div>
      {'bullets' in section && section.bullets ? (
        <ul className="mt-4 flex flex-col gap-2.5 border-l border-[#C9973A]/35 pl-4">
          {section.bullets.map((bullet) => (
            <li key={bullet} className="type-body text-sm leading-relaxed text-black/70 sm:text-base">
              {bullet}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}

export function ProblemPaperView({ paper = GRANT_MUNRO_PROBLEM_PAPER }: { paper?: GrantMunroProblemPaper }) {
  return (
    <article className="mx-auto w-full max-w-[48rem] px-5 pb-16 sm:px-6">
      <PaperDownloadBar paper={paper} />

      <header className="border-b border-black/10 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-black/50">{paper.eyebrow}</p>
        <h1 className="type-section mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">{paper.title}</h1>
        <p className="type-body mt-4 text-lg leading-relaxed text-black/65">{paper.subtitle}</p>

        <div className="mt-6 flex flex-col gap-1 border-l-2 border-[#C9973A] pl-4">
          <p className="text-base font-medium text-black">{paper.author.name}</p>
          <p className="text-sm text-black/60">{paper.author.role}</p>
          <p className="font-mono text-xs text-black/45">{paper.author.affiliation}</p>
          <p className="mt-1 font-mono text-xs text-black/40">{paper.published}</p>
        </div>
      </header>

      <PitchFounderOrigin className="mt-10" />

      <section className="mt-10">
        <h2 className="text-xl font-semibold tracking-tight text-black sm:text-2xl">
          Your medicine was designed without knowing what time your body thinks it is
        </h2>
        <div className="mt-4 space-y-4">
          <p className="type-body text-base leading-relaxed text-black/75 sm:text-[17px]">
            Your body runs on a 24-hour biological clock. Every organ, every hormone, every metabolic
            process has a time of day when it works best — and a time when it is less active. This is
            not a metaphor. It is measurable biology, governed by clock genes that have been running
            in every living thing for 600 million years.
          </p>
          <p className="type-body text-base leading-relaxed text-black/75 sm:text-[17px]">
            Medicine was developed assuming this clock either did not matter or was the same for
            everyone. So we take statins in the morning because that is convenient. We take blood
            pressure tablets at breakfast because the trial said once daily. We take metformin with
            meals because food is the only timing cue the system captures. Nobody asks what time your
            body clock thinks it is.
          </p>
          <p className="type-body text-base leading-relaxed text-black/75 sm:text-[17px]">
            The UK Biobank study of 80,000 people showed that people whose light-dark cycle is
            disrupted age metabolically faster, develop metabolic disease earlier, and die sooner.
            This is not about sleep hygiene. It is about the fundamental mismatch between
            standardised medicine and individual biology.
          </p>
          <p className="type-body text-base leading-relaxed text-black/75 sm:text-[17px]">
            DIOS is built to close that gap. Not by changing what you take. By measuring when your
            clock says to take it — and giving that information to your GP in a form they can act on.
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-mono text-xs uppercase tracking-widest text-black/50">Abstract</h2>
        <p className="type-body mt-4 text-base leading-relaxed text-black/75 sm:text-[17px]">{paper.abstract}</p>
      </section>

      <div className="mt-12 flex flex-col gap-12 sm:gap-14">
        {paper.sections.map((section) => (
          <PaperSection key={section.id} section={section} />
        ))}
      </div>

      <section className={cn(CARD, 'mt-14 rounded-[var(--calm-radius-card,8px)] p-5 sm:p-6')}>
        <h2 className="font-mono text-xs uppercase tracking-widest text-black/50">References</h2>
        <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5">
          {paper.references.map((reference) => (
            <li key={reference.href} className="pl-1 text-sm sm:text-base">
              <a
                href={reference.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-black/80 underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black/40"
              >
                {reference.label}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/"
          className="dios-btn-on-light"
        >
          Back to landing
        </Link>
        <Link href="/evidence" className="dios-btn-on-light--secondary">
          Our circadian model
        </Link>
        <a
          href={paper.pdfPath}
          download={paper.pdfFilename}
          className="dios-btn-on-light--secondary gap-2"
        >
          <Download className="h-4 w-4" aria-hidden />
          Download PDF
        </a>
      </div>
    </article>
  )
}
