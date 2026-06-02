/** Soft drifting pastel hues — full landing ambient layer */

type LandingOrb = {
  top: string
  left: string
  width: string
  height: string
  gradient: string
  animation: string
  duration: number
  delay: number
  opacity: number
}

const LANDING_ORBS: LandingOrb[] = [
  {
    top: '-8%',
    left: '-6%',
    width: '58%',
    height: '42%',
    gradient:
      'radial-gradient(ellipse at center, rgba(255, 154, 162, 0.82) 0%, rgba(255, 183, 197, 0.45) 38%, transparent 72%)',
    animation: 'pitch-shadow-drift-a',
    duration: 26,
    delay: 0,
    opacity: 0.72,
  },
  {
    top: '8%',
    left: '52%',
    width: '52%',
    height: '40%',
    gradient:
      'radial-gradient(ellipse at center, rgba(255, 214, 102, 0.78) 0%, rgba(255, 223, 140, 0.42) 36%, transparent 70%)',
    animation: 'pitch-shadow-drift-b',
    duration: 30,
    delay: 4,
    opacity: 0.68,
  },
  {
    top: '28%',
    left: '8%',
    width: '48%',
    height: '38%',
    gradient:
      'radial-gradient(ellipse at center, rgba(144, 205, 244, 0.8) 0%, rgba(179, 229, 252, 0.4) 34%, transparent 72%)',
    animation: 'pitch-shadow-drift-c',
    duration: 28,
    delay: 8,
    opacity: 0.7,
  },
  {
    top: '42%',
    left: '58%',
    width: '54%',
    height: '44%',
    gradient:
      'radial-gradient(ellipse at center, rgba(196, 181, 253, 0.76) 0%, rgba(216, 191, 255, 0.38) 36%, transparent 71%)',
    animation: 'pitch-shadow-drift-a',
    duration: 32,
    delay: 2,
    opacity: 0.66,
  },
  {
    top: '58%',
    left: '-4%',
    width: '50%',
    height: '40%',
    gradient:
      'radial-gradient(ellipse at center, rgba(154, 230, 180, 0.74) 0%, rgba(193, 240, 221, 0.36) 35%, transparent 70%)',
    animation: 'pitch-shadow-drift-b',
    duration: 34,
    delay: 11,
    opacity: 0.64,
  },
  {
    top: '72%',
    left: '44%',
    width: '56%',
    height: '42%',
    gradient:
      'radial-gradient(ellipse at center, rgba(255, 183, 197, 0.7) 0%, rgba(255, 214, 230, 0.34) 38%, transparent 72%)',
    animation: 'pitch-shadow-drift-c',
    duration: 27,
    delay: 6,
    opacity: 0.62,
  },
  {
    top: '88%',
    left: '12%',
    width: '62%',
    height: '38%',
    gradient:
      'radial-gradient(ellipse at center, rgba(129, 212, 250, 0.72) 0%, rgba(179, 229, 252, 0.34) 36%, transparent 71%)',
    animation: 'pitch-shadow-drift-a',
    duration: 31,
    delay: 14,
    opacity: 0.6,
  },
]

export function PitchShadowStyles() {
  return (
    <style>{`
      @keyframes pitch-shadow-drift-a {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        33% { transform: translate3d(9%, -6%, 0) scale(1.1); }
        66% { transform: translate3d(-7%, 8%, 0) scale(0.94); }
      }
      @keyframes pitch-shadow-drift-b {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        38% { transform: translate3d(-10%, 5%, 0) scale(1.08); }
        72% { transform: translate3d(8%, -8%, 0) scale(0.96); }
      }
      @keyframes pitch-shadow-drift-c {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        28% { transform: translate3d(6%, 9%, 0) scale(1.12); }
        62% { transform: translate3d(-9%, -5%, 0) scale(0.92); }
      }
      .pitch-shadow-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(56px);
        will-change: transform;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      .pitch-landing-backdrop {
        background-color: #f7fafc;
        background-image:
          radial-gradient(ellipse 140% 90% at 50% -10%, rgba(186, 230, 253, 0.35) 0%, transparent 55%),
          radial-gradient(ellipse 120% 70% at 80% 40%, rgba(254, 215, 170, 0.28) 0%, transparent 52%),
          radial-gradient(ellipse 100% 80% at 10% 70%, rgba(251, 207, 232, 0.26) 0%, transparent 50%),
          radial-gradient(ellipse 130% 60% at 50% 100%, rgba(144, 205, 244, 0.22) 0%, transparent 58%);
      }
      @media (prefers-reduced-motion: reduce) {
        .pitch-shadow-orb { animation: none !important; }
      }
    `}</style>
  )
}

/** Tall document layer — orbs span full scroll height (footer included) */
export function PitchLandingBackdrop() {
  return (
    <div className="pitch-landing-backdrop absolute inset-0 min-h-full overflow-hidden" aria-hidden>
      {LANDING_ORBS.map((orb, i) => (
        <div
          key={i}
          className="pitch-shadow-orb"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.width,
            height: orb.height,
            background: orb.gradient,
            opacity: orb.opacity,
            animationName: orb.animation,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
