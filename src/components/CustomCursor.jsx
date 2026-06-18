import { useEffect, useRef, useCallback } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })
  const animId = useRef(null)

  const lerp = (a, b, n) => a + (b - a) * n

  const animate = useCallback(() => {
    pos.current.x = lerp(pos.current.x, target.current.x, 0.15)
    pos.current.y = lerp(pos.current.y, target.current.y, 0.15)

    if (dotRef.current) {
      dotRef.current.style.transform =
        `translate3d(${pos.current.x - 4}px, ${pos.current.y - 4}px, 0)`
    }

    animId.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    // Only show on devices with fine pointer (desktop)
    const hasPointer = window.matchMedia('(pointer: fine)').matches
    if (!hasPointer) return

    const handleMouseMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    const handleMouseOver = (e) => {
      if (
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.closest('[role="button"]')
      ) {
        dotRef.current?.classList.add('hovering')
      }
    }

    const handleMouseOut = (e) => {
      if (
        e.target.closest('a') ||
        e.target.closest('button') ||
        e.target.closest('[role="button"]')
      ) {
        dotRef.current?.classList.remove('hovering')
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseover', handleMouseOver, { passive: true })
    document.addEventListener('mouseout', handleMouseOut, { passive: true })

    animId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
      cancelAnimationFrame(animId.current)
    }
  }, [animate])

  return <div ref={dotRef} className="cursor-dot" />
}
