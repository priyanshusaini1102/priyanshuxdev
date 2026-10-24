import { site } from "../content.js"
import ExternalLink from "./ExternalLink.jsx"

export default function Hero() {
  const email = site.socials.find((item) => item.label === "Email")
  const github = site.socials.find((item) => item.label === "GitHub")
  const linkedin = site.socials.find((item) => item.label === "LinkedIn")

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="shell hero-grid">
        <div>
          <p className="kicker">{site.hero.kicker}</p>
          <h1 id="hero-title" className="hero-title">
            <span className="hero-name">{site.name}</span>
            <span className="hero-line">{site.hero.lines[0]}</span>
            <span className="hero-line">
              <em className="mark">{site.hero.lines[1]}</em>
            </span>
          </h1>
          <p className="lede">{site.hero.lede}</p>
          <div className="hero-actions">
            <ExternalLink className="button" href={email.href}>Email</ExternalLink>
            <ExternalLink className="text-link" href={github.href}>GitHub</ExternalLink>
            <ExternalLink className="text-link" href={linkedin.href}>LinkedIn</ExternalLink>
          </div>
          <p className="path" aria-label="Path">
            {site.hero.path.map((step, index) => (
              <span key={step}>
                {index > 0 ? <span className="path-arrow" aria-hidden="true">→</span> : null}
                {step}
              </span>
            ))}
          </p>
        </div>

        <aside className="bench" aria-label={site.hero.asideLabel}>
          <p className="bench-label">{site.hero.asideLabel}</p>
          <dl>
            {site.hero.aside.map((row) => (
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
