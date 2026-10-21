import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { Marquee } from '../components/ui/Marquee'

const CAPABILITIES = [
  'Threat Detection',
  'Security Automation',
  'Anomaly Detection',
  'Vulnerability Assessment',
  'SIEM Monitoring',
  'Cloud Hardening',
  'REST API Design',
  'Network Security',
]

const TOOLS = [
  'Python',
  'FastAPI',
  'Machine Learning',
  'Wireshark',
  'Nmap',
  'Metasploit',
  'Kali Linux',
  'MySQL',
  'Git',
]

/**
 * Full-bleed band between the hero and the first content section. The rows lean
 * with scroll velocity, so the band responds to how the visitor is moving rather
 * than only looping. The skew lives on the inner rows so the band's own edges
 * stay level.
 */
export default function Ticker() {
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothed = useSpring(velocity, { stiffness: 240, damping: 50, mass: 0.4 })
  const skewY = useTransform(smoothed, [-2600, 0, 2600], [2, 0, -2], { clamp: true })

  return (
    <section
      className="relative overflow-hidden border-y border-line-hi bg-bg-secondary py-9 md:py-11"
      aria-label="Capabilities"
    >
      <motion.div style={reduced ? undefined : { skewY }}>
        <Marquee duration={46}>
          {CAPABILITIES.map((item) => (
            <span key={item} className="flex items-center">
              <span className="whitespace-nowrap px-7 font-display text-[8vw] uppercase leading-[1.1] tracking-[-0.03em] text-ivory/85 md:text-[3.3vw]">
                {item}
              </span>
              <span className="text-amber/70">◆</span>
            </span>
          ))}
        </Marquee>

        <Marquee duration={34} reverse className="mt-4">
          {TOOLS.map((item) => (
            <span key={item} className="flex items-center">
              <span className="whitespace-nowrap px-5 font-mono text-[10px] uppercase tracking-[0.24em] text-faint">
                {item}
              </span>
              <span className="h-1 w-1 rounded-full bg-copper" />
            </span>
          ))}
        </Marquee>
      </motion.div>
    </section>
  )
}
