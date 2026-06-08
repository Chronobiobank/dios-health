import { redirect } from 'next/navigation'

/** Legacy URL — measurement stack content now lives at /technology */
export default function LegacyTipTraqRedirect() {
  redirect('/technology')
}
