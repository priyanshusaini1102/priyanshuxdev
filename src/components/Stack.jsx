import { site } from "../content.js"

export default function Stack() {
  const section = site.stack
  return (
    <section className="band band-tight" id="stack" aria-labelledby="stack-title">
      <div className="frame">
        <header className="band-head">
          <h2 id="stack-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <dl className="stack-table">
          {section.groups.map((group) => (
            <div key={group.label}>
              <dt>{group.label}</dt>
              <dd>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
