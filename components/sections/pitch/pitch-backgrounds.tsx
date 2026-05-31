/** Soft drifting shadow layers — replaces editorial line-art SVGs */

type PitchShadowVariant = 0 | 1 | 2 | 3 | 4

type ShadowOrb = {
  top: string
  left: string
  width: string
  height: string
  gradient: string
  animation: string
  duration: number
  delay: number
}

const ORB_PRESETS: ShadowOrb[][] = [
  [
    {
      top: '-18%',
      left: '-12%',
      width: '72%',
      height: '68%',
      gradient: 'radial-gradient(ellipse at center, rgba(12, 22, 20, 0.95) 0%, transparent 72%)',
      animation: 'pitch-shadow-drift-a',
      duration: 32,
      delay: 0,
    },
    {
      top: '42%',
      left: '58%',
      width: '64%',
      height: '58%',
      gradient: 'radial-gradient(ellipse at center, rgba(8, 14, 18, 0.88) 0%, transparent 70%)',
      animation: 'pitch-shadow-drift-b',
      duration: 38,
      delay: 4,
    },
    {
      top: '68%',
      left: '8%',
      width: '52%',
      height: '48%',
      gradient:
        'radial-gradient(ellipse at center, rgba(16, 163, 127, 0.07) 0%, rgba(6, 10, 12, 0.75) 42%, transparent 72%)',
      animation: 'pitch-shadow-drift-c',
      duration: 28,
      delay: 9,
    },
  ],
  [
    {
      top: '-8%',
      left: '38%',
      width: '68%',
      height: '62%',
      gradient: 'radial-gradient(ellipse at center, rgba(10, 18, 16, 0.92) 0%, transparent 71%)',
      animation: 'pitch-shadow-drift-b',
      duration: 34,
      delay: 2,
    },
    {
      top: '48%',
      left: '-16%',
      width: '58%',
      height: '54%',
      gradient: 'radial-gradient(ellipse at center, rgba(14, 12, 20, 0.85) 0%, transparent 68%)',
      animation: 'pitch-shadow-drift-c',
      duration: 40,
      delay: 7,
    },
    {
      top: '62%',
      left: '52%',
      width: '56%',
      height: '50%',
      gradient:
        'radial-gradient(ellipse at center, rgba(16, 163, 127, 0.06) 0%, rgba(5, 8, 10, 0.8) 45%, transparent 74%)',
      animation: 'pitch-shadow-drift-a',
      duration: 30,
      delay: 11,
    },
  ],
  [
    {
      top: '12%',
      left: '-14%',
      width: '70%',
      height: '64%',
      gradient: 'radial-gradient(ellipse at center, rgba(11, 20, 18, 0.9) 0%, transparent 70%)',
      animation: 'pitch-shadow-drift-c',
      duration: 36,
      delay: 1,
    },
    {
      top: '36%',
      left: '62%',
      width: '60%',
      height: '56%',
      gradient: 'radial-gradient(ellipse at center, rgba(9, 12, 16, 0.87) 0%, transparent 69%)',
      animation: 'pitch-shadow-drift-a',
      duration: 42,
      delay: 6,
    },
    {
      top: '72%',
      left: '22%',
      width: '54%',
      height: '46%',
      gradient:
        'radial-gradient(ellipse at center, rgba(16, 163, 127, 0.08) 0%, rgba(4, 6, 8, 0.78) 40%, transparent 73%)',
      animation: 'pitch-shadow-drift-b',
      duration: 26,
      delay: 13,
    },
  ],
  [
    {
      top: '-12%',
      left: '52%',
      width: '66%',
      height: '60%',
      gradient: 'radial-gradient(ellipse at center, rgba(13, 19, 17, 0.93) 0%, transparent 72%)',
      animation: 'pitch-shadow-drift-a',
      duration: 37,
      delay: 3,
    },
    {
      top: '52%',
      left: '-10%',
      width: '62%',
      height: '58%',
      gradient: 'radial-gradient(ellipse at center, rgba(7, 11, 15, 0.86) 0%, transparent 67%)',
      animation: 'pitch-shadow-drift-b',
      duration: 33,
      delay: 8,
    },
    {
      top: '58%',
      left: '48%',
      width: '50%',
      height: '52%',
      gradient:
        'radial-gradient(ellipse at center, rgba(16, 163, 127, 0.05) 0%, rgba(8, 10, 12, 0.82) 44%, transparent 75%)',
      animation: 'pitch-shadow-drift-c',
      duration: 29,
      delay: 15,
    },
  ],
  [
    {
      top: '6%',
      left: '18%',
      width: '74%',
      height: '66%',
      gradient: 'radial-gradient(ellipse at center, rgba(10, 16, 14, 0.91) 0%, transparent 71%)',
      animation: 'pitch-shadow-drift-b',
      duration: 35,
      delay: 5,
    },
    {
      top: '44%',
      left: '-18%',
      width: '56%',
      height: '52%',
      gradient: 'radial-gradient(ellipse at center, rgba(12, 10, 18, 0.84) 0%, transparent 68%)',
      animation: 'pitch-shadow-drift-c',
      duration: 41,
      delay: 10,
    },
    {
      top: '70%',
      left: '56%',
      width: '58%',
      height: '48%',
      gradient:
        'radial-gradient(ellipse at center, rgba(16, 163, 127, 0.07) 0%, rgba(6, 8, 10, 0.76) 43%, transparent 72%)',
      animation: 'pitch-shadow-drift-a',
      duration: 31,
      delay: 17,
    },
  ],
]

export function PitchShadowStyles() {
  return (
    <style>{`
      @keyframes pitch-shadow-drift-a {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        35% { transform: translate3d(6%, -4%, 0) scale(1.06); }
        70% { transform: translate3d(-5%, 5%, 0) scale(0.96); }
      }
      @keyframes pitch-shadow-drift-b {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        40% { transform: translate3d(-7%, 3%, 0) scale(1.04); }
        75% { transform: translate3d(5%, -6%, 0) scale(0.98); }
      }
      @keyframes pitch-shadow-drift-c {
        0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
        30% { transform: translate3d(4%, 6%, 0) scale(1.08); }
        65% { transform: translate3d(-6%, -3%, 0) scale(0.94); }
      }
      .pitch-shadow-orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(72px);
        will-change: transform;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .pitch-shadow-orb { animation: none !important; }
      }
    `}</style>
  )
}

export function PitchShadowBackdrop({ variant = 0 }: { variant?: PitchShadowVariant }) {
  const orbs = ORB_PRESETS[variant]

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(0, 0, 0, 0.65) 0%, transparent 55%)',
        }}
        aria-hidden
      />
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="pitch-shadow-orb"
          style={{
            top: orb.top,
            left: orb.left,
            width: orb.width,
            height: orb.height,
            background: orb.gradient,
            animationName: orb.animation,
            animationDuration: `${orb.duration}s`,
            animationDelay: `${orb.delay}s`,
          }}
          aria-hidden
        />
      ))}
    </div>
  )
}
