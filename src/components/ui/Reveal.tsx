import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'
import { EASE, VIEWPORT, staggerItem, staggerParent } from '../../lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Seconds added on top of any parent stagger. */
  delay?: number
  /** Travel distance in px. Use smaller values for dense lists. */
  distance?: number
  as?: ElementType
}

/**
 * The default scroll entrance for the whole site: heavy fade-up with a blur
 * resolve. Nothing on the page appears statically.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 44,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as 'div'] ?? motion.div

  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y: distance, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 1, ease: EASE.expo, delay },
        },
      }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Wraps a group of `<RevealItem>` children and releases them in sequence.
 * Use instead of hand-tuned per-child delays.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0.05,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
}) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={
        reduced
          ? staggerParent
          : { hidden: {}, visible: { transition: { staggerChildren: stagger, delayChildren: delay } } }
      }
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: ElementType
}) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as 'div'] ?? motion.div

  return (
    <MotionTag
      className={className}
      variants={
        reduced
          ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
          : staggerItem
      }
    >
      {children}
    </MotionTag>
  )
}
