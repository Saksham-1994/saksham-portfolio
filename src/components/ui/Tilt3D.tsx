import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/**
 * Real z-axis tilt: the surface rotates toward the pointer inside a perspective
 * context, and a specular highlight tracks the same position so the card reads
 * as a physical plate catching light rather than a hover colour change.
 */
export function Tilt3D({
  children,
  className = '',
  /** Maximum rotation in degrees on each axis. */
  max = 7,
  lift = 8,
  glare = true,
}: {
  children: ReactNode
  className?: string
  max?: number
  lift?: number
  glare?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const config = { stiffness: 180, damping: 22, mass: 0.5 }
  const rotateX = useSpring(0, config)
  const rotateY = useSpring(0, config)
  const z = useSpring(0, config)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareOpacity = useSpring(0, { stiffness: 140, damping: 24 })

  const glareBackground = useMotionTemplate`radial-gradient(320px circle at ${glareX}% ${glareY}%, rgba(255,214,138,0.14), transparent 62%)`

  function handleMove(event: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return

    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height

    rotateY.set((px - 0.5) * max * 2)
    rotateX.set((0.5 - py) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  function handleEnter() {
    z.set(lift)
    glareOpacity.set(1)
  }

  function handleLeave() {
    rotateX.set(0)
    rotateY.set(0)
    z.set(0)
    glareOpacity.set(0)
  }

  if (reduced) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={className} style={{ perspective: 1100 }}>
      <motion.div
        className="relative h-full"
        style={{ rotateX, rotateY, z, transformStyle: 'preserve-3d' }}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {children}
        {glare && (
          <motion.span
            className="pointer-events-none absolute inset-0 z-30 rounded-[26px]"
            style={{ background: glareBackground, opacity: glareOpacity }}
            aria-hidden
          />
        )}
      </motion.div>
    </div>
  )
}
