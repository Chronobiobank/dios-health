import { redirect } from 'next/navigation'

/** Legacy Real feed → Grid. */
export default function RealRedirectPage() {
  redirect('/grid')
}
