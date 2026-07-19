import { redirect } from 'next/navigation'

/** Legacy path — Sleep Lab is the home page. */
export default function SleepLabPage() {
  redirect('/')
}
