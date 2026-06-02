import Link from 'next/link'

import { DiosLogo, DIOS_TAGLINE } from '@/components/DiosLogo'
import { HashLink } from '@/components/sections/HashLink'
import {
  DIOS_MISSION_STATEMENT,
  LANDING_FOOTER_SECTIONS,
  type FooterNavLink,
} from '@/components/sections/navigation'

function FooterNavItem({ link }: { link: FooterNavLink }) {
  const className =
    'text-[13px] leading-snug text-white/55 transition-colors hover:text-white/90'

  if (link.href.includes('#')) {
    return (
      <HashLink href={link.href} className={className}>
        {link.label}
      </HashLink>
    )
  }

  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  )
}

export function PitchFooter() {
  return (
    <footer className="pitch-footer border-t border-white/10 bg-calm-bg">
      <div className="mx-auto max-w-[76rem] px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-12">
          <div className="flex max-w-md flex-col gap-4">
            <Link href="/" className="w-fit" aria-label={`DIOS — ${DIOS_TAGLINE}`}>
              <DiosLogo variant="white" size="xl" />
              <span className="mt-2 block font-mono text-[11px] uppercase tracking-[0.12em] text-white/45">
                {DIOS_TAGLINE}
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed text-white/55 sm:text-[15px]">
              {DIOS_MISSION_STATEMENT}
            </p>
          </div>

          <nav
            className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6"
            aria-label="Site"
          >
            {LANDING_FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/35">
                  {section.title}
                </p>
                <ul className="mt-3 flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <FooterNavItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/40">© {new Date().getFullYear()} DIOS Health</p>
          <p className="text-[12px] text-white/35">
            Medicine timed to your body clock — not European population averages.
          </p>
        </div>
      </div>
    </footer>
  )
}
