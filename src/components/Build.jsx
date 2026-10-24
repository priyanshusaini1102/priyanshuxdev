import { site } from "../content.js"

export default function Build() {
  const section = site.build
  return (
    <section className="section" id="build" aria-labelledby="build-title">
      <div className="shell">
        <header className="section-head">
          <p className="index">{section.index}</p>
          <div>
            <h2 id="build-title">{section.title}</h2>
            <p className="lede">{section.lede}</p>
          </div>
        </header>
        <ol className="build-list">
          {section.items.map((item, index) => (
            <li key={item.title}>
              <span className="num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
