import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion'
import { useRef, type ReactNode } from 'react'

/**
 * Translates its children against the scroll direction across the element's
 * full pass through the viewport. Positive speed drifts upward (slower than
 * the page), negative drifts downward.
 */
export function Parallax({
  children,
  className,
  speed = 0.16,
  style,
}: {
  children: ReactNode
  className?: string
  speed?: number
  style?: MotionStyle
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const shift = speed * 220
  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift])

  return (
    <div ref={ref} className={className}>
      <motion.div style={reduced ? style : { y, willChange: 'transform', ...style }}>
        {children}
      </motion.div>
    </div>
  )
}

/**
 * Image parallax inside a fixed-aspect plate. The image is oversized so it can
 * travel without ever exposing an edge, and it eases its own scale on scroll.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName = '',
  speed = 0.18,
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  speed?: number
  eager?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const travel = speed * 100
  const y = useTransform(scrollYProgress, [0, 1], [`${-travel}%`, `${travel}%`])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.16, 1.06, 1.16])

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ''}`}>
      <motion.img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={reduced ? undefined : { y, scale, willChange: 'transform' }}
        className={`h-full w-full object-cover ${imageClassName}`}
      />
    </div>
  )
}
