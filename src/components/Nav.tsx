import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { EASE, SPRING } from '../lib/motion'
import { useScrollLock } from '../lib/useScrollLock'
import { profile } from '../data/content'

const LINKS = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [lifted, setLifted] = useState(false)
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setLifted(window.scrollY > 60)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section tracking via IntersectionObserver — no scroll-position maths, no reflow.
  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  // The overlay owns the viewport while it is open.
  useScrollLock(open)

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[58] px-5 pt-4 md:px-10 md:pt-6"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE.expo, delay: 0.35 }}
      >
        <div
          className={`mx-auto flex max-w-[1480px] items-center justify-between gap-6 rounded-full py-2.5 pl-6 pr-2.5 transition-all duration-700 ease-[var(--ease-swift)] ${
            lifted
              ? 'bg-void/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl'
              : 'bg-transparent shadow-none'
          }`}
        >
          <a href="#top" className="font-display text-[1.05rem] tracking-tight text-ink">
            Saksham<span className="text-amber">.</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const current = active === link.id
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  data-cursor="link"
                  className={`relative rounded-full px-4 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] transition-colors duration-500 ${
                    current ? 'text-void' : 'text-muted hover:text-ink'
                  }`}
                >
                  {current && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-ember"
                      transition={SPRING.snappy}
                    />
                  )}
                  {link.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              data-cursor="arrow"
              className="hidden items-center gap-2 rounded-full bg-ink py-2.5 pl-5 pr-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-void transition-colors duration-500 hover:bg-amber md:inline-flex"
            >
              Let&rsquo;s talk
              <span className="grid h-7 w-7 place-items-center rounded-full bg-void/12">
                <svg width="11" height="11" viewBox="0 0 13 13" fill="none" aria-hidden>
                  <path
                    d="M1 12L12 1M12 1H4M12 1V9"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </a>

            <button
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="relative z-[62] grid h-11 w-11 place-items-center rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] md:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-500 ease-[var(--ease-swift)] ${
                    open ? 'top-1.5 rotate-45' : 'top-0'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-ink transition-all duration-500 ease-[var(--ease-swift)] ${
                    open ? 'top-1.5 -rotate-45' : 'top-3'
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[59] flex flex-col justify-between bg-void/95 px-5 pb-10 pt-28 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
            transition={{ duration: 0.75, ease: EASE.drama }}
          >
            <nav className="flex flex-col">
              {LINKS.map((link, i) => (
                <span key={link.id} className="overflow-hidden py-1">
                  <motion.a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 font-display text-[2.6rem] leading-tight tracking-tight text-ink"
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '110%' }}
                    transition={{ duration: 0.8, ease: EASE.drama, delay: 0.1 + i * 0.07 }}
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-faint">
                      0{i + 1}
                    </span>
                    {link.label}
                  </motion.a>
                </span>
              ))}
            </nav>

            <motion.div
              className="flex flex-col gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: EASE.expo, delay: 0.45 }}
            >
              <span className="mono text-faint">Get in touch</span>
              <a href={`mailto:${profile.email}`} className="font-mono text-sm text-ink">
                {profile.email}
              </a>
              <div className="mt-2 flex gap-5 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">
                <a href={profile.githubUrl} target="_blank" rel="noreferrer">
                  GitHub
                </a>
                <a href={profile.linkedinUrl} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
