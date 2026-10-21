import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { EASE } from '../lib/motion'
import { useScrollLock } from '../lib/useScrollLock'
import { projects } from '../data/content'

const ASSETS = ['/saksham-portrait.jpg', ...projects.flatMap((p) => p.images.map((i) => i.src))]

/** Held long enough that the intro reads as intentional rather than a stall. */
const MIN_DURATION = 1500
const SLABS = 5

const STAGES = ['Initialising', 'Loading assets', 'Calibrating', 'Ready']

/**
 * Intro curtain driven by real asset progress. The counter interpolates toward
 * the true load ratio so it never jumps, and the panel exits as vertical slabs
 * lifting in sequence.
 */
export default function Loader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const loadedRatio = useRef(0)

  // Nothing scrolls underneath the curtain.
  useScrollLock(!leaving)

  useEffect(() => {
    const started = performance.now()
    let settled = 0

    function bump() {
      settled += 1
      loadedRatio.current = settled / ASSETS.length
    }

    ASSETS.forEach((src) => {
      const image = new Image()
      image.onload = bump
      image.onerror = bump
      image.src = src
    })

    if (ASSETS.length === 0) loadedRatio.current = 1

    let rafId = 0
    let shown = 0

    function tick(now: number) {
      const timeRatio = Math.min(1, (now - started) / MIN_DURATION)
      // Gate on whichever is slower: real bytes, or the minimum display time.
      const target = Math.min(loadedRatio.current, timeRatio) * 100
      shown += (target - shown) * 0.09
      setProgress(shown)

      if (target >= 99.5 && shown > 99) {
        setProgress(100)
        setLeaving(true)
        return
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(rafId)
  }, [])

  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor((progress / 100) * STAGES.length))]

  return (
    <AnimatePresence onExitComplete={onDone}>
      {!leaving && (
        <motion.div
          className="fixed inset-0 z-[100]"
          initial="visible"
          animate="visible"
          exit="exit"
          variants={{
            visible: {},
            exit: { transition: { staggerChildren: 0.07, staggerDirection: -1 } },
          }}
        >
          {/* Slabs form the backdrop and become the exit animation */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: SLABS }).map((_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1 bg-void"
                variants={{
                  visible: { y: '0%' },
                  exit: { y: '-100%', transition: { duration: 0.95, ease: EASE.drama } },
                }}
              />
            ))}
          </div>

          <motion.div
            className="relative flex h-full flex-col justify-between px-5 py-8 md:px-10 md:py-10"
            variants={{
              visible: { opacity: 1 },
              exit: { opacity: 0, transition: { duration: 0.35, ease: 'linear' } },
            }}
          >
            <div className="flex items-start justify-between">
              <span className="mono text-faint">Saksham Srivastava</span>
              <span className="mono text-faint">Portfolio / 2026</span>
            </div>

            <div className="flex flex-col items-start">
              <div className="overflow-hidden">
                <motion.h1
                  className="font-display text-[18vw] leading-[0.82] tracking-[-0.04em] text-ink md:text-[11vw]"
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, ease: EASE.drama, delay: 0.1 }}
                >
                  S<span className="text-amber">.</span>S
                </motion.h1>
              </div>
              <motion.p
                className="mono mt-4 text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                {stage}
              </motion.p>
            </div>

            <div className="flex items-end justify-between gap-8">
              <div className="h-px flex-1 bg-line-hi">
                <div
                  className="h-full bg-gradient-to-r from-copper to-ember"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="font-mono text-[12vw] leading-none text-ink tabular-nums md:text-[5vw]">
                {String(Math.round(progress)).padStart(3, '0')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
