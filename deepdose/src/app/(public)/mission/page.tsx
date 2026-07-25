import { redirect } from 'next/navigation'

/** Mission story now lives on /how (How it works). */
export default function MissionPage() {
  redirect('/how')
}
