/** Fixed full-viewport navy / sunset drift — shared by every dark-shell route. */
export function DarkAmbientBackground() {
  return (
    <div className="deepdose-ambient" aria-hidden>
      <div className="deepdose-ambient__orb deepdose-ambient__orb--navy" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--sunset" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--twilight" />
      <div className="deepdose-ambient__orb deepdose-ambient__orb--ember" />
      <div className="deepdose-ambient__veil" />
    </div>
  )
}
