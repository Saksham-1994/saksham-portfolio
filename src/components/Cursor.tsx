import { useEffect, useRef, useState } from 'react'

type Mode = 'idle' | 'link' | 'view' | 'arrow' | 'drag'

const LABELS: Partial<Record<Mode, string>> = {
  view: 'View',
  drag: 'Drag',
}

const SIZE: Record<Mode, number> = {
  idle: 30,
  link: 58,
  view: 92,
  arrow: 52,
  drag: 84,
}

/**
 * Two-part cursor: a hard dot that tracks the pointer exactly, and a ring that
 * trails it on a lerp. The ring reads the nearest `data-cursor` ancestor to
 * pick a size and label, and snaps to the centre of elements marked
 * `data-cursor-snap` so buttons feel like they capture the pointer.
 *
 * Position is written straight to the DOM inside a rAF loop; React state only
 * holds the discrete mode, which changes rarely.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<Mode>('idle')
  const [visible, setVisible] = useState(false)
  const [pressed, setPressed] = useState(false)
  const snapRect = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2
    let ringX = pointerX
    let ringY = pointerY
    let rafId = 0

    function onMove(event: MouseEvent) {
      pointerX = event.clientX
      pointerY = event.clientY
      setVisible(true)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0) translate(-50%, -50%)`
      }
    }

    function onOver(event: MouseEvent) {
      const target = event.target as HTMLElement | null
      const holder = target?.closest<HTMLElement>('[data-cursor], a, button')
      if (!holder) {
        snapRect.current = null
        setMode('idle')
        return
      }

      const declared = holder.dataset.cursor as Mode | undefined
      setMode(declared && declared in SIZE ? declared : 'link')
      snapRect.current =
        holder.hasAttribute('data-cursor-snap') || holder.closest('[data-cursor-snap]')
          ? (holder.closest('[data-cursor-snap]') ?? holder).getBoundingClientRect()
          : null
    }

    function onLeaveWindow() {
      setVisible(false)
    }

    function tick() {
      // Bias the ring toward the centre of a snapping target so it feels caught.
      const rect = snapRect.current
      const targetX = rect ? rect.left + rect.width / 2 : pointerX
      const targetY = rect ? rect.top + rect.height / 2 : pointerY
      const pull = rect ? 0.35 : 0.16

      ringX += (targetX - ringX) * pull
      ringY += (targetY - ringY) * pull

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', onLeaveWindow)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', onLeaveWindow)
    }
  }, [])

  const size = SIZE[mode]
  const label = LABELS[mode]

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden md:block"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 300ms var(--ease-swift)' }}
      aria-hidden
    >
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1 w-1 rounded-full bg-amber"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          opacity: mode === 'idle' ? 1 : 0,
          transition: 'opacity 200ms linear',
        }}
      />
      <div
        ref={ringRef}
        className="fixed left-0 top-0 grid place-items-center rounded-full font-mono text-[9px] uppercase tracking-[0.2em]"
        style={{
          width: size,
          height: size,
          transform: 'translate3d(-100px, -100px, 0)',
          border: `1px solid ${mode === 'idle' ? 'rgba(240,180,41,0.4)' : 'transparent'}`,
          background: label
            ? 'var(--color-amber)'
            : mode === 'idle'
              ? 'transparent'
              : 'rgba(240,180,41,0.14)',
          color: 'var(--color-void)',
          backdropFilter: mode === 'idle' ? 'none' : 'blur(2px)',
          scale: pressed ? 0.86 : 1,
          transition:
            'width 550ms var(--ease-swift), height 550ms var(--ease-swift), background 400ms linear, border-color 400ms linear, scale 220ms var(--ease-swift)',
        }}
      >
        {label}
      </div>
    </div>
  )
}
