/** Legacy /problem → Mission. Keep href helpers for old links. */

export const PROBLEM_PAGE_HREF = '/mission' as const

export const PROBLEM_PAGE_HOME_LINK = {
  label: 'Mission',
  href: PROBLEM_PAGE_HREF,
} as const
