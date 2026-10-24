import { site } from "../content.js"

export default function Exploring() {
  const section = site.exploring
  return (
    <section className="section" id="exploring" aria-labelledby="exploring-title">
      <div className="shell">
        <header className="section-head">
          <p className="index">{section.index}</p>
          <div>
            <h2 id="exploring-title">{section.title}</h2>
            <p className="lede">{section.lede}</p>
          </div>
        </header>
        <ul className="explore-list">
          {section.items.map((item) => (
            <li key={item.title}>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
              <p className="status">{item.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
