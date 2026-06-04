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
    duration: 18,
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
    duration: 20,
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
    duration: 19,
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
    duration: 21,
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
    duration: 23,
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
    duration: 17,
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
    duration: 22,
    delay: 14,
    opacity: 0.6,
  },
]

export function PitchShadowStyles() {
  return (
    <style>{`
      @keyframes pitch-shadow-drift-a {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        33% { transform: translate3d(14%, -10%, 0) scale(1.14); }
        66% { transform: translate3d(-12%, 12%, 0) scale(0.9); }
      }
      @keyframes pitch-shadow-drift-b {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        38% { transform: translate3d(-16%, 8%, 0) scale(1.12); }
        72% { transform: translate3d(12%, -12%, 0) scale(0.92); }
      }
      @keyframes pitch-shadow-drift-c {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        28% { transform: translate3d(10%, 14%, 0) scale(1.16); }
        62% { transform: translate3d(-14%, -8%, 0) scale(0.88); }
      }
      @keyframes pitch-backdrop-mesh {
        0%, 100% {
          transform: translate3d(0, 0, 0) scale(1);
          opacity: 0.92;
        }
        50% {
          transform: translate3d(2%, -2%, 0) scale(1.06);
          opacity: 1;
        }
      }
      .pitch-shadow-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(52px);
        will-change: transform;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
      }
      .pitch-landing-backdrop {
        background-color: #f7fafc;
        overflow: hidden;
      }
      .pitch-landing-backdrop__mesh {
        position: absolute;
        inset: -12%;
        background-image:
          radial-gradient(ellipse 140% 90% at 50% -10%, rgba(186, 230, 253, 0.38) 0%, transparent 55%),
          radial-gradient(ellipse 120% 70% at 80% 40%, rgba(254, 215, 170, 0.32) 0%, transparent 52%),
          radial-gradient(ellipse 100% 80% at 10% 70%, rgba(251, 207, 232, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse 130% 60% at 50% 100%, rgba(144, 205, 244, 0.26) 0%, transparent 58%);
        animation: pitch-backdrop-mesh 22s ease-in-out infinite;
        will-change: transform, opacity;
      }
      @media (prefers-reduced-motion: reduce) {
        .pitch-shadow-orb,
        .pitch-landing-backdrop__mesh {
          animation: none !important;
        }
      }
    `}</style>
  )
}

type PitchLandingBackdropProps = {
  /** Pinned to viewport — global ambient layer behind all pages (root layout) */
  fixed?: boolean
}

/** Pastel orb field — use `fixed` on home so the nav blurs real hues, not white body */
export function PitchLandingBackdrop({ fixed = false }: PitchLandingBackdropProps) {
  return (
    <div
      className={
        fixed
          ? 'pitch-landing-backdrop pointer-events-none fixed inset-0 z-0 overflow-hidden'
          : 'pitch-landing-backdrop absolute inset-0 min-h-full overflow-hidden'
      }
      aria-hidden
    >
      <div className="pitch-landing-backdrop__mesh" aria-hidden />
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
            animation: `${orb.animation} ${orb.duration}s ease-in-out ${orb.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
