import { redirect } from 'next/navigation'

/** The Fix story now lives on Mission. */
export default function ProblemPage() {
  redirect('/mission')
}
