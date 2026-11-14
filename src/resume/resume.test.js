import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { createElement } from "react"
import { pdf } from "@react-pdf/renderer"
import { describe, expect, it } from "vitest"
import resume from "../data/resume.json"
import { educationSchool, normalizeSpace, roleWhen, visibleStrings } from "./format.js"
import { ResumeDocument } from "./ResumeDocument.jsx"
import { validateResume } from "./validate.js"

function loose(value) {
  return normalizeSpace(value).replace(/- /g, "-")
}

function hasBin(name) {
  try {
    execFileSync("which", [name], { stdio: "ignore" })
    return true
  } catch {
    return false
  }
}

const poppler = hasBin("pdftotext") && hasBin("pdfinfo")

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return walk(path)
    return path
  })
}

describe("resume json", () => {
  it("accepts the committed resume", () => {
    const result = validateResume(resume)
    expect(result.ok).toBe(true)
    expect(result.resume.name).toBe("Priyanshu Saini")
  })

  it("formats education the way the current resume prints it", () => {
    expect(educationSchool(resume.education[0])).toBe("Graphic Era University, Dehradun")
    expect(educationSchool(resume.education[1])).toBe("IMS Noida")
    expect(roleWhen(resume.experience[0].roles[0], resume.experience[0], 0)).toBe("Aug 2026 – Present · Gurugram, India")
    expect(roleWhen(resume.experience[0].roles[1], resume.experience[0], 1)).toBe("Jul 2025 – Jul 2026")
  })

  it("rejects a bad link, a non-object, and an oversized field", () => {
    expect(validateResume(null).ok).toBe(false)
    const badLink = structuredClone(resume)
    badLink.contact[1].href = "javascript:alert(1)"
    const linkResult = validateResume(badLink)
    expect(linkResult.ok).toBe(false)
    expect(linkResult.errors.some((error) => error.path === "contact.1.href")).toBe(true)

    const huge = structuredClone(resume)
    huge.summary = "x".repeat(3000)
    expect(validateResume(huge).ok).toBe(false)

    const emptyRole = structuredClone(resume)
    emptyRole.experience[0].roles = []
    expect(validateResume(emptyRole).errors.some((error) => error.path === "experience.0.roles")).toBe(true)
  })

  it.skipIf(!poppler)("matches every visible string in public/resume.pdf", () => {
    const text = loose(execFileSync("pdftotext", ["-layout", "public/resume.pdf", "-"], { encoding: "utf8" }))
    for (const line of visibleStrings(resume)) {
      expect(text, line.slice(0, 90)).toContain(loose(line))
    }
  })
})

describe("generated pdf", () => {
  it("is one page of selectable text with working links", async () => {
    const blob = await pdf(createElement(ResumeDocument, { resume })).toBlob()
    const buffer = Buffer.from(await blob.arrayBuffer())
    expect(buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-")
    const dir = mkdtempSync(join(tmpdir(), "resume-"))
    const file = join(dir, "resume.pdf")
    writeFileSync(file, buffer)
    writeFileSync("/tmp/resume-generated.pdf", buffer)

    const raw = buffer.toString("latin1")
    expect(raw).toContain("mailto:priyanshusaini1102@gmail.com")
    expect(raw).toContain("https://github.com/priyanshusaini1102/movies-vector-search")
    expect(raw).toContain("https://nukkad.priyanshusaini.in")
    expect(raw).toContain("https://www.linkedin.com/in/priyanshusaini")
    expect(raw).toContain("https://priyanshuxdev.vercel.app")

    if (!poppler) return
    const info = execFileSync("pdfinfo", [file], { encoding: "utf8" })
    expect(info).toMatch(/Pages:\s+1/)
    const text = loose(execFileSync("pdftotext", ["-layout", file, "-"], { encoding: "utf8" }))
    for (const line of visibleStrings(resume)) {
      expect(text, line.slice(0, 90)).toContain(loose(line))
    }
  })
})

describe("public site", () => {
  it("does not link to /admin and does not mention admin secrets", () => {
    const paths = [
      ...walk("src/components"),
      "src/content.js",
      "src/App.jsx",
      "src/index.css",
      "index.html",
    ]
    for (const path of paths) {
      const text = readFileSync(path, "utf8")
      expect(text, path).not.toMatch(/href=["']\/admin/i)
      expect(text, path).not.toContain("ADMIN_PASSWORD")
      expect(text, path).not.toContain("ADMIN_SESSION_SECRET")
      expect(text, path).not.toContain("GITHUB_TOKEN")
    }
  })
})
