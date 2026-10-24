import { site } from "../content.js"
import ExternalLink from "./ExternalLink.jsx"

export default function Projects() {
  const section = site.projects
  return (
    <section className="section" id="projects" aria-labelledby="projects-title">
      <div className="shell">
        <header className="section-head">
          <p className="index">{section.index}</p>
          <div>
            <h2 id="projects-title">{section.title}</h2>
            <p className="lede">{section.lede}</p>
          </div>
        </header>
        <ol className="project-list">
          {section.items.map((project, index) => (
            <li key={project.title} className={project.inProgress ? "in-progress" : undefined}>
              <div className="project-top">
                <span className="num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <h3>{project.title}</h3>
                {project.featured ? <span className="flag">Featured</span> : null}
                {project.inProgress ? <span className="flag flag-quiet">In progress</span> : null}
              </div>
              <p>{project.text}</p>
              <ul className="tags" aria-label="Technologies">
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {project.links.length > 0 ? (
                <ul className="project-links">
                  {project.links.map((link) => (
                    <li key={link.href}>
                      <ExternalLink href={link.href}>{link.label}</ExternalLink>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="quiet">No public link yet.</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
