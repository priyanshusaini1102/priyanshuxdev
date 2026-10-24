import { useEffect, useRef } from "react"

export function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return undefined
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 48) {
      node.classList.add("is-in")
    }
    document.documentElement.classList.add("motion")
    if (node.classList.contains("is-in")) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        node.classList.add("is-in")
        observer.disconnect()
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}
