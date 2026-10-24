import { site } from "../content.js"

export default function Story() {
  const section = site.story
  return (
    <section className="section" id="story" aria-labelledby="story-title">
      <div className="shell story-grid">
        <div>
          <header className="section-head">
            <p className="index">{section.index}</p>
            <h2 id="story-title">{section.title}</h2>
          </header>
          <div className="prose">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <dl className="facts">
          {section.facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="shell">
        <h3 className="drives-title">{section.drivesTitle}</h3>
        <ul className="drives">
          {section.drives.map((drive) => (
            <li key={drive.title}>
              <h4>{drive.title}</h4>
              <p>{drive.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
