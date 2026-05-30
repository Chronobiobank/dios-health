const SCROLL_BUFFER_PX = 12

export function getSiteNavHeight(): number {
  const header = document.getElementById('site-nav')
  if (header) {
    return header.getBoundingClientRect().height
  }

  const root = document.documentElement
  const height = getComputedStyle(root).getPropertyValue('--dios-site-nav-height').trim()
  const parsed = Number.parseFloat(height)

  return Number.isFinite(parsed) ? parsed * (height.endsWith('rem') ? 16 : 1) : 64
}

export function scrollToSectionId(id: string, behavior: ScrollBehavior = 'smooth'): boolean {
  const target = document.getElementById(id)
  if (!target) return false

  const navHeight = getSiteNavHeight()
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - SCROLL_BUFFER_PX

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  })

  return true
}

export function parseHashHref(href: string): { path: string; hash: string | null } {
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) return { path: href, hash: null }

  const path = href.slice(0, hashIndex) || '/'
  const hash = href.slice(hashIndex + 1)
  return { path, hash: hash || null }
}
