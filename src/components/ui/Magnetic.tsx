import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { SPRING } from '../../lib/motion'

/**
 * Pulls its children toward the pointer while it is over the element, then
 * releases them on a spring. Wrap buttons, links and small cards.
 */
export function Magnetic({
  children,
  className,
  /** Fraction of the pointer offset that is followed. */
  strength = 0.32,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING.magnetic)
  const y = useSpring(rawY, SPRING.magnetic)

  function handleMove(event: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((event.clientX - rect.left - rect.width / 2) * strength)
    rawY.set((event.clientY - rect.top - rect.height / 2) * strength)
  }

  function reset() {
    rawX.set(0)
    rawY.set(0)
  }

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

/**
 * Primary call to action. Pill body with the arrow nested in its own circular
 * well, which drifts diagonally under hover while the body compresses.
 */
export function ArrowButton({
  children,
  href,
  type,
  onClick,
  variant = 'solid',
  external = false,
  className = '',
}: {
  children: ReactNode
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  variant?: 'solid' | 'ghost'
  external?: boolean
  className?: string
}) {
  const solid = variant === 'solid'
  const body = (
    <>
      <span className="relative z-10 pl-1">{children}</span>
      <span
        className={`relative z-10 grid h-9 w-9 place-items-center rounded-full transition-all duration-500 ease-[var(--ease-swift)] group-hover:translate-x-[3px] group-hover:-translate-y-[2px] group-hover:scale-105 ${
          solid ? 'bg-void/12' : 'bg-ivory/10'
        }`}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
          <path
            d="M1 12L12 1M12 1H4M12 1V9"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </>
  )

  const classes = `group relative inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-transform duration-500 ease-[var(--ease-swift)] active:scale-[0.97] ${
    solid
      ? 'bg-ink text-void hover:bg-amber'
      : 'text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] hover:shadow-[inset_0_0_0_1px_rgba(240,180,41,0.55)]'
  } ${className}`

  return (
    <Magnetic strength={0.22} className="inline-block">
      {href ? (
        <a
          href={href}
          data-cursor="arrow"
          className={classes}
          {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
          {body}
        </a>
      ) : (
        <button type={type ?? 'button'} onClick={onClick} data-cursor="arrow" className={classes}>
          {body}
        </button>
      )}
    </Magnetic>
  )
}
