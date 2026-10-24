import { useEffect, useId, useRef, useState } from "react"
import { site } from "../content.js"
import { useHash } from "../useHash.js"

function currentTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark"
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem("theme", theme)
  const color = document.querySelector('meta[name="theme-color"]')
  if (color) color.setAttribute("content", theme === "light" ? "#f6f3ec" : "#141311")
}

export default function Header() {
  const hash = useHash()
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(currentTheme)
  const menuId = useId()
  const toggleRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 980) setOpen(false)
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
    const mobile = window.matchMedia("(max-width: 980px)").matches
    if (mobile) {
      firstLinkRef.current?.focus()
      document.body.style.overflow = "hidden"
    }
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

  const active = (href) => {
    if (href === "#notes") return hash === "#notes" || hash.startsWith("#notes/")
    return hash === href
  }

  return (
    <header className="header">
      <div className="shell header-inner">
        <a className="logo" href="#top">
          <span className="logo-mark" aria-hidden="true">P</span>
          <span className="logo-name">{site.name}</span>
        </a>

        <nav className="nav" aria-label="Primary">
          <button
            ref={toggleRef}
            className="nav-toggle"
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <ul id={menuId} className={open ? "nav-list open" : "nav-list"}>
            {site.nav.map((item, index) => (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={item.href}
                  aria-current={active(item.href) ? "true" : undefined}
                  onClick={close}
                >
                  {item.label}
                </a>
              </li>
            ))}
            </ul>
        </nav>

        <button className="theme-toggle" type="button" onClick={onTheme}>
          {theme === "dark" ? "Light" : "Dark"}
          <span className="sr-only"> theme</span>
        </button>
      </div>
    </header>
  )
}
