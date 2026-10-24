import { site } from "../content.js"
import ExternalLink from "./ExternalLink.jsx"

export default function Contact() {
  const section = site.contact
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="shell">
        <header className="section-head">
          <p className="index">{section.index}</p>
          <div>
            <h2 id="contact-title">{section.title}</h2>
            <p className="lede">{section.lede}</p>
          </div>
        </header>
        <p className="email-line">
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <ul className="socials">
          {site.socials.map((item) => (
            <li key={item.label}>
              {item.placeholder || !item.href ? (
                <span className="social-placeholder">
                  <span className="flag flag-quiet">Placeholder</span>
                  <span>{item.label}</span>
                  <span className="quiet">{item.note}</span>
                </span>
              ) : (
                <ExternalLink href={item.href}>{item.text || item.label}</ExternalLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
