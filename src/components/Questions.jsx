import { useId, useState } from "react"
import { site } from "../content.js"

export default function Questions() {
  const section = site.faq
  const baseId = useId()
  const [open, setOpen] = useState(0)

  return (
    <section className="band" id="faq" aria-labelledby="faq-title">
      <div className="frame faq-layout">
        <header className="band-head">
          <h2 id="faq-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <div className="faq-list">
          {section.items.map((item, index) => {
            const panelId = `${baseId}-panel-${index}`
            const buttonId = `${baseId}-button-${index}`
            const expanded = open === index
            return (
              <div className={expanded ? "faq-item open" : "faq-item"} key={item.q}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? -1 : index)}
                  >
                    <span>{item.q}</span>
                    <span className="faq-icon" aria-hidden="true" />
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!expanded}>
                  <p>{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
