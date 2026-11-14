import { useCallback, useEffect, useMemo, useState } from "react"
import Atmosphere from "../components/Atmosphere.jsx"
import { site } from "../content.js"
import bundledResume from "../data/resume.json"
import { blobToBase64, buildResumePdf } from "../resume/buildPdf.jsx"
import { validateResume } from "../resume/validate.js"
import { api } from "./client.js"
import { decorate, undecorate } from "./draft.js"
import LoginScreen from "./LoginScreen.jsx"
import PreviewPane from "./PreviewPane.jsx"
import ResumeEditor from "./ResumeEditor.jsx"
import "./admin.css"

function readTheme() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light"
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  localStorage.setItem("theme", theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute("content", theme === "dark" ? "#080a0e" : "#eef1f4")
}

function adopt(resume) {
  const draft = decorate(resume)
  return { draft, saved: JSON.stringify(undecorate(draft)) }
}

export default function AdminApp() {
  const [phase, setPhase] = useState("checking")
  const [disabledMessage, setDisabledMessage] = useState("")
  const [draft, setDraft] = useState(null)
  const [saved, setSaved] = useState("")
  const [warning, setWarning] = useState("")
  const [source, setSource] = useState("")
  const [loadedCommit, setLoadedCommit] = useState(null)
  const [publishResult, setPublishResult] = useState(null)
  const [publishError, setPublishError] = useState("")
  const [busy, setBusy] = useState("")
  const [theme, setTheme] = useState(readTheme)

  const plain = useMemo(() => (draft ? undecorate(draft) : null), [draft])
  const validation = useMemo(() => (plain ? validateResume(plain) : { ok: true, errors: [] }), [plain])
  const dirty = Boolean(plain) && JSON.stringify(plain) !== saved

  useEffect(() => {
    document.title = "Resume admin"
    const robots = document.querySelector('meta[name="robots"]')
    if (robots) robots.setAttribute("content", "noindex, nofollow")
  }, [])

  useEffect(() => {
    if (!dirty) return undefined
    const onLeave = (event) => {
      event.preventDefault()
      event.returnValue = ""
    }
    window.addEventListener("beforeunload", onLeave)
    return () => window.removeEventListener("beforeunload", onLeave)
  }, [dirty])

  const loadResume = useCallback(async () => {
    try {
      const data = await api("/api/resume")
      const next = adopt(data.resume)
      setDraft(next.draft)
      setSaved(next.saved)
      setWarning(data.warning || "")
      setSource(data.source || "")
      setLoadedCommit(data.commit || null)
      setPublishError("")
      return true
    } catch (error) {
      if (error.status === 401) {
        setPhase("login")
        setDraft(null)
        return false
      }
      const next = adopt(bundledResume)
      setDraft(next.draft)
      setSaved(next.saved)
      setWarning(error.message || "Could not load the latest resume. Showing the copy bundled with this deploy.")
      setSource("bundle")
      setLoadedCommit(null)
      return true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function boot() {
      try {
        await api("/api/session")
        if (cancelled) return
        setPhase("editor")
        await loadResume()
      } catch (error) {
        if (cancelled) return
        if (error.status === 503 && error.data?.disabled) {
          setDisabledMessage(error.message)
          setPhase("disabled")
          return
        }
        setPhase("login")
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [loadResume])

  function onLeave(event) {
    if (!dirty) return
    if (!window.confirm("You have unsaved resume edits. Leave anyway?")) event.preventDefault()
  }

  async function onReload() {
    if (dirty && !window.confirm("You have unsaved resume edits. Load the latest copy and discard them?")) return
    setBusy("reload")
    await loadResume()
    setBusy("")
  }

  async function onDownload() {
    if (!plain) return
    setBusy("download")
    setPublishError("")
    try {
      const blob = await buildResumePdf(plain)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = site.resume.fileName
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "Could not build the PDF.")
    } finally {
      setBusy("")
    }
  }

  async function onPublish() {
    if (!plain) return
    if (!validation.ok || !validation.resume) {
      setPublishError("Fix the fields below before publishing.")
      return
    }
    setBusy("publish")
    setPublishError("")
    setPublishResult(null)
    try {
      const blob = await buildResumePdf(validation.resume)
      const pdfBase64 = await blobToBase64(blob)
      const data = await api("/api/resume", {
        method: "POST",
        body: { resume: validation.resume, pdfBase64 },
      })
      const next = adopt(data.resume)
      setDraft(next.draft)
      setSaved(next.saved)
      setSource("github")
      setLoadedCommit(data.commit || null)
      setWarning("")
      setPublishResult(data)
    } catch (error) {
      if (error.status === 401) {
        setPhase("login")
        setDraft(null)
        return
      }
      setPublishError(error.message || "Could not publish.")
    } finally {
      setBusy("")
    }
  }

  function onTheme() {
    const next = theme === "dark" ? "light" : "dark"
    applyTheme(next)
    setTheme(next)
  }

  return (
    <div className="admin-root">
      <Atmosphere />
      <a className="skip" href="#editor">Skip to editor</a>
      {phase === "checking" ? <main className="admin-login"><p className="admin-card admin-lede">Checking the session…</p></main> : null}
      {phase === "disabled" ? <LoginScreen disabled message={disabledMessage} onSuccess={() => {}} /> : null}
      {phase === "editor" && !draft ? <main className="admin-login"><p className="admin-card admin-lede">Loading the resume…</p></main> : null}
      {phase === "login" ? (
        <LoginScreen
          onSuccess={() => {
            setPhase("editor")
            loadResume()
          }}
        />
      ) : null}
      {phase === "editor" && draft && plain ? (
        <>
          <header className="admin-top">
            <div className="admin-frame admin-top-inner">
              <a className="brand" href="/" onClick={onLeave}>
                <span className="brand-mark" aria-hidden="true" />
                {site.name}
              </a>
              <div className="admin-top-copy">
                <p className="eyebrow">Resume</p>
                <strong>{dirty ? "Unsaved changes" : "Saved on this page"}</strong>
              </div>
              <div className="admin-actions">
                <button className="theme" type="button" onClick={onTheme}>
                  {theme === "dark" ? "Light" : "Dark"}
                  <span className="sr-only"> appearance</span>
                </button>
                <button className="button button-ghost button-small" type="button" onClick={onReload} disabled={Boolean(busy)}>
                  {busy === "reload" ? "Loading…" : "Reload latest"}
                </button>
                <button className="button button-ghost button-small" type="button" onClick={onDownload} disabled={Boolean(busy)}>
                  {busy === "download" ? "Preparing…" : "Download PDF"}
                </button>
                <button className="button button-small" type="button" onClick={onPublish} disabled={Boolean(busy) || !validation.ok}>
                  {busy === "publish" ? "Publishing…" : "Publish"}
                </button>
                <button
                  className="admin-text"
                  type="button"
                  onClick={async () => {
                    if (dirty && !window.confirm("You have unsaved resume edits. Sign out anyway?")) return
                    try {
                      await api("/api/logout", { method: "POST" })
                    } catch {
                      // Leave the editor even if the cookie could not be cleared.
                    }
                    setDraft(null)
                    setPhase("login")
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </header>
          <main className="admin-frame admin-layout" id="editor">
            <div>
              <p className="admin-source">
                {source === "github" && loadedCommit
                  ? <>Editing the latest copy from GitHub · <a href={loadedCommit.url} target="_blank" rel="noreferrer">{loadedCommit.sha.slice(0, 7)}</a></>
                  : "Editing the copy bundled with this deploy."}
              </p>
              {warning ? <p className="admin-warning" role="status">{warning}</p> : null}
              {publishResult ? (
                <p className="admin-banner" role="status">
                  {publishResult.message}
                  {publishResult.commit?.url ? (
                    <>
                      {" "}
                      <a href={publishResult.commit.url} target="_blank" rel="noreferrer">View commit</a>
                    </>
                  ) : null}
                </p>
              ) : null}
              {publishError ? <p className="admin-error admin-banner" role="alert">{publishError}</p> : null}
              {!validation.ok ? (
                <div className="admin-warning" role="status">
                  <p>Publish stays off until these are fixed.</p>
                  <ul>
                    {validation.errors.slice(0, 8).map((error) => (
                      <li key={`${error.path}-${error.message}`}>{error.path ? `${error.path}: ` : ""}{error.message}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <ResumeEditor
                draft={draft}
                errors={validation.errors}
                onChange={(next) => {
                  setDraft(next)
                  setPublishResult(null)
                }}
              />
            </div>
            <PreviewPane resume={plain} />
          </main>
        </>
      ) : null}
    </div>
  )
}
