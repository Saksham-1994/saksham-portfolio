import { motion } from 'framer-motion'
import { Container, DrawnRule, SectionIntro } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { Tilt3D } from '../components/ui/Tilt3D'
import { EASE, VIEWPORT } from '../lib/motion'
import { achievements, certifications } from '../data/content'

/** Asymmetric spans so the grid never reads as a uniform card wall. */
const SPANS = [
  'md:col-span-3',
  'md:col-span-3',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-6',
]

export default function Certifications() {
  return (
    <section id="credentials" className="relative py-24 md:py-36">
      <Container>
        <DrawnRule className="mb-16 md:mb-24" />

        <SectionIntro
          index="05"
          label="Credentials"
          lines={[
            'Certified where it counts,',
            <>
              curious <span className="font-serif italic text-amber">everywhere</span> else.
            </>,
          ]}
          lead="Network defence, programming fundamentals and product practice — plus the leadership roles that came with running operations for a university tech body."
        />

        <div className="mt-20 grid grid-cols-1 gap-4 md:mt-28 md:grid-cols-6">
          {certifications.map((cert, index) => (
            <motion.article
              key={cert.name}
              className={`group ${SPANS[index] ?? 'md:col-span-2'}`}
              initial={{ opacity: 0, y: 34, filter: 'blur(7px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={VIEWPORT}
              transition={{ duration: 0.9, ease: EASE.expo, delay: (index % 3) * 0.09 }}
            >
              <Tilt3D className="h-full" max={6} lift={14}>
                <div className="bezel h-full">
                  <div
                    className="bezel-inner relative flex h-full flex-col justify-between gap-8 p-6 md:p-7"
                    data-cursor="link"
                  >
                    {/* Diagonal sheen on hover */}
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(115deg,transparent_35%,rgba(240,180,41,0.16),transparent_65%)] transition-transform duration-1000 ease-[var(--ease-expo)] group-hover:translate-x-full" />
                    <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_0_1px_rgba(240,180,41,0.4)] transition-opacity duration-700 group-hover:opacity-100" />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-copper">
                        Cert / {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-faint shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-colors duration-500 group-hover:text-amber">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path
                            d="M1 11L11 1M11 1H4M11 1V8"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </div>

                    <div className="relative" style={{ transform: 'translateZ(24px)' }}>
                      <h3 className="font-display text-[1.15rem] leading-snug text-ink md:text-[1.3rem]">
                        {cert.name}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-muted">{cert.issuer}</p>
                    </div>
                  </div>
                </div>
              </Tilt3D>
            </motion.article>
          ))}
        </div>

        {/* Leadership */}
        <div className="mt-24 md:mt-32">
          <Reveal distance={20} className="flex items-baseline justify-between gap-6">
            <p className="eyebrow">Leadership</p>
            <span className="mono text-faint">UPES</span>
          </Reveal>

          <div className="relative mt-10">
            <motion.div
              className="absolute left-0 top-0 hidden h-full w-px origin-top bg-gradient-to-b from-copper to-transparent md:block"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: EASE.expo }}
            />

            {achievements.map((item, index) => (
              <motion.div
                key={item.role}
                className="group relative flex flex-col gap-2 border-b border-line py-6 md:flex-row md:items-baseline md:gap-8 md:pl-8"
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.8, ease: EASE.expo, delay: index * 0.1 }}
              >
                <span className="absolute -left-[3px] top-8 hidden h-1.5 w-1.5 rounded-full bg-copper transition-colors duration-500 group-hover:bg-amber md:block" />
                <span className="font-mono text-[10px] tracking-[0.16em] text-faint md:w-32">
                  {item.period}
                </span>
                <span className="flex-1 font-display text-[1.3rem] leading-tight text-ink transition-colors duration-500 group-hover:text-amber md:text-[1.6rem]">
                  {item.role}
                </span>
                <span className="text-sm text-muted">{item.org}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
