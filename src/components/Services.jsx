import { site } from "../content.js"
import { trackPointer } from "../trackPointer.js"
import { useReveal } from "../useReveal.js"

export default function Services() {
  const section = site.services
  const reveal = useReveal()
  return (
    <section className="band reveal" id="services" aria-labelledby="services-title" ref={reveal}>
      <div className="frame">
        <header className="band-head">
          <h2 id="services-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <ul className="service-grid">
          {section.items.map((item) => (
            <li key={item.title} onPointerMove={trackPointer}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
