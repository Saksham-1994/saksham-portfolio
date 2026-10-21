import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EASE, VIEWPORT } from '../../lib/motion'

/**
 * Headline lines held under their own mask and pushed up in sequence.
 * Pass pre-split lines so line breaks stay art-directed instead of reflowing.
 */
export function MaskLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  /** Play immediately on mount instead of waiting for the viewport. */
  immediate = false,
  as: Tag = 'h2',
}: {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  immediate?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
}) {
  const reduced = useReducedMotion()
  const activation = immediate
    ? { animate: 'visible' as const }
    : { whileInView: 'visible' as const, viewport: VIEWPORT }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <motion.span
            className={`block ${lineClassName ?? ''}`}
            initial="hidden"
            variants={{
              hidden: reduced ? { opacity: 0 } : { y: '115%' },
              visible: reduced
                ? { opacity: 1, transition: { duration: 0.4 } }
                : {
                    y: '0%',
                    transition: { duration: 1.05, ease: EASE.drama, delay: delay + i * stagger },
                  },
            }}
            {...activation}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/**
 * Word-by-word entrance for body copy and mid-weight statements. Reads as
 * writing arriving rather than a block fading in.
 */
export function WordFlow({
  text,
  className,
  delay = 0,
  stagger = 0.022,
  highlight,
  highlightClassName = 'text-amber',
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  /** Words rendered in the accent colour. Matched case-insensitively. */
  highlight?: string[]
  highlightClassName?: string
}) {
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const hits = new Set((highlight ?? []).map((w) => w.toLowerCase()))

  return (
    <motion.p
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => {
        const bare = word.replace(/[^a-z0-9]/gi, '').toLowerCase()
        return (
          <motion.span
            key={`${word}-${i}`}
            className={`inline-block ${hits.has(bare) ? highlightClassName : ''}`}
            variants={{
              hidden: reduced ? { opacity: 0 } : { opacity: 0, y: '0.5em', filter: 'blur(5px)' },
              visible: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 0.7, ease: EASE.expo },
              },
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        )
      })}
    </motion.p>
  )
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>[]{}#$%&*+=@'

/**
 * Character decode. Thematically on-message for a security portfolio — reads
 * like a payload resolving — and gives labels a reason to animate.
 */
export function Scramble({
  text,
  className,
  /** ms per revealed character. */
  speed = 34,
  delay = 0,
}: {
  text: string
  className?: string
  speed?: number
  delay?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduced = useReducedMotion()
  // Seed with a same-length cipher so the decode never changes layout width.
  const [display, setDisplay] = useState(() =>
    text.replace(/[^ ]/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]),
  )

  useEffect(() => {
    if (!inView || reduced) {
      if (reduced) setDisplay(text)
      return
    }

    let revealed = 0
    let cycle: number | undefined
    let step: number | undefined

    const start = window.setTimeout(() => {
      cycle = window.setInterval(() => {
        let out = ''
        for (let i = 0; i < text.length; i++) {
          if (i < revealed) out += text[i]
          else if (text[i] === ' ') out += ' '
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        setDisplay(out)
      }, 42)

      step = window.setInterval(() => {
        revealed += 1
        if (revealed > text.length) {
          window.clearInterval(step)
          window.clearInterval(cycle)
          setDisplay(text)
        }
      }, speed)
    }, delay)

    return () => {
      window.clearTimeout(start)
      if (cycle) window.clearInterval(cycle)
      if (step) window.clearInterval(step)
    }
  }, [inView, reduced, text, speed, delay])

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  )
}
