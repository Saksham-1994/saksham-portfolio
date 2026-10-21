import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChipRow, Container, DrawnRule, SectionIntro } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { EASE, SPRING } from '../lib/motion'
import { experience } from '../data/content'

export default function Experience() {
  const [active, setActive] = useState(0)
  const current = experience[active]
  const railRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 80%', 'end 60%'],
  })
  const railScale = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), {
    stiffness: 120,
    damping: 30,
  })

  return (
    <section id="experience" className="relative py-24 md:py-36">
      <Container>
        <DrawnRule className="mb-16 md:mb-24" />

        <SectionIntro
          index="03"
          label="Experience"
          lines={[
            'Four teams, one habit:',
            <>
              ship it, then <span className="font-serif italic text-amber">prove</span> it works.
            </>,
          ]}
          lead="From ransomware detection research at IBM to hardening SQL and cloud infrastructure on live systems."
        />

        <div ref={railRef} className="mt-20 grid gap-10 md:mt-28 md:grid-cols-12 md:gap-8">
          {/* Index */}
          <div className="relative md:col-span-4">
            {/* Rail fills as the section passes through the viewport */}
            <div className="absolute left-0 top-0 hidden h-full w-px bg-line md:block">
              <motion.div
                className="h-full w-full origin-top bg-gradient-to-b from-amber via-copper to-transparent"
                style={{ scaleY: railScale }}
              />
            </div>

            <div className="flex flex-col md:pl-7">
              {experience.map((item, index) => {
                const selected = index === active
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(index)}
                    data-cursor="link"
                    aria-pressed={selected}
                    className="group relative border-b border-line py-5 text-left"
                  >
                    {selected && (
                      <motion.span
                        layoutId="experience-marker"
                        className="absolute -left-7 top-1/2 hidden h-8 w-[2px] -translate-y-1/2 bg-amber md:block"
                        transition={SPRING.snappy}
                      />
                    )}
                    <div className="flex items-baseline justify-between gap-4">
                      <span
                        className={`font-display text-[1.35rem] leading-tight transition-colors duration-500 md:text-[1.6rem] ${
                          selected ? 'text-ink' : 'text-muted group-hover:text-ivory'
                        }`}
                      >
                        {item.company}
                      </span>
                      <span
                        className={`font-mono text-[10px] tracking-[0.14em] transition-colors duration-500 ${
                          selected ? 'text-amber' : 'text-faint'
                        }`}
                      >
                        {item.period.split(' — ')[0]}
                      </span>
                    </div>
                    <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
                      {item.role}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Detail */}
          <Reveal className="md:col-span-8" distance={30}>
            <div className="bezel h-full">
              <div className="bezel-inner relative h-full p-6 md:p-10">
                {/* Watermark index */}
                <span
                  className="pointer-events-none absolute -top-2 right-4 select-none font-display text-[9rem] leading-none text-ivory/[0.03] md:text-[13rem]"
                  aria-hidden
                >
                  {String(active + 1).padStart(2, '0')}
                </span>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(6px)' }}
                    transition={{ duration: 0.6, ease: EASE.expo }}
                    className="relative"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <span className="overflow-hidden">
                        <motion.h3
                          className="block font-display text-[2rem] leading-none tracking-[-0.03em] text-ink md:text-[2.8rem]"
                          initial={{ y: '110%' }}
                          animate={{ y: '0%' }}
                          transition={{ duration: 0.9, ease: EASE.drama }}
                        >
                          {current.company}
                        </motion.h3>
                      </span>
                      <span className="mono rounded-full px-3 py-1.5 text-ember shadow-[inset_0_0_0_1px_rgba(240,180,41,0.3)]">
                        {current.location}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-muted">
                      {current.role} · {current.period}
                    </p>

                    <motion.ul
                      className="mt-9 flex flex-col gap-5"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: {},
                        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
                      }}
                    >
                      {current.bullets.map((bullet) => (
                        <motion.li
                          key={bullet}
                          className="flex gap-4 text-[0.95rem] leading-relaxed text-ivory/80"
                          variants={{
                            hidden: { opacity: 0, x: -14 },
                            visible: {
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.7, ease: EASE.expo },
                            },
                          }}
                        >
                          <span className="mt-2.5 h-px w-4 shrink-0 bg-copper" />
                          <span>{bullet}</span>
                        </motion.li>
                      ))}
                    </motion.ul>

                    <div className="mt-10 border-t border-line pt-7">
                      <ChipRow items={current.stack} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
