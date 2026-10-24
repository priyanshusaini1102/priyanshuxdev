import { useEffect, useRef } from "react"

export default function Atmosphere() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(pointer: fine)")
    if (!node || reduce.matches || !fine.matches) return undefined

    const target = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.18 }
    const current = { x: target.x, y: target.y }
    let frame = 0
    let running = false

    const paint = () => {
      current.x += (target.x - current.x) * 0.12
      current.y += (target.y - current.y) * 0.12
      node.style.setProperty("--glow-x", `${current.x}px`)
      node.style.setProperty("--glow-y", `${current.y}px`)
      if (Math.abs(target.x - current.x) < 0.4 && Math.abs(target.y - current.y) < 0.4) {
        running = false
        frame = 0
        return
      }
      frame = requestAnimationFrame(paint)
    }

    const start = () => {
      if (running) return
      running = true
      frame = requestAnimationFrame(paint)
    }

    const onMove = (event) => {
      target.x = event.clientX
      target.y = event.clientY
      start()
    }

    start()
    window.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      window.removeEventListener("pointermove", onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={ref} className="atmosphere" aria-hidden="true" />
}
