import { motion } from 'framer-motion'
import { Container, DrawnRule, SectionIntro } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { EASE, VIEWPORT } from '../lib/motion'
import { skills } from '../data/content'

const categories = Object.entries(skills) as [string, string[]][]

/**
 * Capability matrix. One row per discipline, read as an index rather than a tag
 * cloud: the discipline carries the weight and the tools sit beside it.
 */
function CapabilityRow({
  category,
  items,
  index,
}: {
  category: string
  items: string[]
  index: number
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE.expo, delay: index * 0.06 }}
    >
      <motion.span
        className="absolute inset-x-0 top-0 h-px origin-left bg-line-hi"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: EASE.expo, delay: index * 0.06 }}
      />
      {/* Hover wash */}
      <span className="pointer-events-none absolute inset-0 origin-top scale-y-0 bg-gradient-to-b from-copper/[0.09] to-transparent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-y-100" />

      <div className="relative grid gap-4 py-8 md:grid-cols-12 md:gap-8 md:py-10">
        <div className="flex items-baseline gap-4 md:col-span-4">
          <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-amber md:text-[2rem]">
            {category}
          </h3>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2.5 md:col-span-7 md:col-start-6">
          {items.map((item, i) => (
            <span key={item} className="flex items-baseline">
              <span
                data-cursor="link"
                className="cursor-default text-[0.95rem] text-muted transition-colors duration-300 hover:text-ivory md:text-[1.05rem]"
              >
                {item}
              </span>
              {i < items.length - 1 && <span className="px-2.5 text-copper/60">·</span>}
            </span>
          ))}
        </div>

        <span className="hidden self-center justify-self-end font-mono text-[10px] tracking-[0.16em] text-faint md:col-span-1 md:block">
          {String(items.length).padStart(2, '0')}
        </span>
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const total = categories.reduce((sum, [, items]) => sum + items.length, 0)

  return (
    <section id="skills" className="relative bg-bg-secondary py-24 md:py-36">
      <Container>
        <DrawnRule className="mb-16 md:mb-24" />

        <SectionIntro
          index="04"
          label="Capabilities"
          lines={[
            'A working toolkit,',
            <>
              not a <span className="font-serif italic text-amber">checklist</span>.
            </>,
          ]}
          lead={
            <>
              {total} tools and disciplines, grouped by how they actually get used — offensive
              tooling next to the backend work that makes findings actionable.
            </>
          }
        />

        <div className="mt-20 md:mt-28">
          {categories.map(([category, items], index) => (
            <CapabilityRow key={category} category={category} items={items} index={index} />
          ))}
          <div className="h-px w-full bg-line-hi" />
        </div>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
          <span className="mono text-faint">Also comfortable with</span>
          <span className="max-w-[52ch] text-sm leading-relaxed text-ivory/70">
            AI-assisted development and prompt engineering as part of the daily loop — used to move
            faster on detection logic and documentation, not to skip the reasoning.
          </span>
        </Reveal>
      </Container>
    </section>
  )
}
