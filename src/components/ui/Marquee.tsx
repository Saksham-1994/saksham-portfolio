import type { ReactNode } from 'react'

/**
 * Infinite horizontal track. The content is rendered twice and the CSS
 * animation translates exactly -50%, so the loop has no seam. Runs entirely on
 * the compositor — no scroll listener, no React re-render.
 */
export function Marquee({
  children,
  /** Seconds for one full pass. Higher is slower. */
  duration = 42,
  reverse = false,
  className = '',
  fade = true,
}: {
  children: ReactNode
  duration?: number
  reverse?: boolean
  className?: string
  fade?: boolean
}) {
  return (
    <div
      className={`marquee relative flex overflow-hidden ${fade ? 'edge-fade' : ''} ${className}`}
      aria-hidden
    >
      <div
        className="marquee-track"
        data-direction={reverse ? 'reverse' : undefined}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center">{children}</div>
      </div>
    </div>
  )
}
