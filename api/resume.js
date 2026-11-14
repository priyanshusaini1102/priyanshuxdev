import { createRequire } from "node:module"
import { getEnv } from "./_lib/env.js"
import { fetchResumeFromGitHub, publishResume } from "./_lib/github.js"
import { jsonBody, rejectMethod, sameOrigin, send } from "./_lib/http.js"
import { COOKIE_NAME, readCookie, verifySession } from "./_lib/session.js"
import { validatePdfBase64 } from "./_lib/pdf.js"
import { resumeToJson, validateResume } from "../src/resume/validate.js"

const require = createRequire(import.meta.url)
const bundledResume = require("../src/data/resume.json")

function requireUser(req, res) {
  const env = getEnv()
  if (!env.enabled) {
    send(res, 503, { error: "Admin login is disabled until ADMIN_PASSWORD and ADMIN_SESSION_SECRET are set.", disabled: true })
    return null
  }
  if (!sameOrigin(req)) {
    send(res, 403, { error: "Cross-origin request was blocked." })
    return null
  }
  const token = readCookie(req.headers?.cookie, COOKIE_NAME)
  if (!verifySession(token, env.secret)) {
    send(res, 401, { error: "Sign in again." })
    return null
  }
  return env
}

function githubFailure(res, error) {
  const status = error.status === 401 || error.status === 403 ? 502 : error.status || 502
  const message = status === 409
    ? error.message
    : error.message || "GitHub request failed."
  return send(res, status === 409 ? 409 : status, { error: message })
}

export default async function handler(req, res) {
  if (req.method === "GET") return readResume(req, res)
  if (req.method === "POST") return writeResume(req, res)
  if (rejectMethod(req, res, "GET, POST")) return undefined
  return undefined
}

async function readResume(req, res) {
  const env = requireUser(req, res)
  if (!env) return
  if (!env.githubToken) {
    return send(res, 200, {
      resume: bundledResume,
      source: "bundle",
      warning: "GITHUB_TOKEN is not set, so this is the resume bundled with the deploy. Publishing stays off until the token is set.",
    })
  }

  try {
    const latest = await fetchResumeFromGitHub(env)
    const validated = validateResume(latest.resume)
    if (!validated.ok) {
      return send(res, 200, {
        resume: bundledResume,
        source: "bundle",
        warning: "The resume on GitHub did not match the expected shape. Showing the copy bundled with this deploy.",
      })
    }
    return send(res, 200, {
      resume: validated.resume,
      source: "github",
      commit: latest.commit,
    })
  } catch (error) {
    if (error.status === 404) {
      return send(res, 200, {
        resume: bundledResume,
        source: "bundle",
        warning: "resume.json is not on the branch yet. Showing the copy bundled with this deploy.",
      })
    }
    return githubFailure(res, error)
  }
}

async function writeResume(req, res) {
  const env = requireUser(req, res)
  if (!env) return
  if (!env.githubToken) {
    return send(res, 503, { error: "Publishing is off until GITHUB_TOKEN is set." })
  }

  const body = jsonBody(req)
  if (!body.ok) return send(res, 400, { error: body.error })
  const validated = validateResume(body.value?.resume)
  if (!validated.ok) {
    return send(res, 400, { error: "Resume needs a few fixes before it can be published.", errors: validated.errors })
  }
  const pdf = validatePdfBase64(body.value?.pdfBase64)
  if (!pdf.ok) return send(res, 400, { error: pdf.error })

  try {
    const commit = await publishResume({
      token: env.githubToken,
      repo: env.repo,
      branch: env.branch,
      jsonText: resumeToJson(validated.resume),
      pdfBase64: pdf.base64,
    })
    return send(res, 200, {
      ok: true,
      message: "Published, live in about a minute",
      commit,
      resume: validated.resume,
    })
  } catch (error) {
    return githubFailure(res, error)
  }
}
