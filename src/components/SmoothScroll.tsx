import Lenis from 'lenis'
import { useEffect, useState, type ReactNode } from 'react'
import { LenisContext } from '../lib/lenisContext'

/**
 * Physics-based smooth scroll for the whole document.
 *
 * Also owns in-page anchor navigation: Lenis has to perform the jump itself,
 * otherwise the browser's native scroll fights the interpolation and the page
 * snaps instead of gliding.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    const instance = new Lenis({
      // Safari stutters on low lerp values, so give it a longer reach.
      lerp: isSafari ? 0.1 : 0.075,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
      // Momentum hijacking on iOS reads as lag rather than smoothness.
      syncTouch: false,
    })

    setLenis(instance)

    let rafId = 0
    function raf(time: number) {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    function handleAnchorClick(event: MouseEvent) {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      const hash = anchor?.getAttribute('href')
      if (!anchor || !hash || hash === '#') return

      const target = document.querySelector(hash)
      if (!target) return

      event.preventDefault()
      if (lenis) {
        lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.5 })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
      history.replaceState(null, '', hash)
    }

    document.addEventListener('click', handleAnchorClick)
    return () => document.removeEventListener('click', handleAnchorClick)
  }, [lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
