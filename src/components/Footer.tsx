import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Container } from './ui/Section'
import { Magnetic } from './ui/Magnetic'
import { EASE, VIEWPORT } from '../lib/motion'
import { profile } from '../data/content'

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]

/** Live clock in the timezone Saksham actually works from. */
function LocalTime() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    })

    const update = () => setTime(formatter.format(new Date()))
    update()
    const interval = window.setInterval(update, 30_000)
    return () => window.clearInterval(interval)
  }, [])

  return <span className="tabular-nums">{time} IST</span>
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-hi bg-void pt-20 md:pt-28">
      <Container>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="eyebrow">Let&rsquo;s work together</p>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="link"
              className="wipe mt-5 block w-fit font-display text-[1.6rem] leading-tight tracking-[-0.02em] text-ink transition-colors duration-500 hover:text-amber md:text-[2.1rem]"
            >
              {profile.email}
            </a>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-muted">
              Security engineering, detection systems and backend work — currently based in{' '}
              {profile.location}.
            </p>
          </div>

          <nav className="md:col-span-3 md:col-start-7">
            <p className="mono text-faint">Navigate</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {NAV.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    data-cursor="link"
                    className="wipe w-fit text-sm text-muted transition-colors duration-500 hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3 md:col-start-10">
            <p className="mono text-faint">Elsewhere</p>
            <ul className="mt-5 flex flex-col gap-2.5">
              {[
                { label: 'GitHub', url: profile.githubUrl },
                { label: 'LinkedIn', url: profile.linkedinUrl },
                { label: `Call ${profile.phone}`, url: `tel:${profile.phone}` },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    target={link.url.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    data-cursor="link"
                    className="wipe w-fit text-sm text-muted transition-colors duration-500 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Signature type — outlined, filling in as it enters view */}
        <motion.div
          className="mt-20 md:mt-28"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 1.2, ease: EASE.expo }}
        >
          <h2 className="group whitespace-nowrap text-center font-display text-[clamp(3rem,15.5vw,19rem)] uppercase leading-[0.8] tracking-[-0.045em]">
            <span className="stroke-type transition-colors duration-1000 ease-[var(--ease-expo)] hover:text-ink">
              Saksham
            </span>
          </h2>
        </motion.div>

        <div className="mt-10 flex flex-col-reverse items-start justify-between gap-6 border-t border-line py-8 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-faint">
            <span>
              © {new Date().getFullYear()} {profile.name}
            </span>
            <span className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-amber" />
              <LocalTime />
            </span>
            <span>Designed &amp; built with intent</span>
          </div>

          <Magnetic strength={0.3}>
            <a
              href="#top"
              data-cursor="arrow"
              className="group inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ivory shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] transition-all duration-500 hover:text-amber hover:shadow-[inset_0_0_0_1px_rgba(240,180,41,0.45)]"
            >
              Back to top
              <span className="grid h-7 w-7 place-items-center rounded-full bg-ivory/10 transition-transform duration-500 ease-[var(--ease-swift)] group-hover:-translate-y-[3px]">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M6 11V1M6 1L1.5 5.5M6 1l4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </a>
          </Magnetic>
        </div>
      </Container>
    </footer>
  )
}
