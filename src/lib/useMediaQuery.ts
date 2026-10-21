import { useEffect, useState } from 'react'

/**
 * Subscribes to a media query. Used to gate scroll-driven transforms that only
 * make sense on the desktop layout, since inline motion styles cannot carry a
 * responsive variant.
 */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const list = window.matchMedia(query)
    setMatches(list.matches)

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches)
    list.addEventListener('change', onChange)
    return () => list.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)')
