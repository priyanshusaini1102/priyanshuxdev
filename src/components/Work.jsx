import { site } from "../content.js"
import Outbound from "./Outbound.jsx"

export default function Work() {
  const section = site.work
  return (
    <section className="band" id="work" aria-labelledby="work-title">
      <div className="frame">
        <header className="band-head">
          <h2 id="work-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <ul className="work-grid">
          {section.items.map((item) => (
            <li key={item.title} className="case">
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
