import '@/styles/dios-blob-backdrop.css'

export function ColorBlobBackdrop() {
  return (
    <div className="dios-blob-backdrop" aria-hidden>
      <div className="dios-blob-backdrop__orb dios-blob-backdrop__orb--lilac" />
      <div className="dios-blob-backdrop__orb dios-blob-backdrop__orb--mortar" />
      <div className="dios-blob-backdrop__orb dios-blob-backdrop__orb--gold" />
      <div className="dios-blob-backdrop__orb dios-blob-backdrop__orb--spectrum" />
      <div className="dios-blob-backdrop__veil" />
    </div>
  )
}

interface MarketingBlobShellProps {
  children: React.ReactNode
}

export function MarketingBlobShell({ children }: MarketingBlobShellProps) {
  return (
    <div className="clq-site clq-site--blobs">
      <ColorBlobBackdrop />
      {children}
    </div>
  )
}
