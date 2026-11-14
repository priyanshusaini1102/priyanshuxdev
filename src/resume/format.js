export function educationSchool(entry) {
  const city = String(entry.location || "").split(",")[0].trim()
  if (city && !String(entry.school).includes(city)) return `${entry.school}, ${city}`
  return entry.school
}

export function roleWhen(role, job, index) {
  if (index === 0 && job.location) return `${role.dates} · ${job.location}`
  return role.dates
}

export function visibleStrings(resume) {
  const lines = [
    resume.name,
    ...resume.contact.map((item) => item.label),
    resume.summary,
    ...resume.skills.flatMap((skill) => [`${skill.label}:`, skill.items]),
  ]

  for (const job of resume.experience) {
    lines.push(job.company, job.dates)
    job.roles.forEach((role, index) => {
      lines.push(role.title, roleWhen(role, job, index), ...role.bullets)
    })
  }

  for (const project of resume.projects) {
    lines.push(project.name, project.linkLabel, project.stack, ...project.bullets)
  }

  for (const school of resume.education) {
    lines.push(`${educationSchool(school)} — ${school.degree}`, school.dates)
  }

  return lines.filter((line) => typeof line === "string" && line.trim() !== "")
}

export function normalizeSpace(value) {
  return String(value).replace(/\s+/g, " ").trim()
}
