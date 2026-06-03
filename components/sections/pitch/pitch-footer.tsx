import Image from 'next/image'
import Link from 'next/link'

import { DIOS_TAGLINE } from '@/components/DiosLogo'
import { HashLink } from '@/components/sections/HashLink'
import {
  DIOS_MISSION_STATEMENT,
  LANDING_FOOTER_SECTIONS,
  type FooterNavLink,
} from '@/components/sections/navigation'

function FooterNavItem({ link }: { link: FooterNavLink }) {
  const className =
    'text-[13px] leading-snug text-[#0D0D0D]/60 transition-colors hover:text-[#0D0D0D]/90'

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
    <footer className="pitch-footer relative overflow-hidden border-t border-black/10 bg-transparent">
      <div className="relative z-10 mx-auto max-w-[76rem] px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,2fr)] lg:gap-12">
          <div className="flex max-w-md flex-col gap-4">
            <Link href="/" className="w-fit" aria-label={`DIOS — ${DIOS_TAGLINE}`}>
              <Image
                src="/DIOS icon black.png"
                alt="DIOS icon"
                width={68}
                height={68}
                className="h-[68px] w-[68px]"
                priority
              />
            </Link>
            <p className="text-xl font-medium tracking-tight text-[#0D0D0D]/90 sm:text-2xl">
              {DIOS_MISSION_STATEMENT}
            </p>
          </div>

          <nav
            className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
            aria-label="Site"
          >
            {LANDING_FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0D0D0D]/40">
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

        <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[#0D0D0D]/45">© {new Date().getFullYear()} DIOS</p>
          <p className="text-[12px] text-[#0D0D0D]/45">{DIOS_TAGLINE}</p>
        </div>
      </div>
    </footer>
  )
}
