import { site } from "../content.js"

export default function Services() {
  const section = site.services
  return (
    <section className="band" id="services" aria-labelledby="services-title">
      <div className="frame">
        <header className="band-head">
          <h2 id="services-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <ul className="service-grid">
          {section.items.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
