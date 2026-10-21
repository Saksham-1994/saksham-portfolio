import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  pulse: number
}

type Packet = {
  from: number
  to: number
  t: number
  speed: number
}

const LINK_DISTANCE = 168
const POINTER_RADIUS = 230

/**
 * Live surveillance-graph backdrop: drifting nodes, proximity-linked edges, and
 * packets moving between them. Canvas rather than DOM so the node count costs
 * nothing in layout, and it reads as instrumentation rather than decoration.
 *
 * The loop is suspended whenever the canvas is off screen or the tab is hidden,
 * and reduced-motion visitors get a single static frame.
 */
export default function NetworkField({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let nodes: Node[] = []
    let packets: Packet[] = []
    let rafId = 0
    let running = true
    const pointer = { x: -9999, y: -9999, active: false }

    function seed() {
      // Density tracks area so phones do not pay for a desktop-sized graph.
      const count = Math.round(Math.min(72, Math.max(22, (width * height) / 26000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: Math.random() > 0.86 ? 2.4 : 1.25,
        pulse: Math.random() * Math.PI * 2,
      }))

      packets = Array.from({ length: Math.max(4, Math.round(count / 7)) }, () => ({
        from: Math.floor(Math.random() * count),
        to: Math.floor(Math.random() * count),
        t: Math.random(),
        speed: 0.0022 + Math.random() * 0.004,
      }))
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      context!.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function draw(time: number) {
      context!.clearRect(0, 0, width, height)

      // Concentric rings give the drift a frame of reference.
      const cx = width / 2
      const cy = height / 2
      const maxRing = Math.min(width, height) * 0.46
      context!.lineWidth = 1
      for (let ring = 1; ring <= 3; ring++) {
        context!.beginPath()
        context!.arc(cx, cy, (maxRing / 3) * ring, 0, Math.PI * 2)
        context!.strokeStyle = `rgba(168, 85, 31, ${0.1 - ring * 0.02})`
        context!.stroke()
      }

      // Sweep line, one slow revolution.
      const sweep = (time / 9000) % (Math.PI * 2)
      const gradient = context!.createLinearGradient(
        cx,
        cy,
        cx + Math.cos(sweep) * maxRing,
        cy + Math.sin(sweep) * maxRing,
      )
      gradient.addColorStop(0, 'rgba(240, 180, 41, 0.16)')
      gradient.addColorStop(1, 'rgba(240, 180, 41, 0)')
      context!.beginPath()
      context!.moveTo(cx, cy)
      context!.lineTo(cx + Math.cos(sweep) * maxRing, cy + Math.sin(sweep) * maxRing)
      context!.strokeStyle = gradient
      context!.lineWidth = 1.5
      context!.stroke()

      for (const node of nodes) {
        if (!reduced) {
          node.x += node.vx
          node.y += node.vy
          if (node.x < 0 || node.x > width) node.vx *= -1
          if (node.y < 0 || node.y > height) node.vy *= -1
          node.x = Math.max(0, Math.min(width, node.x))
          node.y = Math.max(0, Math.min(height, node.y))
        }

        // Nodes ease away from the pointer, like a probe disturbing the mesh.
        if (pointer.active) {
          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const distance = Math.hypot(dx, dy)
          if (distance < POINTER_RADIUS && distance > 0.001) {
            const push = (1 - distance / POINTER_RADIUS) * 0.9
            node.x += (dx / distance) * push
            node.y += (dy / distance) * push
          }
        }
      }

      context!.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const distance = Math.hypot(a.x - b.x, a.y - b.y)
          if (distance > LINK_DISTANCE) continue

          const strength = 1 - distance / LINK_DISTANCE
          context!.beginPath()
          context!.moveTo(a.x, a.y)
          context!.lineTo(b.x, b.y)
          context!.strokeStyle = `rgba(168, 85, 31, ${strength * 0.4})`
          context!.stroke()
        }
      }

      // Edges to the pointer read as an active probe.
      if (pointer.active) {
        for (const node of nodes) {
          const distance = Math.hypot(node.x - pointer.x, node.y - pointer.y)
          if (distance > POINTER_RADIUS) continue
          context!.beginPath()
          context!.moveTo(node.x, node.y)
          context!.lineTo(pointer.x, pointer.y)
          context!.strokeStyle = `rgba(240, 180, 41, ${(1 - distance / POINTER_RADIUS) * 0.3})`
          context!.stroke()
        }
      }

      for (const node of nodes) {
        node.pulse += 0.012
        const breathe = reduced ? 1 : 0.7 + Math.sin(node.pulse) * 0.3
        const hot = node.radius > 2
        context!.beginPath()
        context!.arc(node.x, node.y, node.radius * (hot ? breathe : 1), 0, Math.PI * 2)
        context!.fillStyle = hot
          ? `rgba(240, 180, 41, ${0.5 + breathe * 0.4})`
          : 'rgba(232, 225, 213, 0.5)'
        context!.fill()

        if (hot) {
          context!.beginPath()
          context!.arc(node.x, node.y, node.radius * 4.5 * breathe, 0, Math.PI * 2)
          context!.strokeStyle = `rgba(240, 180, 41, ${0.18 * (2 - breathe)})`
          context!.stroke()
        }
      }

      for (const packet of packets) {
        const from = nodes[packet.from]
        const to = nodes[packet.to]
        if (!from || !to) continue

        if (!reduced) packet.t += packet.speed
        if (packet.t >= 1) {
          packet.t = 0
          packet.from = packet.to
          packet.to = Math.floor(Math.random() * nodes.length)
        }

        const distance = Math.hypot(from.x - to.x, from.y - to.y)
        if (distance > LINK_DISTANCE * 2) {
          packet.to = Math.floor(Math.random() * nodes.length)
          continue
        }

        const eased = packet.t * packet.t * (3 - 2 * packet.t)
        const px = from.x + (to.x - from.x) * eased
        const py = from.y + (to.y - from.y) * eased
        const fade = Math.sin(packet.t * Math.PI)

        context!.beginPath()
        context!.arc(px, py, 1.9, 0, Math.PI * 2)
        context!.fillStyle = `rgba(255, 214, 138, ${fade})`
        context!.fill()

        // Short trail behind the packet.
        context!.beginPath()
        context!.moveTo(px, py)
        context!.lineTo(
          px - (to.x - from.x) * 0.05,
          py - (to.y - from.y) * 0.05,
        )
        context!.strokeStyle = `rgba(255, 214, 138, ${fade * 0.5})`
        context!.lineWidth = 1.2
        context!.stroke()
      }
    }

    function frame(time: number) {
      draw(time)
      if (running && !reduced) rafId = requestAnimationFrame(frame)
    }

    function onPointerMove(event: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active =
        pointer.x > -POINTER_RADIUS &&
        pointer.x < rect.width + POINTER_RADIUS &&
        pointer.y > -POINTER_RADIUS &&
        pointer.y < rect.height + POINTER_RADIUS
    }

    resize()
    rafId = requestAnimationFrame(frame)

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Stop burning frames once the graph has scrolled away.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        const shouldRun = entry.isIntersecting
        if (shouldRun && !running) {
          running = true
          rafId = requestAnimationFrame(frame)
        }
        running = shouldRun
      },
      { threshold: 0 },
    )
    visibility.observe(canvas)

    function onVisibilityChange() {
      if (document.hidden) {
        running = false
      } else if (!running) {
        running = true
        rafId = requestAnimationFrame(frame)
      }
    }

    window.addEventListener('mousemove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelAnimationFrame(rafId)
      running = false
      resizeObserver.disconnect()
      visibility.disconnect()
      window.removeEventListener('mousemove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [])

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden />
}
