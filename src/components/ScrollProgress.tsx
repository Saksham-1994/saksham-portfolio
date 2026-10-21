import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Page-level read position: a hairline gradient across the top edge plus a mono
 * percentage in the corner. The readout is throttled through a motion value
 * subscription rather than React state on every scroll tick.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.0005 })
  const percent = useTransform(scrollYProgress, (value) => Math.round(value * 100))
  const [readout, setReadout] = useState(0)

  useEffect(() => percent.on('change', setReadout), [percent])

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-[55] h-px origin-left bg-gradient-to-r from-copper via-gold to-ember"
        style={{ scaleX }}
        aria-hidden
      />
      <div
        className="fixed bottom-6 right-6 z-[55] hidden font-mono text-[10px] tracking-[0.2em] text-faint md:block"
        aria-hidden
      >
        {String(readout).padStart(2, '0')} / 100
      </div>
    </>
  )
}
