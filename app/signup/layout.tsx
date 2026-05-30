import { Nav } from '@/components/sections/Nav'

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#0D0D0D]">
      <Nav />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  )
}
