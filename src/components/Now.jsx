import { site } from "../content.js"

export default function Now() {
  const section = site.now
  return (
    <section className="section" id="now" aria-labelledby="now-title">
      <div className="shell now-grid">
        <header className="section-head">
          <p className="index">{section.index}</p>
          <div>
            <h2 id="now-title">{section.title}</h2>
            <p className="lede">{section.lede}</p>
          </div>
        </header>
        <div className="now-card">
          <p className="bench-label">Updated {section.updated}</p>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
