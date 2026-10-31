import { site } from "../content.js"
import { trackPointer } from "../trackPointer.js"
import { useReveal } from "../useReveal.js"
import Outbound from "./Outbound.jsx"

export default function Work() {
  const section = site.work
  const reveal = useReveal()
  return (
    <section className="band reveal" id="work" aria-labelledby="work-title" ref={reveal}>
      <div className="frame">
        <header className="band-head">
          <h2 id="work-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <ul className="work-grid">
          {section.items.map((item) => (
            <li
              key={item.title}
              className={item.featured ? "case case-featured" : "case"}
              onPointerMove={trackPointer}
            >
              {item.image && (
                <figure className="case-media">
                  <img src={item.image.src} alt={item.image.alt} width="1600" height="900" loading="lazy" decoding="async" />
                </figure>
              )}
              <div className="case-body">
              <h3>{item.title}</h3>
              <p className="case-label">Problem</p>
              <p>{item.problem}</p>
              <p className="case-label">Solution</p>
              <p>{item.solution}</p>
              <ul className="chips" aria-label="Stack">
                {item.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <ul className="case-links">
                {item.links.map((link) => (
                  <li key={link.href}>
                    <Outbound href={link.href}>{link.label}</Outbound>
                  </li>
                ))}
              </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
