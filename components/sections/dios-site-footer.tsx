import Link from 'next/link'

import { DIOS_TAGLINE } from '@/components/DiosLogo'
import { LANDING_FOOTER_SECTIONS } from '@/components/sections/navigation'

export function DiosSiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="dios-site-footer dios-surface-dark" data-nav-surface="dark">
      <div className="dios-site-footer__inner">
        <p className="dios-site-footer__brand">
          <span>DIOS</span> — Dose Intelligence OS
        </p>

        <nav className="dios-site-footer__nav" aria-label="Site">
          {LANDING_FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="dios-site-footer__col">
              <p className="dios-on-dark-eyebrow dios-on-dark-eyebrow--accent">{section.title}</p>
              <ul className="dios-site-footer__links">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="dios-site-footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="dios-site-footer__bottom">
          <p className="dios-site-footer__copy">© {year} DIOS</p>
          <p className="dios-site-footer__tagline">{DIOS_TAGLINE}</p>
        </div>
      </div>
    </footer>
  )
}
