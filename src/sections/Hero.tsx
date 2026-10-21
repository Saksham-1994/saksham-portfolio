import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import NetworkField from '../components/NetworkField'
import { ArrowButton } from '../components/ui/Magnetic'
import { Container } from '../components/ui/Section'
import { Scramble } from '../components/ui/Text'
import { EASE } from '../lib/motion'
import { education, profile } from '../data/content'

/**
 * Pinned opening. The section is taller than the viewport so the inner panel
 * can stay stuck while scroll progress drives the exit: the graph drifts up and
 * dims, the type recedes and blurs, and the next section arrives underneath.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const graphY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const graphOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])
  const graphScale = useTransform(scrollYProgress, [0, 1], [1, 1.18])

  // Deliberately no blur filter here: this element fills the viewport, and
  // animating a filter across it repaints the whole surface every frame.
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-32%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.93])

  const chromeOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0])

  return (
    <section ref={sectionRef} id="top" className="relative h-[190vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden">
        {/* Layer 1 — live graph */}
        <motion.div
          className="absolute inset-0 -z-20"
          style={reduced ? undefined : { y: graphY, opacity: graphOpacity, scale: graphScale }}
        >
          <NetworkField />
        </motion.div>

        {/* Layer 2 — vignette and floor gradient so type always holds contrast */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_35%,transparent_20%,var(--color-bg)_78%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-bg to-transparent" />

        {/* Layer 3 — column guides */}
        <div className="pointer-events-none absolute inset-0 -z-10 mx-auto max-w-[1480px] px-5 md:px-10">
          <div className="grid h-full grid-cols-4 md:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-full border-l border-line/60 ${i > 3 ? 'hidden md:block' : ''}`}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={ready ? { opacity: 1, scaleY: 1 } : {}}
                style={{ originY: 0 }}
                transition={{ duration: 1.6, ease: EASE.expo, delay: 0.2 + i * 0.04 }}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="flex flex-1 flex-col justify-center pt-28"
          style={reduced ? undefined : { y: contentY, opacity: contentOpacity, scale: contentScale }}
        >
          <Container>
            {/* Status */}
            <motion.div
              className="flex flex-wrap items-center gap-x-5 gap-y-3"
              initial={{ opacity: 0, y: 14 }}
              animate={ready ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: EASE.expo, delay: 0.15 }}
            >
              <span className="inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
                <span className="relative grid h-2 w-2 place-items-center">
                  <span className="absolute h-2 w-2 animate-ping rounded-full bg-amber/60" />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                </span>
                <span className="mono text-ivory/80">Currently at IBM</span>
              </span>
              {/* Held until the intro curtain is clear of the viewport */}
              <Scramble text={profile.roles.join(' / ')} className="eyebrow" delay={2300} />
            </motion.div>

            {/* Name */}
            <h1 className="mt-7 font-display uppercase leading-[0.82] tracking-[-0.045em] text-ink">
              {/* Clamped so the longer line cannot outrun the container on
                  ultra-wide displays or clip on narrow phones */}
              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="block text-[clamp(2.75rem,15vw,13rem)]"
                  initial={{ y: '115%' }}
                  animate={ready ? { y: '0%' } : {}}
                  transition={{ duration: 1.2, ease: EASE.drama, delay: 0.25 }}
                >
                  Saksham
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="stroke-type block text-[clamp(2.75rem,15vw,13rem)]"
                  initial={{ y: '115%' }}
                  animate={ready ? { y: '0%' } : {}}
                  transition={{ duration: 1.2, ease: EASE.drama, delay: 0.36 }}
                >
                  Srivastava
                </motion.span>
              </span>
            </h1>

            {/* Lead + actions */}
            <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12">
              <motion.div
                className="md:col-span-5"
                initial={{ opacity: 0, y: 26, filter: 'blur(8px)' }}
                animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ duration: 1, ease: EASE.expo, delay: 0.75 }}
              >
                <p className="max-w-[38ch] text-[1.02rem] leading-relaxed text-muted">
                  I build the systems that notice an attack before it lands —
                  <span className="text-ivory">
                    {' '}
                    real-time threat detection, security automation, and APIs that hold up under
                    scrutiny.
                  </span>
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ArrowButton href="#work">Selected work</ArrowButton>
                  <ArrowButton href="#contact" variant="ghost">
                    Get in touch
                  </ArrowButton>
                </div>
              </motion.div>

              <motion.dl
                className="grid grid-cols-2 gap-x-6 gap-y-7 self-end md:col-span-4 md:col-start-9"
                initial={{ opacity: 0, y: 26 }}
                animate={ready ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 1, ease: EASE.expo, delay: 0.9 }}
              >
                {[
                  { label: 'Focus', value: 'Threat detection' },
                  { label: 'Stack', value: 'Python · FastAPI · ML' },
                  { label: 'Based in', value: profile.location },
                  { label: 'Studying', value: 'B.Tech · Cyber Security' },
                ].map((item) => (
                  <div key={item.label} className="border-t border-line-hi pt-3">
                    <dt className="mono text-faint">{item.label}</dt>
                    <dd className="mt-1.5 text-sm text-ivory">{item.value}</dd>
                  </div>
                ))}
              </motion.dl>
            </div>
          </Container>
        </motion.div>

        {/* Footer chrome — fades out first so it never collides with the type */}
        <motion.div style={reduced ? undefined : { opacity: chromeOpacity }} className="pb-7">
          <Container className="flex items-end justify-between gap-6">
            <motion.div
              className="flex flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.18em] text-faint"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.1 }}
            >
              <span>{education.school.split(',')[0]}</span>
              <span className="text-muted">{education.period}</span>
            </motion.div>

            <motion.a
              href="#about"
              data-cursor="link"
              className="group flex flex-col items-center gap-2.5 text-faint"
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <span className="mono transition-colors duration-500 group-hover:text-ivory">
                Scroll
              </span>
              <span className="relative block h-11 w-px overflow-hidden bg-line-hi">
                <motion.span
                  className="absolute left-0 top-0 h-1/2 w-full bg-gradient-to-b from-transparent to-amber"
                  animate={{ y: ['-100%', '200%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
              </span>
            </motion.a>
          </Container>
        </motion.div>
      </div>
    </section>
  )
}
