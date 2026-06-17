/** Static hero backdrop — matches clq hero scrim when media assets are unavailable */
export function LandingHeroMedia() {
  return (
    <div className="clq-hero__media" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(165deg, rgb(245 239 243) 0%, rgb(250 250 247) 42%, rgb(232 213 226) 100%)',
        }}
      />
      <div className="clq-hero__scrim" />
    </div>
  )
}
