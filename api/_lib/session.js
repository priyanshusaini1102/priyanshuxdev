import { createHash, createHmac, timingSafeEqual } from "node:crypto"

export const COOKIE_NAME = "admin_session"
export const SESSION_MS = 7 * 24 * 60 * 60 * 1000
export const SESSION_MAX_AGE = 7 * 24 * 60 * 60

export function passwordsMatch(input, expected) {
  const left = createHash("sha256").update(String(input), "utf8").digest()
  const right = createHash("sha256").update(String(expected), "utf8").digest()
  return timingSafeEqual(left, right)
}

export function signSession(secret, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ v: 1, exp: now + SESSION_MS }), "utf8").toString("base64url")
  const signature = createHmac("sha256", secret).update(payload).digest("base64url")
  return `${payload}.${signature}`
}

export function verifySession(token, secret, now = Date.now()) {
  if (typeof token !== "string" || !secret) return null
  const parts = token.split(".")
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null
  const [payload, signature] = parts
  const expected = createHmac("sha256", secret).update(payload).digest("base64url")
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"))
    if (!data || data.v !== 1 || typeof data.exp !== "number" || data.exp <= now) return null
    return data
  } catch {
    return null
  }
}

export function readCookie(header, name) {
  if (typeof header !== "string" || header.length === 0) return ""
  for (const part of header.split(";")) {
    const separator = part.indexOf("=")
    if (separator === -1) continue
    const key = part.slice(0, separator).trim()
    if (key === name) return part.slice(separator + 1).trim()
  }
  return ""
}

function cookieAttributes(req, maxAge) {
  const forwarded = String(req.headers?.["x-forwarded-proto"] || "").split(",")[0].trim()
  const secure = forwarded === "https" || process.env.VERCEL === "1"
  const parts = ["HttpOnly", "SameSite=Strict", "Path=/api", `Max-Age=${maxAge}`]
  if (secure) parts.push("Secure")
  return parts.join("; ")
}

export function sessionCookie(token, req) {
  return `${COOKIE_NAME}=${token}; ${cookieAttributes(req, SESSION_MAX_AGE)}`
}

export function clearSessionCookie(req) {
  return `${COOKIE_NAME}=; ${cookieAttributes(req, 0)}`
}
