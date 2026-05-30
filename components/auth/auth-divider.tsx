type AuthDividerProps = {
  label?: string
}

export function AuthDivider({ label = 'or' }: AuthDividerProps) {
  return (
    <div className="relative my-6" aria-hidden={false}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-black/10" />
      </div>
      <p className="relative flex justify-center">
        <span className="bg-white px-3 font-mono text-[11px] uppercase tracking-widest text-black/45">
          {label}
        </span>
      </p>
    </div>
  )
}
