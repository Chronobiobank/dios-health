import { redirect } from 'next/navigation'

/** Legacy Real feed → main feed. */
export default function RealRedirectPage() {
  redirect('/grid')
}
