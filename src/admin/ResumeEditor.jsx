import { useId } from "react"
import { educationSchool, roleWhen } from "../resume/format.js"
import { LIMITS, errorFor } from "../resume/validate.js"
import {
  blankBullet,
  blankContact,
  blankJob,
  blankProject,
  blankRole,
  blankSchool,
  blankSkill,
  moveItem,
} from "./draft.js"

function TextField({ label, value, onChange, maxLength, multiline = false, rows = 3, hint = "", error = "", spellCheck = true }) {
  const id = useId()
  const control = multiline ? (
    <textarea
      id={id}
      value={value}
      rows={rows}
      maxLength={maxLength}
      spellCheck={spellCheck}
      aria-invalid={Boolean(error)}
      onChange={(event) => onChange(event.target.value)}
    />
  ) : (
    <input
      id={id}
      value={value}
      maxLength={maxLength}
      spellCheck={spellCheck}
      aria-invalid={Boolean(error)}
      onChange={(event) => onChange(event.target.value)}
    />
  )
  return (
    <div className="admin-field">
      <label htmlFor={id}>{label}</label>
      {control}
      {hint ? <p className="admin-hint">{hint}</p> : null}
      {error ? <p className="admin-error">{error}</p> : null}
    </div>
  )
}

function RowActions({ label, index, total, onUp, onDown, onRemove }) {
  return (
    <div className="admin-row-actions">
      <button type="button" className="admin-text" onClick={onUp} disabled={index === 0}>Up</button>
      <button type="button" className="admin-text" onClick={onDown} disabled={index === total - 1}>Down</button>
      <button type="button" className="admin-text danger" onClick={onRemove}>Remove {label}</button>
    </div>
  )
}

function Section({ kicker, title, action, children }) {
  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <div>
          <p className="eyebrow">{kicker}</p>
          <h2>{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function confirmRemove(label) {
  return window.confirm(`Remove this ${label}?`)
}

export default function ResumeEditor({ draft, onChange, errors }) {
  const replace = (key, list) => onChange({ ...draft, [key]: list })

  return (
    <form className="admin-editor" autoComplete="off" onSubmit={(event) => event.preventDefault()}>
      <Section kicker="01" title="Name and contact">
        <TextField
          label="Name"
          value={draft.name}
          maxLength={LIMITS.name}
          error={errorFor(errors, "name")}
          onChange={(name) => onChange({ ...draft, name })}
        />
        <div className="admin-stack">
          {draft.contact.map((item, index) => (
            <article className="admin-block" key={item.id}>
              <div className="admin-block-head">
                <p className="admin-kicker">Link {index + 1}</p>
                <RowActions
                  label="link"
                  index={index}
                  total={draft.contact.length}
                  onUp={() => replace("contact", moveItem(draft.contact, index, -1))}
                  onDown={() => replace("contact", moveItem(draft.contact, index, 1))}
                  onRemove={() => {
                    if (!confirmRemove("contact link")) return
                    replace("contact", draft.contact.filter((entry) => entry.id !== item.id))
                  }}
                />
              </div>
              <div className="admin-grid-2">
                <TextField
                  label="Label"
                  value={item.label}
                  maxLength={LIMITS.label}
                  error={errorFor(errors, `contact.${index}.label`)}
                  onChange={(label) => replace("contact", draft.contact.map((entry) => (
                    entry.id === item.id ? { ...entry, label } : entry
                  )))}
                />
                <TextField
                  label="Link"
                  value={item.href}
                  maxLength={LIMITS.href}
                  spellCheck={false}
                  hint="Leave blank for a phone number. Otherwise use https:// or mailto:."
                  error={errorFor(errors, `contact.${index}.href`)}
                  onChange={(href) => replace("contact", draft.contact.map((entry) => (
                    entry.id === item.id ? { ...entry, href } : entry
                  )))}
                />
              </div>
            </article>
          ))}
        </div>
        <button type="button" className="button button-ghost button-small" onClick={() => replace("contact", [...draft.contact, blankContact()])}>
          Add contact link
        </button>
      </Section>

      <Section kicker="02" title="Summary">
        <TextField
          label="Summary"
          value={draft.summary}
          maxLength={LIMITS.summary}
          multiline
          rows={5}
          error={errorFor(errors, "summary")}
          onChange={(summary) => onChange({ ...draft, summary })}
        />
      </Section>

      <Section
        kicker="03"
        title="Technical skills"
        action={(
          <button type="button" className="button button-ghost button-small" onClick={() => replace("skills", [...draft.skills, blankSkill()])}>
            Add group
          </button>
        )}
      >
        <div className="admin-stack">
          {draft.skills.map((skill, index) => (
            <article className="admin-block" key={skill.id}>
              <div className="admin-block-head">
                <p className="admin-kicker">Group {index + 1}</p>
                <RowActions
                  label="group"
                  index={index}
                  total={draft.skills.length}
                  onUp={() => replace("skills", moveItem(draft.skills, index, -1))}
                  onDown={() => replace("skills", moveItem(draft.skills, index, 1))}
                  onRemove={() => {
                    if (!confirmRemove("skill group")) return
                    replace("skills", draft.skills.filter((entry) => entry.id !== skill.id))
                  }}
                />
              </div>
              <TextField
                label="Label"
                value={skill.label}
                maxLength={LIMITS.label}
                error={errorFor(errors, `skills.${index}.label`)}
                onChange={(label) => replace("skills", draft.skills.map((entry) => (
                  entry.id === skill.id ? { ...entry, label } : entry
                )))}
              />
              <TextField
                label="Skills"
                value={skill.items}
                maxLength={LIMITS.skillItems}
                multiline
                rows={3}
                error={errorFor(errors, `skills.${index}.items`)}
                onChange={(items) => replace("skills", draft.skills.map((entry) => (
                  entry.id === skill.id ? { ...entry, items } : entry
                )))}
              />
            </article>
          ))}
        </div>
      </Section>

      <Section
        kicker="04"
        title="Experience"
        action={(
          <button type="button" className="button button-ghost button-small" onClick={() => replace("experience", [...draft.experience, blankJob()])}>
            Add company
          </button>
        )}
      >
        <div className="admin-stack">
          {draft.experience.map((job, jobIndex) => (
            <article className="admin-block" key={job.id}>
              <div className="admin-block-head">
                <p className="admin-kicker">Company {jobIndex + 1}</p>
                <RowActions
                  label="company"
                  index={jobIndex}
                  total={draft.experience.length}
                  onUp={() => replace("experience", moveItem(draft.experience, jobIndex, -1))}
                  onDown={() => replace("experience", moveItem(draft.experience, jobIndex, 1))}
                  onRemove={() => {
                    if (!confirmRemove("company")) return
                    replace("experience", draft.experience.filter((entry) => entry.id !== job.id))
                  }}
                />
              </div>
              <div className="admin-grid-2">
                <TextField
                  label="Company"
                  value={job.company}
                  maxLength={LIMITS.company}
                  error={errorFor(errors, `experience.${jobIndex}.company`)}
                  onChange={(company) => replace("experience", draft.experience.map((entry) => (
                    entry.id === job.id ? { ...entry, company } : entry
                  )))}
                />
                <TextField
                  label="Dates"
                  value={job.dates}
                  maxLength={LIMITS.dates}
                  spellCheck={false}
                  error={errorFor(errors, `experience.${jobIndex}.dates`)}
                  onChange={(dates) => replace("experience", draft.experience.map((entry) => (
                    entry.id === job.id ? { ...entry, dates } : entry
                  )))}
                />
              </div>
              <TextField
                label="Location"
                value={job.location}
                maxLength={LIMITS.location}
                hint="Shown beside the first role."
                error={errorFor(errors, `experience.${jobIndex}.location`)}
                onChange={(location) => replace("experience", draft.experience.map((entry) => (
                  entry.id === job.id ? { ...entry, location } : entry
                )))}
              />
              {errorFor(errors, `experience.${jobIndex}.roles`) ? (
                <p className="admin-error">{errorFor(errors, `experience.${jobIndex}.roles`)}</p>
              ) : null}
              <div className="admin-stack">
                {job.roles.map((role, roleIndex) => (
                  <article className="admin-role" key={role.id}>
                    <div className="admin-block-head">
                      <p className="admin-kicker">Role {roleIndex + 1}</p>
                      <RowActions
                        label="role"
                        index={roleIndex}
                        total={job.roles.length}
                        onUp={() => replace("experience", draft.experience.map((entry) => (
                          entry.id === job.id ? { ...entry, roles: moveItem(entry.roles, roleIndex, -1) } : entry
                        )))}
                        onDown={() => replace("experience", draft.experience.map((entry) => (
                          entry.id === job.id ? { ...entry, roles: moveItem(entry.roles, roleIndex, 1) } : entry
                        )))}
                        onRemove={() => {
                          if (!confirmRemove("role")) return
                          replace("experience", draft.experience.map((entry) => (
                            entry.id === job.id ? { ...entry, roles: entry.roles.filter((item) => item.id !== role.id) } : entry
                          )))
                        }}
                      />
                    </div>
                    <div className="admin-grid-2">
                      <TextField
                        label="Title"
                        value={role.title}
                        maxLength={LIMITS.title}
                        error={errorFor(errors, `experience.${jobIndex}.roles.${roleIndex}.title`)}
                        onChange={(title) => replace("experience", draft.experience.map((entry) => (
                          entry.id === job.id
                            ? { ...entry, roles: entry.roles.map((item) => (item.id === role.id ? { ...item, title } : item)) }
                            : entry
                        )))}
                      />
                      <TextField
                        label="Dates"
                        value={role.dates}
                        maxLength={LIMITS.dates}
                        spellCheck={false}
                        hint={roleIndex === 0 ? `Prints as “${roleWhen(role, job, 0)}”.` : ""}
                        error={errorFor(errors, `experience.${jobIndex}.roles.${roleIndex}.dates`)}
                        onChange={(dates) => replace("experience", draft.experience.map((entry) => (
                          entry.id === job.id
                            ? { ...entry, roles: entry.roles.map((item) => (item.id === role.id ? { ...item, dates } : item)) }
                            : entry
                        )))}
                      />
                    </div>
                    <div className="admin-bullets">
                      {role.bullets.map((bullet, bulletIndex) => (
                        <div className="admin-bullet" key={bullet.id}>
                          <TextField
                            label={`Bullet ${bulletIndex + 1}`}
                            value={bullet.text}
                            maxLength={LIMITS.bullet}
                            multiline
                            rows={3}
                            error={errorFor(errors, `experience.${jobIndex}.roles.${roleIndex}.bullets.${bulletIndex}`)}
                            onChange={(text) => replace("experience", draft.experience.map((entry) => (
                              entry.id === job.id
                                ? {
                                  ...entry,
                                  roles: entry.roles.map((item) => (
                                    item.id === role.id
                                      ? { ...item, bullets: item.bullets.map((line) => (line.id === bullet.id ? { ...line, text } : line)) }
                                      : item
                                  )),
                                }
                                : entry
                            )))}
                          />
                          <div className="admin-row-actions">
                            <button
                              type="button"
                              className="admin-text"
                              disabled={bulletIndex === 0}
                              onClick={() => replace("experience", draft.experience.map((entry) => (
                                entry.id === job.id
                                  ? { ...entry, roles: entry.roles.map((item) => (item.id === role.id ? { ...item, bullets: moveItem(item.bullets, bulletIndex, -1) } : item)) }
                                  : entry
                              )))}
                            >
                              Up
                            </button>
                            <button
                              type="button"
                              className="admin-text"
                              disabled={bulletIndex === role.bullets.length - 1}
                              onClick={() => replace("experience", draft.experience.map((entry) => (
                                entry.id === job.id
                                  ? { ...entry, roles: entry.roles.map((item) => (item.id === role.id ? { ...item, bullets: moveItem(item.bullets, bulletIndex, 1) } : item)) }
                                  : entry
                              )))}
                            >
                              Down
                            </button>
                            <button
                              type="button"
                              className="admin-text danger"
                              onClick={() => replace("experience", draft.experience.map((entry) => (
                                entry.id === job.id
                                  ? { ...entry, roles: entry.roles.map((item) => (item.id === role.id ? { ...item, bullets: item.bullets.filter((line) => line.id !== bullet.id) } : item)) }
                                  : entry
                              )))}
                            >
                              Remove bullet
                            </button>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="button button-ghost button-small"
                        onClick={() => replace("experience", draft.experience.map((entry) => (
                          entry.id === job.id
                            ? { ...entry, roles: entry.roles.map((item) => (item.id === role.id ? { ...item, bullets: [...item.bullets, blankBullet()] } : item)) }
                            : entry
                        )))}
                      >
                        Add bullet
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <button
                type="button"
                className="button button-ghost button-small"
                onClick={() => replace("experience", draft.experience.map((entry) => (
                  entry.id === job.id ? { ...entry, roles: [...entry.roles, blankRole()] } : entry
                )))}
              >
                Add role
              </button>
            </article>
          ))}
        </div>
      </Section>

      <Section
        kicker="05"
        title="Projects"
        action={(
          <button type="button" className="button button-ghost button-small" onClick={() => replace("projects", [...draft.projects, blankProject()])}>
            Add project
          </button>
        )}
      >
        <div className="admin-stack">
          {draft.projects.map((project, index) => (
            <article className="admin-block" key={project.id}>
              <div className="admin-block-head">
                <p className="admin-kicker">Project {index + 1}</p>
                <RowActions
                  label="project"
                  index={index}
                  total={draft.projects.length}
                  onUp={() => replace("projects", moveItem(draft.projects, index, -1))}
                  onDown={() => replace("projects", moveItem(draft.projects, index, 1))}
                  onRemove={() => {
                    if (!confirmRemove("project")) return
                    replace("projects", draft.projects.filter((entry) => entry.id !== project.id))
                  }}
                />
              </div>
              <TextField
                label="Name"
                value={project.name}
                maxLength={LIMITS.projectName}
                error={errorFor(errors, `projects.${index}.name`)}
                onChange={(name) => replace("projects", draft.projects.map((entry) => (
                  entry.id === project.id ? { ...entry, name } : entry
                )))}
              />
              <div className="admin-grid-2">
                <TextField
                  label="Link label"
                  value={project.linkLabel}
                  maxLength={LIMITS.label}
                  spellCheck={false}
                  error={errorFor(errors, `projects.${index}.linkLabel`)}
                  onChange={(linkLabel) => replace("projects", draft.projects.map((entry) => (
                    entry.id === project.id ? { ...entry, linkLabel } : entry
                  )))}
                />
                <TextField
                  label="Link"
                  value={project.href}
                  maxLength={LIMITS.href}
                  spellCheck={false}
                  error={errorFor(errors, `projects.${index}.href`)}
                  onChange={(href) => replace("projects", draft.projects.map((entry) => (
                    entry.id === project.id ? { ...entry, href } : entry
                  )))}
                />
              </div>
              <TextField
                label="Stack"
                value={project.stack}
                maxLength={LIMITS.stack}
                error={errorFor(errors, `projects.${index}.stack`)}
                onChange={(stack) => replace("projects", draft.projects.map((entry) => (
                  entry.id === project.id ? { ...entry, stack } : entry
                )))}
              />
              <div className="admin-bullets">
                {project.bullets.map((bullet, bulletIndex) => (
                  <div className="admin-bullet" key={bullet.id}>
                    <TextField
                      label={`Bullet ${bulletIndex + 1}`}
                      value={bullet.text}
                      maxLength={LIMITS.bullet}
                      multiline
                      rows={3}
                      error={errorFor(errors, `projects.${index}.bullets.${bulletIndex}`)}
                      onChange={(text) => replace("projects", draft.projects.map((entry) => (
                        entry.id === project.id
                          ? { ...entry, bullets: entry.bullets.map((line) => (line.id === bullet.id ? { ...line, text } : line)) }
                          : entry
                      )))}
                    />
                    <div className="admin-row-actions">
                      <button type="button" className="admin-text" disabled={bulletIndex === 0} onClick={() => replace("projects", draft.projects.map((entry) => (
                        entry.id === project.id ? { ...entry, bullets: moveItem(entry.bullets, bulletIndex, -1) } : entry
                      )))}
                      >
                        Up
                      </button>
                      <button type="button" className="admin-text" disabled={bulletIndex === project.bullets.length - 1} onClick={() => replace("projects", draft.projects.map((entry) => (
                        entry.id === project.id ? { ...entry, bullets: moveItem(entry.bullets, bulletIndex, 1) } : entry
                      )))}
                      >
                        Down
                      </button>
                      <button type="button" className="admin-text danger" onClick={() => replace("projects", draft.projects.map((entry) => (
                        entry.id === project.id ? { ...entry, bullets: entry.bullets.filter((line) => line.id !== bullet.id) } : entry
                      )))}
                      >
                        Remove bullet
                      </button>
                    </div>
                  </div>
                ))}
                <button type="button" className="button button-ghost button-small" onClick={() => replace("projects", draft.projects.map((entry) => (
                  entry.id === project.id ? { ...entry, bullets: [...entry.bullets, blankBullet()] } : entry
                )))}
                >
                  Add bullet
                </button>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        kicker="06"
        title="Education"
        action={(
          <button type="button" className="button button-ghost button-small" onClick={() => replace("education", [...draft.education, blankSchool()])}>
            Add school
          </button>
        )}
      >
        <div className="admin-stack">
          {draft.education.map((school, index) => (
            <article className="admin-block" key={school.id}>
              <div className="admin-block-head">
                <p className="admin-kicker">School {index + 1}</p>
                <RowActions
                  label="school"
                  index={index}
                  total={draft.education.length}
                  onUp={() => replace("education", moveItem(draft.education, index, -1))}
                  onDown={() => replace("education", moveItem(draft.education, index, 1))}
                  onRemove={() => {
                    if (!confirmRemove("school")) return
                    replace("education", draft.education.filter((entry) => entry.id !== school.id))
                  }}
                />
              </div>
              <div className="admin-grid-2">
                <TextField
                  label="School"
                  value={school.school}
                  maxLength={LIMITS.school}
                  error={errorFor(errors, `education.${index}.school`)}
                  onChange={(value) => replace("education", draft.education.map((entry) => (
                    entry.id === school.id ? { ...entry, school: value } : entry
                  )))}
                />
                <TextField
                  label="Degree"
                  value={school.degree}
                  maxLength={LIMITS.degree}
                  error={errorFor(errors, `education.${index}.degree`)}
                  onChange={(degree) => replace("education", draft.education.map((entry) => (
                    entry.id === school.id ? { ...entry, degree } : entry
                  )))}
                />
              </div>
              <div className="admin-grid-2">
                <TextField
                  label="Dates"
                  value={school.dates}
                  maxLength={LIMITS.dates}
                  spellCheck={false}
                  error={errorFor(errors, `education.${index}.dates`)}
                  onChange={(dates) => replace("education", draft.education.map((entry) => (
                    entry.id === school.id ? { ...entry, dates } : entry
                  )))}
                />
                <TextField
                  label="Location"
                  value={school.location}
                  maxLength={LIMITS.location}
                  hint={`Prints as “${educationSchool(school)} — ${school.degree}”. The city is added when it is not already in the school name.`}
                  error={errorFor(errors, `education.${index}.location`)}
                  onChange={(location) => replace("education", draft.education.map((entry) => (
                    entry.id === school.id ? { ...entry, location } : entry
                  )))}
                />
              </div>
            </article>
          ))}
        </div>
      </Section>
    </form>
  )
}
