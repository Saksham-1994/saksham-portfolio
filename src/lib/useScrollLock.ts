import { useEffect } from 'react'
import { useLenis } from './lenisContext'

/**
 * Freezes the page while an overlay owns the viewport.
 *
 * Lenis is paused through its own API rather than by setting `overflow: hidden`,
 * because Lenis manages the document's scroll styles itself and fighting it
 * leaves the instance with stale dimensions once the overlay closes. The
 * overflow fallback only applies when Lenis is absent — reduced-motion visitors,
 * where native scrolling is still in charge.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!locked) return

    if (lenis) {
      lenis.stop()
      return () => lenis.start()
    }

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [locked, lenis])
}
