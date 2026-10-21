import type { Transition, Variants } from 'framer-motion'

/**
 * Shared easing curves. Every transition on the site resolves to one of these
 * so motion across sections feels like it came from one hand.
 */
export const EASE = {
  /** Long, soft settle. Default for reveals. */
  expo: [0.16, 1, 0.3, 1],
  /** Symmetric and cinematic. Curtains, masks, big type. */
  drama: [0.76, 0, 0.24, 1],
  /** Fast start, gentle landing. UI state changes. */
  swift: [0.32, 0.72, 0, 1],
  /** Aggressive. Snap-to-place accents. */
  snap: [0.87, 0, 0.13, 1],
} as const satisfies Record<string, [number, number, number, number]>

export const SPRING = {
  /** Weighted, no visible overshoot. Scroll reveals. */
  heavy: { type: 'spring', stiffness: 100, damping: 20, mass: 1 },
  /** Responsive with a hint of give. Magnetic elements. */
  magnetic: { type: 'spring', stiffness: 160, damping: 15, mass: 0.6 },
  /** Snappy. Accordions, indicators. */
  snappy: { type: 'spring', stiffness: 220, damping: 26 },
} as const satisfies Record<string, Transition>

/** Standard viewport config: fire once, slightly before the element is visible. */
export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' } as const

/**
 * Heavy fade-up used for section content. Blur is what stops it reading as a
 * generic `opacity + translateY` reveal.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE.expo },
  },
}

export const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: EASE.expo },
  },
}

/** Line held below a mask, then pushed up into place. */
export const maskLine: Variants = {
  hidden: { y: '115%' },
  visible: { y: '0%', transition: { duration: 1.05, ease: EASE.drama } },
}

/** Image plate wiping open from the bottom edge. */
export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
  visible: {
    clipPath: 'inset(0% 0% 0% 0%)',
    transition: { duration: 1.3, ease: EASE.drama },
  },
}
