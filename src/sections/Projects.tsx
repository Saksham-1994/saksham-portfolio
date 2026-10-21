import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { ArrowButton } from '../components/ui/Magnetic'
import { ParallaxImage } from '../components/ui/Parallax'
import { ChipRow, Container, DrawnRule, SectionIntro } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { EASE, VIEWPORT } from '../lib/motion'
import { useIsDesktop } from '../lib/useMediaQuery'
import { projects, type Project } from '../data/content'

const featured = projects.filter((project) => project.featured)
const secondary = projects.filter((project) => !project.featured)

/**
 * Screenshot viewer. The active shot cross-dissolves while the thumbnail rail
 * keeps the other views one click away, so multi-screen projects do not turn
 * into a stack of images.
 */
function Gallery({ project }: { project: Project }) {
  const [active, setActive] = useState(0)
  const shot = project.images[active]

  if (!shot) {
    return (
      <div className="relative flex h-full min-h-[220px] items-center justify-center overflow-hidden rounded-[18px] bg-bg-secondary">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(168,85,31,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,31,0.35) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />
        <span className="mono relative text-faint">No capture available</span>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative flex-1 overflow-hidden rounded-[18px] bg-void">
        <AnimatePresence mode="wait">
          <motion.div
            key={shot.src}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE.expo }}
          >
            <ParallaxImage
              src={shot.src}
              alt={shot.alt}
              className="h-full w-full"
              imageClassName="object-cover object-top"
              speed={0.08}
            />
          </motion.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-void/80 to-transparent" />
        <span className="pointer-events-none absolute bottom-3 left-4 font-mono text-[9px] uppercase tracking-[0.2em] text-ivory/70">
          {shot.alt.slice(0, 58)}
        </span>
      </div>

      {project.images.length > 1 && (
        <div className="flex gap-2">
          {project.images.map((image, index) => (
            <button
              key={image.src}
              onClick={() => setActive(index)}
              data-cursor="view"
              aria-label={`View ${image.alt}`}
              aria-pressed={index === active}
              className={`relative h-14 flex-1 overflow-hidden rounded-lg transition-all duration-500 ease-[var(--ease-swift)] ${
                index === active
                  ? 'opacity-100 shadow-[inset_0_0_0_1px_rgba(240,180,41,0.7)]'
                  : 'opacity-45 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:opacity-80'
              }`}
            >
              <img
                src={image.src}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * One featured project. On desktop the panel pins to the viewport and the next
 * project slides over it while this one recedes, so the set reads as a stack of
 * physical plates rather than a long scroll.
 */
function StackedProject({
  project,
  index,
  total,
}: {
  project: Project
  index: number
  total: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isDesktop = useIsDesktop()
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const isLast = index === total - 1
  const scale = useTransform(scrollYProgress, [0, 1], [1, isLast ? 1 : 0.92])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, isLast ? 1 : 0.4])
  const y = useTransform(scrollYProgress, [0, 1], [0, isLast ? 0 : -40])

  const pinned = isDesktop && !reduced

  return (
    <div
      ref={ref}
      className={pinned ? 'sticky top-0 flex h-[100svh] items-center' : 'relative'}
      style={{ zIndex: index + 1 }}
    >
      <motion.article
        className="bezel w-full"
        style={pinned ? { scale, opacity, y } : undefined}
      >
        <div className="bezel-inner grid gap-8 p-5 md:grid-cols-12 md:gap-7 md:p-7">
          <div className="flex flex-col md:col-span-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tracking-[0.2em] text-amber">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="h-px flex-1 bg-line-hi" />
              <span className="mono text-faint">Featured</span>
            </div>

            <h3 className="mt-6 font-display text-[1.8rem] leading-[1.08] tracking-[-0.03em] text-ink md:text-[2.35rem]">
              {project.title}
            </h3>
            <p className="mt-3 font-serif text-[1.05rem] italic text-amber">{project.tagline}</p>

            <ul className="mt-7 flex flex-col gap-3.5">
              {project.bullets.map((bullet) => (
                <motion.li
                  key={bullet}
                  className="flex gap-3.5 text-[0.9rem] leading-relaxed text-muted"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.7, ease: EASE.expo }}
                >
                  <span className="mt-2 h-px w-3.5 shrink-0 bg-copper" />
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </ul>

            <ChipRow items={project.stack} className="mt-auto pt-8" />
          </div>

          <div className="md:col-span-7">
            {/* Capped so a pinned panel never outgrows a short viewport */}
            <div className="h-[300px] md:h-[clamp(260px,42vh,460px)]">
              <Gallery project={project} />
            </div>
          </div>
        </div>
      </motion.article>
    </div>
  )
}

/**
 * Expanding index row for the supporting projects. Pointer devices reveal on
 * hover; the click state is tracked separately so touch users (who never fire
 * hover) can pin a row open without the two inputs cancelling each other.
 */
function SecondaryRow({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || pinned

  return (
    <motion.div
      className="group relative border-b border-line"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, ease: EASE.expo, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      {/* Accent wash that wipes in from the left */}
      <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-copper/12 to-transparent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />

      <button
        onClick={() => setPinned((value) => !value)}
        aria-expanded={open}
        data-cursor="link"
        className="relative flex w-full items-baseline gap-5 py-7 text-left md:gap-8"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
          {String(index + 3).padStart(2, '0')}
        </span>
        <span className="flex-1">
          <span className="block font-display text-[1.4rem] leading-tight text-ink transition-colors duration-500 group-hover:text-amber md:text-[1.9rem]">
            {project.title}
          </span>
          <span className="mt-1.5 block text-sm text-muted">{project.tagline}</span>
        </span>
        <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-faint md:block">
          {project.stack.join(' · ')}
        </span>
        <motion.span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ivory shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.5, ease: EASE.swift }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="relative overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE.swift }}
          >
            <ul className="flex flex-col gap-3 pb-8 pl-[2.6rem] md:max-w-[68ch]">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-ivory/75">
                  <span className="mt-2 h-px w-3 shrink-0 bg-copper" />
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="work" className="relative bg-bg-secondary py-24 md:py-36">
      <Container>
        <DrawnRule className="mb-16 md:mb-24" />

        <SectionIntro
          index="02"
          label="Selected Work"
          lines={[
            'Systems built to notice',
            <>
              what <span className="font-serif italic text-amber">shouldn&rsquo;t</span> be happening.
            </>,
          ]}
          lead="Detection engines, monitoring pipelines and hardened services — each one shipped end to end, from feature engineering through alerting."
        />
      </Container>

      {/* Pinned stack */}
      <Container className="mt-20 md:mt-28">
        <div className="flex flex-col gap-8 md:block">
          {featured.map((project, index) => (
            <StackedProject
              key={project.id}
              project={project}
              index={index}
              total={featured.length}
            />
          ))}
        </div>
      </Container>

      <Container className="mt-24 md:mt-32">
        <Reveal distance={20} className="flex items-baseline justify-between gap-6">
          <p className="eyebrow">More work</p>
          <span className="mono text-faint">{secondary.length} projects</span>
        </Reveal>

        <div className="mt-10 border-t border-line">
          {secondary.map((project, index) => (
            <SecondaryRow key={project.id} project={project} index={index} />
          ))}
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center gap-5">
          <ArrowButton href="https://github.com/Saksham-1994" variant="ghost" external>
            More on GitHub
          </ArrowButton>
          <span className="max-w-[34ch] text-sm text-muted">
            Source and work-in-progress builds live on GitHub.
          </span>
        </Reveal>
      </Container>
    </section>
  )
}
