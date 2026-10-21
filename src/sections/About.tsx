import { motion, useReducedMotion } from 'framer-motion'
import { Counter } from '../components/ui/Counter'
import { Magnetic } from '../components/ui/Magnetic'
import { ParallaxImage } from '../components/ui/Parallax'
import { Container, DrawnRule, SectionIntro } from '../components/ui/Section'
import { Reveal, RevealGroup, RevealItem } from '../components/ui/Reveal'
import { WordFlow } from '../components/ui/Text'
import { EASE, VIEWPORT, clipReveal } from '../lib/motion'
import { certifications, education, experience, profile, projects } from '../data/content'

const STATS = [
  { value: experience.length, label: 'Internships', suffix: '' },
  { value: projects.length, label: 'Systems shipped', suffix: '' },
  { value: certifications.length, label: 'Certifications', suffix: '' },
  { value: 7.53, label: 'CGPA / 10', decimals: 2 },
]

/** Rotating caption ring anchored to the portrait plate. */
function OrbitLabel() {
  const reduced = useReducedMotion()
  const text = 'Cyber Security · AI Developer · Backend · '

  return (
    <motion.svg
      viewBox="0 0 120 120"
      className="h-[104px] w-[104px] md:h-[128px] md:w-[128px]"
      animate={reduced ? undefined : { rotate: 360 }}
      transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <defs>
        <path id="orbit-ring" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" fill="none" />
      </defs>
      <circle cx="60" cy="60" r="59" fill="none" stroke="rgba(255,255,255,0.08)" />
      <text className="fill-amber font-mono text-[8.5px] uppercase tracking-[0.22em]">
        <textPath href="#orbit-ring">{text}</textPath>
      </text>
    </motion.svg>
  )
}

/** Corner brackets — the portrait framed the way a detector would frame it. */
function DetectionFrame() {
  const corners = [
    'left-3 top-3 border-l border-t',
    'right-3 top-3 border-r border-t',
    'left-3 bottom-3 border-b border-l',
    'right-3 bottom-3 border-b border-r',
  ]

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {corners.map((position, i) => (
        <motion.span
          key={position}
          className={`absolute h-7 w-7 border-amber/70 ${position}`}
          initial={{ opacity: 0, scale: 1.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.7, ease: EASE.snap, delay: 0.75 + i * 0.08 }}
        />
      ))}
    </div>
  )
}

export default function About() {
  const reduced = useReducedMotion()

  return (
    <section id="about" className="relative py-24 md:py-36">
      <Container>
        <DrawnRule className="mb-16 md:mb-24" />

        <SectionIntro
          index="01"
          label="About"
          lines={[
            'I think in systems —',
            <>
              the kind that fail <span className="font-serif italic text-amber">quietly</span>
            </>,
            'until someone is watching.',
          ]}
          lead={
            <>
              Third-year Computer Science student at UPES, specialising in cyber security. I spend my
              time where detection logic meets clean engineering.
            </>
          }
        />

        <div className="mt-20 grid gap-14 md:mt-28 md:grid-cols-12 md:gap-8">
          {/* Portrait plate */}
          <div className="relative md:col-span-5">
            <motion.div
              className="bezel group relative"
              variants={reduced ? undefined : clipReveal}
              initial="hidden"
              whileInView="visible"
              viewport={VIEWPORT}
              data-cursor="link"
            >
              <div className="bezel-inner relative">
                <DetectionFrame />

                <ParallaxImage
                  src="/saksham-portrait.jpg"
                  alt={`${profile.name}, Cyber Security Engineer`}
                  className="aspect-[4/5] w-full"
                  imageClassName="duotone"
                  speed={0.12}
                  eager
                />

                {/*
                 * Copper multiply maps the white studio backdrop into the
                 * palette. It steps back on hover so the real photograph reads.
                 */}
                <div className="pointer-events-none absolute inset-0 bg-copper opacity-80 mix-blend-multiply transition-opacity duration-[900ms] ease-[var(--ease-expo)] group-hover:opacity-0" />
                <div className="pointer-events-none absolute inset-0 bg-void/25 mix-blend-multiply transition-opacity duration-[900ms] group-hover:opacity-0" />

                {/* Warm floor so the plate sits into the card */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

                {/* Analysis sweep */}
                {!reduced && (
                  <motion.div
                    className="pointer-events-none absolute inset-x-0 z-10 h-24 bg-gradient-to-b from-transparent via-amber/12 to-transparent"
                    animate={{ y: ['-20%', '440%'] }}
                    transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                  />
                )}

                {/* Scan grid */}
                <div
                  className="pointer-events-none absolute inset-0 z-10 opacity-[0.14]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(240,180,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(240,180,41,0.5) 1px, transparent 1px)',
                    backgroundSize: '42px 42px',
                  }}
                />

                <div className="absolute inset-x-4 bottom-4 z-20 flex items-end justify-between gap-3">
                  <span className="rounded-full bg-void/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-ember backdrop-blur-sm">
                    Subject / verified
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ivory/60">
                    Dehradun · IN
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="absolute -right-3 -top-8 md:-right-10 md:-top-12">
              <OrbitLabel />
            </div>

            <Reveal delay={0.2} distance={20} className="mt-6 flex items-center justify-between">
              <span className="mono text-faint">Fig. 01 — {profile.name}</span>
              <div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                <Magnetic strength={0.4}>
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="wipe transition-colors duration-500 hover:text-amber"
                  >
                    GitHub
                  </a>
                </Magnetic>
                <Magnetic strength={0.4}>
                  <a
                    href={profile.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="link"
                    className="wipe transition-colors duration-500 hover:text-amber"
                  >
                    LinkedIn
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          {/* Narrative */}
          <div className="flex flex-col gap-14 md:col-span-6 md:col-start-7">
            <WordFlow
              text={profile.summary}
              className="text-[1.05rem] leading-[1.75] text-ivory/85 md:text-[1.18rem]"
              highlight={['Cyber', 'Security', 'threat', 'detection', 'automation']}
            />

            <div className="grid gap-10 sm:grid-cols-2">
              <Reveal distance={26}>
                <p className="eyebrow">Education</p>
                <h3 className="mt-4 font-display text-[1.35rem] leading-snug text-ink">
                  {education.school.split(',')[0]}
                </h3>
                <p className="mt-2 text-sm text-muted">{education.degree}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em]">
                  <span className="text-faint">{education.period}</span>
                  <span className="text-amber">{education.gpa}</span>
                </div>
              </Reveal>

              <RevealGroup>
                <RevealItem>
                  <p className="eyebrow">Coursework</p>
                </RevealItem>
                <ul className="mt-4 flex flex-col">
                  {education.coursework.map((course) => (
                    <RevealItem key={course} as="li">
                      <span className="flex items-baseline gap-3 border-b border-line py-2.5 text-sm text-ivory/80">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-copper" />
                        {course}
                      </span>
                    </RevealItem>
                  ))}
                </ul>
              </RevealGroup>
            </div>
          </div>
        </div>

        {/* Figures */}
        <div className="mt-24 grid grid-cols-2 gap-px md:mt-32 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              distance={30}
              className="group relative px-1 py-8 md:px-6"
            >
              <span className="absolute left-0 top-0 h-px w-full bg-line-hi" />
              <Counter
                value={stat.value}
                decimals={stat.decimals ?? 0}
                className="block font-display text-[3rem] leading-none tracking-[-0.04em] text-ink transition-colors duration-700 group-hover:text-amber md:text-[4rem]"
              />
              <span className="mt-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {stat.label}
              </span>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
