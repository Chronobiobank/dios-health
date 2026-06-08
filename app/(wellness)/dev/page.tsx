import { notFound, redirect } from 'next/navigation'

export default function DevIndexPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  redirect('/dev/dashboard')
}
