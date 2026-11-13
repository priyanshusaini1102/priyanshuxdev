import { site } from "../content.js"

export default function ResumeLink({ variant = "ghost", withView = false, className = "", onClick }) {
  const { href, label, fileName } = site.resume
  const buttonClass = [
    "button",
    variant === "small" ? "button-small" : "",
    variant === "solid" ? "" : "button-ghost",
    withView ? "" : className,
  ].filter(Boolean).join(" ")

  const download = (
    <a className={buttonClass} href={href} download={fileName} onClick={onClick}>
      {label}
      <span className="sr-only"> (PDF)</span>
    </a>
  )

  if (!withView) return download

  return (
    <div className={["resume-pair", className].filter(Boolean).join(" ")} role="group" aria-label="Resume">
      {download}
      <a className="resume-view" href={href} target="_blank" rel="noopener noreferrer">
        View
        <span className="sr-only"> resume (opens in a new tab)</span>
      </a>
    </div>
  )
}
