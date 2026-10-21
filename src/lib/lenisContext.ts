import type Lenis from 'lenis'
import { createContext, useContext } from 'react'

export const LenisContext = createContext<Lenis | null>(null)

/** Access the live Lenis instance for programmatic scrolling. */
export function useLenis() {
  return useContext(LenisContext)
}
