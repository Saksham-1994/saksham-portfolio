import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { ArrowButton, Magnetic } from '../components/ui/Magnetic'
import { Container, DrawnRule } from '../components/ui/Section'
import { Reveal } from '../components/ui/Reveal'
import { MaskLines } from '../components/ui/Text'
import { EASE } from '../lib/motion'
import { profile } from '../data/content'

/** Underlined field with a label that lifts on focus and a rule that wipes in. */
function Field({
  label,
  name,
  type = 'text',
  textarea = false,
  value,
  onChange,
}: {
  label: string
  name: string
  type?: string
  textarea?: boolean
  value: string
  onChange: (value: string) => void
}) {
  const [focused, setFocused] = useState(false)
  const lifted = focused || value.length > 0

  const shared = {
    name,
    id: name,
    required: true,
    value,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(event.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    className:
      'w-full resize-none bg-transparent py-3 text-[0.95rem] text-ink outline-none placeholder:text-transparent',
  }

  return (
    <div className="relative pt-6">
      <label
        htmlFor={name}
        className={`pointer-events-none absolute left-0 font-mono uppercase tracking-[0.18em] transition-all duration-500 ease-[var(--ease-swift)] ${
          lifted ? 'top-0 text-[9.5px] text-amber' : 'top-8 text-[12px] text-muted'
        }`}
      >
        {label}
      </label>

      {textarea ? <textarea rows={3} {...shared} /> : <input type={type} {...shared} />}

      <span className="absolute inset-x-0 bottom-0 h-px bg-line-hi">
        <motion.span
          className="absolute inset-0 origin-left bg-amber"
          initial={false}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.6, ease: EASE.expo }}
        />
      </span>
    </div>
  )
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [copied, setCopied] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name}`)
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      {/* Warm bloom behind the closing statement */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-copper/[0.13] blur-[120px]" />

      <Container>
        <DrawnRule className="mb-16 md:mb-24" />

        <Reveal distance={20}>
          <div className="flex items-center gap-4">
            <span className="mono text-faint">06</span>
            <span className="h-px w-8 bg-line-hi" />
            <span className="eyebrow">Contact</span>
          </div>
        </Reveal>

        <MaskLines
          as="h2"
          lines={[
            'Have a system',
            <>
              worth <span className="font-serif italic text-amber">protecting</span>?
            </>,
          ]}
          className="mt-8 font-display text-[clamp(2.4rem,11vw,7.5rem)] uppercase leading-[0.86] tracking-[-0.04em] text-ink md:mt-12"
        />

        <div className="mt-16 grid gap-14 md:mt-24 md:grid-cols-12 md:gap-8">
          {/* Direct lines */}
          <div className="flex flex-col gap-10 md:col-span-5">
            <Reveal distance={26}>
              <p className="max-w-[38ch] text-[1rem] leading-relaxed text-muted">
                Open to security engineering internships, detection-focused research, and backend
                work. The fastest route is email — I read everything.
              </p>
            </Reveal>

            <Reveal delay={0.1} distance={26} className="flex flex-col gap-5">
              <div>
                <span className="mono text-faint">Email</span>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${profile.email}`}
                    data-cursor="link"
                    className="wipe font-mono text-[0.95rem] text-ink transition-colors duration-500 hover:text-amber"
                  >
                    {profile.email}
                  </a>
                  <button
                    onClick={copyEmail}
                    data-cursor="link"
                    className="relative rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] transition-colors duration-500 hover:text-amber"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? 'copied' : 'copy'}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.25 }}
                        className="block"
                      >
                        {copied ? 'Copied' : 'Copy'}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              <div>
                <span className="mono text-faint">Phone</span>
                <a
                  href={`tel:${profile.phone}`}
                  data-cursor="link"
                  className="wipe mt-2 block w-fit font-mono text-[0.95rem] text-ivory transition-colors duration-500 hover:text-amber"
                >
                  {profile.phone}
                </a>
              </div>

              <div>
                <span className="mono text-faint">Elsewhere</span>
                <div className="mt-3 flex gap-3">
                  {[
                    { label: 'GitHub', url: profile.githubUrl },
                    { label: 'LinkedIn', url: profile.linkedinUrl },
                  ].map((link) => (
                    <Magnetic key={link.label} strength={0.3}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        data-cursor="arrow"
                        className="group inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] transition-all duration-500 hover:text-amber hover:shadow-[inset_0_0_0_1px_rgba(240,180,41,0.5)]"
                      >
                        {link.label}
                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden>
                          <path
                            d="M1 11L11 1M11 1H4M11 1V8"
                            stroke="currentColor"
                            strokeWidth="1.3"
                            strokeLinecap="round"
                            className="transition-transform duration-500 group-hover:translate-x-[1px] group-hover:-translate-y-[1px]"
                          />
                        </svg>
                      </a>
                    </Magnetic>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Form */}
          <Reveal delay={0.15} distance={40} className="md:col-span-6 md:col-start-7">
            <div className="bezel">
              <div className="bezel-inner p-6 md:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="mono text-faint">Send a message</span>
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                    <span className="mono text-muted">Usually replies in a day</span>
                  </span>
                </div>

                <form onSubmit={handleSubmit} className="mt-9 flex flex-col gap-7">
                  <Field
                    label="Your name"
                    name="name"
                    value={form.name}
                    onChange={(value) => setForm((state) => ({ ...state, name: value }))}
                  />
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(value) => setForm((state) => ({ ...state, email: value }))}
                  />
                  <Field
                    label="What are you building?"
                    name="message"
                    textarea
                    value={form.message}
                    onChange={(value) => setForm((state) => ({ ...state, message: value }))}
                  />
                  <div className="pt-3">
                    <ArrowButton type="submit">Send message</ArrowButton>
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
