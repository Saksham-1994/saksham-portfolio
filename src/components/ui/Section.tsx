import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE, VIEWPORT } from '../../lib/motion'
import { MaskLines } from './Text'
import { Reveal } from './Reveal'

/** Shared page gutter and max width. Keeps every section on the same grid. */
export function Container({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={`mx-auto w-full max-w-[1480px] px-5 md:px-10 ${className}`}>{children}</div>
}

/**
 * Hairline rule that draws itself from left to right when scrolled into view.
 * Used as the top edge of every section instead of a static border.
 */
export function DrawnRule({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={`h-px origin-left bg-line-hi ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE.expo }}
    />
  )
}

/**
 * Section opener: numbered mono label, masked headline, optional lead column.
 * Every section uses this so the vertical rhythm is identical throughout.
 */
export function SectionIntro({
  index,
  label,
  lines,
  lead,
  className = '',
  headingClassName = 'font-display text-[2.4rem] leading-[1.04] tracking-[-0.03em] text-ink sm:text-[3.4rem] md:text-[4.4rem]',
}: {
  index: string
  label: string
  lines: ReactNode[]
  lead?: ReactNode
  className?: string
  headingClassName?: string
}) {
  return (
    <div className={className}>
      <Reveal distance={20}>
        <div className="flex items-center gap-4">
          <span className="mono text-faint">{index}</span>
          <span className="h-px w-8 bg-line-hi" />
          <span className="eyebrow">{label}</span>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-10 md:mt-12 md:grid-cols-12 md:gap-8">
        <MaskLines
          as="h2"
          lines={lines}
          className={`md:col-span-7 ${headingClassName}`}
        />
        {lead ? (
          <Reveal
            delay={0.15}
            className="max-w-[46ch] self-end text-[0.98rem] leading-relaxed text-muted md:col-span-4 md:col-start-9"
          >
            {lead}
          </Reveal>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Double-bezel enclosure: outer tray with a hairline top highlight, inner plate
 * with a concentric radius. Nothing premium sits flat on the background.
 */
export function Bezel({
  children,
  className = '',
  innerClassName = '',
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
}) {
  return (
    <div className={`bezel ${className}`}>
      <div className={`bezel-inner ${innerClassName}`}>{children}</div>
    </div>
  )
}

/** Small pill used for stack tags and metadata chips. */
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.09)] transition-colors duration-500 ${className}`}
    >
      {children}
    </span>
  )
}

/** Staggered chip row. */
export function ChipRow({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
    >
      {items.map((item) => (
        <motion.span
          key={item}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.expo } },
          }}
        >
          <Chip>{item}</Chip>
        </motion.span>
      ))}
    </motion.div>
  )
}
