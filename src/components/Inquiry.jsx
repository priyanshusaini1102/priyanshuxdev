import { useState } from "react"
import { site } from "../content.js"
import Outbound from "./Outbound.jsx"

export default function Inquiry() {
  const section = site.contact
  const [notice, setNotice] = useState("")

  const onSubmit = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    if (!form.reportValidity()) return

    const data = new FormData(form)
    const name = String(data.get("name") || "").trim()
    const email = String(data.get("email") || "").trim()
    const company = String(data.get("company") || "").trim()
    const need = String(data.get("need") || "").trim()
    const message = String(data.get("message") || "").trim()
    const lines = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      `Need: ${need}`,
      "",
      message,
    ].filter((line) => line !== null)

    setNotice(section.sent)
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`Project inquiry from ${name}`)}&body=${encodeURIComponent(lines.join("\n"))}`
  }

  return (
    <section className="band contact-band" id="contact" aria-labelledby="contact-title">
      <div className="frame contact-grid">
        <div>
          <h2 id="contact-title">{section.title}</h2>
          <p className="deck">{section.lede}</p>
          <p className="mail">
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <ul className="trust">
            {site.socials.map((item) => (
              <li key={item.href}>
                <Outbound href={item.href}>{item.label}</Outbound>
              </li>
            ))}
          </ul>
        </div>

        <form className="inquiry" onSubmit={onSubmit} noValidate={false}>
          <div className="field">
            <label htmlFor="inquiry-name">{section.fields.name}</label>
            <input id="inquiry-name" name="name" type="text" autoComplete="name" required maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor="inquiry-email">{section.fields.email}</label>
            <input id="inquiry-email" name="email" type="email" autoComplete="email" required maxLength={180} />
          </div>
          <div className="field">
            <label htmlFor="inquiry-company">
              {section.fields.company}
              <span> {section.fields.companyHint}</span>
            </label>
            <input id="inquiry-company" name="company" type="text" autoComplete="organization" maxLength={160} />
          </div>
          <div className="field">
            <label htmlFor="inquiry-need">{section.fields.need}</label>
            <select id="inquiry-need" name="need" required defaultValue="">
              <option value="" disabled>{section.fields.needPlaceholder}</option>
              {site.services.items.map((item) => (
                <option key={item.title} value={item.title}>{item.title}</option>
              ))}
              <option value={section.fields.unsure}>{section.fields.unsure}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="inquiry-message">{section.fields.message}</label>
            <textarea id="inquiry-message" name="message" rows={5} required maxLength={2000} />
          </div>
          <button className="button" type="submit">{section.submit}</button>
          <p className="form-note" role="status">{notice}</p>
        </form>
      </div>
    </section>
  )
}
