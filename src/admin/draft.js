export function uid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()
  return `id-${Math.random().toString(36).slice(2, 10)}`
}

function withBullets(bullets) {
  return (bullets || []).map((text) => ({ id: uid(), text }))
}

export function decorate(resume) {
  return {
    name: resume.name || "",
    contact: (resume.contact || []).map((item) => ({
      id: uid(),
      label: item.label || "",
      href: item.href || "",
    })),
    summary: resume.summary || "",
    skills: (resume.skills || []).map((item) => ({
      id: uid(),
      label: item.label || "",
      items: item.items || "",
    })),
    experience: (resume.experience || []).map((job) => ({
      id: uid(),
      company: job.company || "",
      dates: job.dates || "",
      location: job.location || "",
      roles: (job.roles || []).map((role) => ({
        id: uid(),
        title: role.title || "",
        dates: role.dates || "",
        bullets: withBullets(role.bullets),
      })),
    })),
    projects: (resume.projects || []).map((project) => ({
      id: uid(),
      name: project.name || "",
      linkLabel: project.linkLabel || "",
      href: project.href || "",
      stack: project.stack || "",
      bullets: withBullets(project.bullets),
    })),
    education: (resume.education || []).map((school) => ({
      id: uid(),
      school: school.school || "",
      degree: school.degree || "",
      dates: school.dates || "",
      location: school.location || "",
    })),
  }
}

export function undecorate(draft) {
  return {
    name: draft.name,
    contact: draft.contact.map(({ label, href }) => ({ label, href })),
    summary: draft.summary,
    skills: draft.skills.map(({ label, items }) => ({ label, items })),
    experience: draft.experience.map((job) => ({
      company: job.company,
      dates: job.dates,
      location: job.location,
      roles: job.roles.map((role) => ({
        title: role.title,
        dates: role.dates,
        bullets: role.bullets.map((bullet) => bullet.text),
      })),
    })),
    projects: draft.projects.map((project) => ({
      name: project.name,
      linkLabel: project.linkLabel,
      href: project.href,
      stack: project.stack,
      bullets: project.bullets.map((bullet) => bullet.text),
    })),
    education: draft.education.map(({ school, degree, dates, location }) => ({
      school,
      degree,
      dates,
      location,
    })),
  }
}

export function moveItem(list, index, direction) {
  const target = index + direction
  if (target < 0 || target >= list.length) return list
  const next = list.slice()
  const [item] = next.splice(index, 1)
  next.splice(target, 0, item)
  return next
}

export function blankContact() {
  return { id: uid(), label: "", href: "" }
}

export function blankSkill() {
  return { id: uid(), label: "", items: "" }
}

export function blankBullet() {
  return { id: uid(), text: "" }
}

export function blankRole() {
  return { id: uid(), title: "", dates: "", bullets: [blankBullet()] }
}

export function blankJob() {
  return { id: uid(), company: "", dates: "", location: "", roles: [blankRole()] }
}

export function blankProject() {
  return { id: uid(), name: "", linkLabel: "", href: "", stack: "", bullets: [blankBullet()] }
}

export function blankSchool() {
  return { id: uid(), school: "", degree: "", dates: "", location: "" }
}
