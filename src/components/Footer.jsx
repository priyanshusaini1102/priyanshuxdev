import { site } from "../content.js"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <p>© {year} {site.footer}</p>
        <p className="quiet">{site.role}</p>
      </div>
    </footer>
  )
}
