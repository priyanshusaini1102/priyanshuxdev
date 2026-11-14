import { useEffect, useState } from "react"
import { buildResumePdf, countPdfPages } from "../resume/buildPdf.jsx"

export default function PreviewPane({ resume }) {
  const serialized = JSON.stringify(resume)
  const [state, setState] = useState({ url: "", pages: 0, loading: true, error: "" })

  useEffect(() => {
    let cancelled = false
    const timer = setTimeout(async () => {
      setState((current) => ({ ...current, loading: true, error: "" }))
      try {
        const blob = await buildResumePdf(JSON.parse(serialized))
        const pages = await countPdfPages(blob)
        const url = URL.createObjectURL(blob)
        if (cancelled) {
          URL.revokeObjectURL(url)
          return
        }
        setState({ url, pages, loading: false, error: "" })
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            ...current,
            loading: false,
            error: error instanceof Error ? error.message : "Could not render the preview.",
          }))
        }
      }
    }, 280)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [serialized])

  useEffect(() => () => {
    if (state.url) URL.revokeObjectURL(state.url)
  }, [state.url])

  const pageLabel = state.pages > 1 ? `${state.pages} pages` : "1 page"

  return (
    <aside className="admin-preview" aria-label="Resume preview">
      <div className="admin-preview-head">
        <p className="eyebrow">Preview</p>
        <p className={state.pages > 1 ? "admin-pill warn" : "admin-pill"}>{state.loading ? "Rendering" : pageLabel}</p>
      </div>
      {state.pages > 1 ? (
        <p className="admin-hint">The live resume is a single A4 page. This draft has spilled onto another page.</p>
      ) : null}
      {state.error ? <p className="admin-error">{state.error}</p> : null}
      <div className="admin-sheet">
        {state.url ? (
          <iframe title="Resume preview" src={`${state.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} />
        ) : (
          <div className="admin-sheet-empty">Rendering preview…</div>
        )}
      </div>
    </aside>
  )
}
