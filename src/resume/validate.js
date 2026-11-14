export const LIMITS = {
  name: 120,
  summary: 2500,
  label: 180,
  href: 400,
  skillItems: 1200,
  company: 140,
  dates: 80,
  location: 80,
  title: 160,
  bullet: 800,
  projectName: 200,
  stack: 600,
  school: 160,
  degree: 200,
  contacts: 12,
  skills: 16,
  jobs: 12,
  rolesPerJob: 8,
  bullets: 24,
  projects: 12,
  education: 8,
  jsonBytes: 100_000,
  pdfBytes: 2_000_000,
}

const HREF = /^(https?:\/\/|mailto:)[^\s]+$/i

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function push(errors, path, message) {
  errors.push({ path, message })
}

function text(value, path, max, errors, { required = false } = {}) {
  if (typeof value !== "string") {
    push(errors, path, "Must be text.")
    return ""
  }
  if (value.length > max) push(errors, path, `Use ${max} characters or fewer.`)
  if (required && value.trim() === "") push(errors, path, "This field is required.")
  return value
}

function href(value, path, errors) {
  const link = text(value, path, LIMITS.href, errors)
  if (link && !HREF.test(link)) {
    push(errors, path, "Use an https, http, or mailto link, or leave it blank.")
  }
  return link
}

function list(value, path, max, errors) {
  if (!Array.isArray(value)) {
    push(errors, path, "Must be a list.")
    return []
  }
  if (value.length > max) push(errors, path, `Use ${max} items or fewer.`)
  return value
}

export function validateResume(input) {
  const errors = []
  if (!isRecord(input)) {
    return { ok: false, errors: [{ path: "", message: "Resume must be an object." }], resume: null }
  }

  const name = text(input.name, "name", LIMITS.name, errors, { required: true })
  const summary = text(input.summary, "summary", LIMITS.summary, errors, { required: true })

  const contact = list(input.contact, "contact", LIMITS.contacts, errors).map((item, index) => {
    const path = `contact.${index}`
    if (!isRecord(item)) {
      push(errors, path, "Contact entry must be an object.")
      return { label: "", href: "" }
    }
    return {
      label: text(item.label, `${path}.label`, LIMITS.label, errors, { required: true }),
      href: href(item.href, `${path}.href`, errors),
    }
  })

  const skills = list(input.skills, "skills", LIMITS.skills, errors).map((item, index) => {
    const path = `skills.${index}`
    if (!isRecord(item)) {
      push(errors, path, "Skill group must be an object.")
      return { label: "", items: "" }
    }
    return {
      label: text(item.label, `${path}.label`, LIMITS.label, errors, { required: true }),
      items: text(item.items, `${path}.items`, LIMITS.skillItems, errors, { required: true }),
    }
  })

  const experience = list(input.experience, "experience", LIMITS.jobs, errors).map((job, index) => {
    const path = `experience.${index}`
    if (!isRecord(job)) {
      push(errors, path, "Experience entry must be an object.")
      return { company: "", dates: "", location: "", roles: [] }
    }
    const roles = list(job.roles, `${path}.roles`, LIMITS.rolesPerJob, errors).map((role, roleIndex) => {
      const rolePath = `${path}.roles.${roleIndex}`
      if (!isRecord(role)) {
        push(errors, rolePath, "Role must be an object.")
        return { title: "", dates: "", bullets: [] }
      }
      const bullets = list(role.bullets, `${rolePath}.bullets`, LIMITS.bullets, errors).map((bullet, bulletIndex) => (
        text(bullet, `${rolePath}.bullets.${bulletIndex}`, LIMITS.bullet, errors, { required: true })
      ))
      return {
        title: text(role.title, `${rolePath}.title`, LIMITS.title, errors, { required: true }),
        dates: text(role.dates, `${rolePath}.dates`, LIMITS.dates, errors, { required: true }),
        bullets,
      }
    })
    if (roles.length === 0) push(errors, `${path}.roles`, "Add at least one role.")
    return {
      company: text(job.company, `${path}.company`, LIMITS.company, errors, { required: true }),
      dates: text(job.dates, `${path}.dates`, LIMITS.dates, errors, { required: true }),
      location: text(job.location, `${path}.location`, LIMITS.location, errors),
      roles,
    }
  })

  const projects = list(input.projects, "projects", LIMITS.projects, errors).map((project, index) => {
    const path = `projects.${index}`
    if (!isRecord(project)) {
      push(errors, path, "Project must be an object.")
      return { name: "", linkLabel: "", href: "", stack: "", bullets: [] }
    }
    const bullets = list(project.bullets, `${path}.bullets`, LIMITS.bullets, errors).map((bullet, bulletIndex) => (
      text(bullet, `${path}.bullets.${bulletIndex}`, LIMITS.bullet, errors, { required: true })
    ))
    return {
      name: text(project.name, `${path}.name`, LIMITS.projectName, errors, { required: true }),
      linkLabel: text(project.linkLabel, `${path}.linkLabel`, LIMITS.label, errors),
      href: href(project.href, `${path}.href`, errors),
      stack: text(project.stack, `${path}.stack`, LIMITS.stack, errors),
      bullets,
    }
  })

  const education = list(input.education, "education", LIMITS.education, errors).map((school, index) => {
    const path = `education.${index}`
    if (!isRecord(school)) {
      push(errors, path, "Education entry must be an object.")
      return { school: "", degree: "", dates: "", location: "" }
    }
    return {
      school: text(school.school, `${path}.school`, LIMITS.school, errors, { required: true }),
      degree: text(school.degree, `${path}.degree`, LIMITS.degree, errors, { required: true }),
      dates: text(school.dates, `${path}.dates`, LIMITS.dates, errors, { required: true }),
      location: text(school.location, `${path}.location`, LIMITS.location, errors),
    }
  })

  const resume = { name, contact, summary, skills, experience, projects, education }
  if (JSON.stringify(resume).length > LIMITS.jsonBytes) {
    push(errors, "", "Resume is too large to publish.")
  }

  return { ok: errors.length === 0, errors, resume: errors.length === 0 ? resume : null }
}

export function resumeToJson(resume) {
  return `${JSON.stringify(resume, null, 2)}\n`
}

export function errorFor(errors, path) {
  return errors.find((error) => error.path === path)?.message || ""
}
