import { site } from "../content.js"
import Outbound from "./Outbound.jsx"

export default function Colophon() {
  return (
    <footer className="colophon">
      <div className="frame colophon-inner">
        <p>© {new Date().getFullYear()} {site.name}</p>
        <p>{site.footer}</p>
        <ul>
          <li><a href={`mailto:${site.email}`}>Email</a></li>
          {site.socials.map((item) => (
            <li key={item.href}>
              <Outbound href={item.href}>{item.label}</Outbound>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
