import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
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
  const skipRestore = useRef(false)

  useEffect(() => {
    const ids = site.nav.map((item) => item.href.slice(1))
    let frame = 0

    const update = () => {
      frame = 0
      if (document.documentElement.classList.contains("menu-lock")) return
      const bar = document.querySelector(".topbar")?.getBoundingClientRect().height ?? 72
      // Just under the sticky bar, past the scroll-padding landing point.
      // Sort by document position: Process sits above Work, but later in the nav.
      const line = window.scrollY + bar + 32
      const sections = ids
        .map((id) => {
          const section = document.getElementById(id)
          if (!section) return null
          return { href: `#${id}`, top: section.getBoundingClientRect().top + window.scrollY }
        })
        .filter(Boolean)
        .sort((a, b) => a.top - b.top)
      let active = ""
      for (const section of sections) {
        if (section.top <= line) active = section.href
      }
      setCurrent((previous) => (previous === active ? previous : active))
    }

    const requestUpdate = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", requestUpdate, { passive: true })
    window.addEventListener("resize", requestUpdate)
    window.addEventListener("hashchange", requestUpdate)
    return () => {
      window.removeEventListener("scroll", requestUpdate)
      window.removeEventListener("resize", requestUpdate)
      window.removeEventListener("hashchange", requestUpdate)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 960) setOpen(false)
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useLayoutEffect(() => {
    if (!open) return undefined
    const html = document.documentElement
    const body = document.body
    const content = document.getElementById("content")
    const colophon = document.querySelector(".colophon")
    const scrollY = window.scrollY
    const syncTop = () => {
      const bar = document.querySelector(".topbar")?.getBoundingClientRect().height ?? 72
      html.style.setProperty("--menu-top", `${bar}px`)
    }

    html.classList.add("menu-lock")
    body.style.position = "fixed"
    body.style.top = `-${scrollY}px`
    body.style.left = "0"
    body.style.right = "0"
    body.style.width = "100%"
    if (content) content.inert = true
    if (colophon) colophon.inert = true
    syncTop()

    const blockScroll = (event) => {
      const menu = event.target instanceof Element ? event.target.closest(".menu") : null
      if (menu && menu.scrollHeight > menu.clientHeight + 1) return
      event.preventDefault()
    }

    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false)
        toggleRef.current?.focus({ preventScroll: true })
        return
      }
      if (event.key !== "Tab") return
      const items = [...document.querySelectorAll(".topbar a, .topbar button, .menu-layer a, .menu-layer button")]
        .filter((el) => el.tabIndex !== -1 && el.getClientRects().length > 0)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus({ preventScroll: true })
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus({ preventScroll: true })
      }
    }

    document.addEventListener("keydown", onKey)
    document.addEventListener("touchmove", blockScroll, { passive: false })
    document.addEventListener("wheel", blockScroll, { passive: false })
    window.addEventListener("resize", syncTop)
    firstLinkRef.current?.focus({ preventScroll: true })

    return () => {
      html.classList.remove("menu-lock")
      html.style.removeProperty("--menu-top")
      body.style.position = ""
      body.style.top = ""
      body.style.left = ""
      body.style.right = ""
      body.style.width = ""
      if (content) content.inert = false
      if (colophon) colophon.inert = false
      if (!skipRestore.current) {
        const behavior = html.style.scrollBehavior
        html.style.scrollBehavior = "auto"
        window.scrollTo(0, scrollY)
        html.style.scrollBehavior = behavior
      }
      skipRestore.current = false
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("touchmove", blockScroll)
      document.removeEventListener("wheel", blockScroll)
      window.removeEventListener("resize", syncTop)
    }
  }, [open])

  const close = () => setOpen(false)

  const followLink = () => {
    skipRestore.current = true
    const html = document.documentElement
    const body = document.body
    const y = Math.abs(Number.parseInt(body.style.top || "0", 10)) || 0
    const behavior = html.style.scrollBehavior
    html.style.scrollBehavior = "auto"
    body.style.position = ""
    body.style.top = ""
    body.style.left = ""
    body.style.right = ""
    body.style.width = ""
    window.scrollTo(0, y)
    html.style.scrollBehavior = behavior
    setOpen(false)
  }

  const onTheme = () => {
    const next = theme === "dark" ? "light" : "dark"
    applyTheme(next)
    setTheme(next)
  }

  const nav = (
    <nav id={menuId} className={open ? "menu open" : "menu"} aria-label="Primary">
      <ul>
        {site.nav.map((item, index) => (
          <li key={item.href}>
            <a
              ref={index === 0 ? firstLinkRef : undefined}
              href={item.href}
              aria-current={current === item.href ? "true" : undefined}
              onClick={followLink}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <a className="button button-small menu-cta" href="#contact" onClick={followLink}>
        {site.hero.primaryCta}
      </a>
    </nav>
  )

  return (
    <>
      <header className={open ? "topbar is-open" : "topbar"}>
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

          {open ? null : nav}

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
      </header>
      {open
        ? createPortal(
            <div className="menu-layer">
              <button className="scrim" type="button" aria-label="Close menu" tabIndex={-1} onClick={close} />
              {nav}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
