import { site } from "../content.js"

export default function Process() {
  const section = site.process
  return (
    <section className="band band-tight" id="process" aria-labelledby="process-title">
      <div className="frame">
        <header className="band-head">
          <h2 id="process-title">{section.title}</h2>
          <p>{section.lede}</p>
        </header>
        <ol className="steps">
          {section.steps.map((step, index) => (
            <li key={step.title}>
              <span className="step-no">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
