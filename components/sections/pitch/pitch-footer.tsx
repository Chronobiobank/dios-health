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
  const className = 'pitch-footer__link'

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
  const year = new Date().getFullYear()

  return (
    <footer className="pitch-footer">
      <div className="pitch-footer__inner">
        <div className="pitch-footer__top">
          <div className="pitch-footer__brand">
            <Link
              href="/"
              className="pitch-footer__logo-link"
              aria-label={`DIOS — ${DIOS_TAGLINE}`}
            >
              <Image
                src="/DIOS icon black.png"
                alt=""
                width={76}
                height={76}
                className="pitch-footer__logo"
              />
            </Link>
            <p className="pitch-footer__mission">{DIOS_MISSION_STATEMENT}</p>
          </div>

          <nav className="pitch-footer__nav" aria-label="Site">
            {LANDING_FOOTER_SECTIONS.map((section) => (
              <div key={section.title}>
                <p className="pitch-footer__col-title">{section.title}</p>
                <ul className="pitch-footer__links">
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

        <div className="pitch-footer__bottom">
          <p className="pitch-footer__copy">© {year} DIOS</p>
          <p className="pitch-footer__tagline">{DIOS_TAGLINE}</p>
        </div>
      </div>
    </footer>
  )
}
