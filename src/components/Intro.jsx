import { site } from "../content.js"

export default function Intro() {
  const { hero } = site
  return (
    <section className="intro" id="top" aria-labelledby="intro-title">
      <div className="frame intro-grid">
        <div className="intro-copy">
          <p className="eyebrow">{hero.kicker}</p>
          <h1 id="intro-title">{hero.title}</h1>
          <p className="deck">{hero.lede}</p>
          <div className="intro-actions">
            <a className="button" href="#contact">{hero.primaryCta}</a>
            <a className="button button-ghost" href="#work">{hero.secondaryCta}</a>
          </div>
        </div>

        <aside className="sheet" aria-label={hero.sheetLabel}>
          <div className="sheet-head">
            <p>{hero.sheetLabel}</p>
            <p className="stamp">{hero.stamp}</p>
          </div>
          <dl>
            {hero.sheet.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  )
}
