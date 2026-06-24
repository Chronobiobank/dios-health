import { redirect } from 'next/navigation'

/** Legacy route — research partnerships live at /partners. */
export default function ResearchRedirectPage() {
  redirect('/partners')
}
