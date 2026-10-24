import { useEffect, useId, useRef, useState } from "react"
import { site } from "../content.js"

function readTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem("theme", theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", theme === "dark" ? "#080a0e" : "#eef1f4")
}

export default function TopBar() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(readTheme)
  const [current, setCurrent] = useState("")
  const menuId = useId()
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    const nodes = site.nav
      .map((item) => document.querySelector(item.href))
      .filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (hit) setCurrent(`#${hit.target.id}`)
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.15, 0.4] },
    )
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) setOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    firstLinkRef.current?.focus()
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open])

  const close = () => setOpen(false)

  const onTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    applyTheme(next)
    setTheme(next)
  }

  return (
    <header className="topbar">
      <div className="frame topbar-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true" />
          {site.name}
        </a>

        <button
          ref={toggleRef}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav id={menuId} className={open ? "menu open" : "menu"} aria-label="Primary">
          <ul>
            {site.nav.map((item, index) => (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-current={current === item.href ? "true" : undefined}
                  onClick={close}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a className="button button-small menu-cta" href="#contact" onClick={close}>
            {site.hero.primaryCta}
          </a>
        </nav>

        <div className="topbar-tools">
          <button className="theme" type="button" onClick={onTheme}>
            {theme === "dark" ? "Light" : "Dark"}
            <span className="sr-only"> appearance</span>
          </button>
          <a className="button button-small desk-cta" href="#contact">
            {site.hero.primaryCta}
          </a>
        </div>
      </div>
      {open ? <button className="scrim" type="button" aria-label="Close menu" onClick={close} /> : null}
    </header>
  )
}
