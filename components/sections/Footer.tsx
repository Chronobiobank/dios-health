import Link from 'next/link'

import { CONTAINER, SECTION } from './layout'
import { FOOTER_EXPLORE_LINKS, FOOTER_LEGAL_LINKS } from './navigation'

const MISSION =
  'DIOS reads your body clock and finds the right time for every treatment — dose intelligence for clinicians, researchers, and patients.'

function FooterLinkList({ links, label }: { links: readonly { label: string; href: string }[]; label: string }) {
  return (
    <nav className="flex flex-col gap-3" aria-label={label}>
      {links.map((link) => (
        <Link key={link.label} href={link.href} className="type-nav w-fit transition-colors hover:text-black">
          {link.label}
        </Link>
      ))}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className={`${SECTION} ${CONTAINER}`}>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
        <div className="max-w-sm">
          <Link href="/" className="type-logo text-lg text-black sm:text-xl" aria-label="DIOS — home">
            DIOS
          </Link>
          <p className="type-body mt-4 text-sm leading-relaxed">{MISSION}</p>
        </div>

        <div>
          <p className="type-label mb-4">Explore</p>
          <FooterLinkList links={FOOTER_EXPLORE_LINKS} label="Explore" />
        </div>

        <div>
          <p className="type-label mb-4">Legal</p>
          <FooterLinkList links={FOOTER_LEGAL_LINKS} label="Legal" />
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-2 border-t border-black/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="type-caption">© {new Date().getFullYear()} DIOS Health</p>
        <p className="type-caption">Dose Intelligence</p>
      </div>
    </footer>
  )
}
