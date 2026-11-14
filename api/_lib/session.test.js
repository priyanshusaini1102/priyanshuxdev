import { afterEach, describe, expect, it } from "vitest"
import {
  clearSessionCookie,
  passwordsMatch,
  readCookie,
  sessionCookie,
  signSession,
  verifySession,
} from "./session.js"

const SECRET = "test-session-secret-value"

describe("session", () => {
  afterEach(() => {
    delete process.env.VERCEL
  })

  it("compares passwords without depending on length", () => {
    expect(passwordsMatch("correct horse", "correct horse")).toBe(true)
    expect(passwordsMatch("nope", "correct horse")).toBe(false)
    expect(passwordsMatch("", "correct horse")).toBe(false)
    expect(passwordsMatch("correct horse", "")).toBe(false)
  })

  it("signs a token that verifies until it expires", () => {
    const token = signSession(SECRET, 1_000)
    const payload = JSON.parse(Buffer.from(token.split(".")[0], "base64url").toString("utf8"))
    expect(verifySession(token, SECRET, payload.exp - 1)?.v).toBe(1)
    expect(verifySession(token, SECRET, payload.exp)).toBeNull()
  })

  it("rejects tampering, the wrong secret, and junk", () => {
    const token = signSession(SECRET, 5_000)
    const [payload, signature] = token.split(".")
    expect(verifySession(`${payload}.${signature.slice(0, -1)}a`, SECRET, 5_000)).toBeNull()
    expect(verifySession(`${payload}x.${signature}`, SECRET, 5_000)).toBeNull()
    expect(verifySession(token, "other-secret-value", 5_000)).toBeNull()
    expect(verifySession("not-a-token", SECRET, 5_000)).toBeNull()
    expect(verifySession("", SECRET, 5_000)).toBeNull()
  })

  it("reads the session cookie and sets HttpOnly, SameSite, and Secure on HTTPS", () => {
    expect(readCookie("a=1; admin_session=abc.def; b=2", "admin_session")).toBe("abc.def")
    expect(readCookie(undefined, "admin_session")).toBe("")

    const http = sessionCookie("token.value", { headers: {} })
    expect(http).toContain("HttpOnly")
    expect(http).toContain("SameSite=Strict")
    expect(http).toContain("Path=/api")
    expect(http).toContain("Max-Age=604800")
    expect(http).not.toContain("Secure")

    const https = sessionCookie("token.value", { headers: { "x-forwarded-proto": "https" } })
    expect(https).toContain("Secure")

    process.env.VERCEL = "1"
    expect(sessionCookie("token.value", { headers: {} })).toContain("Secure")
    expect(clearSessionCookie({ headers: { "x-forwarded-proto": "https" } })).toContain("Max-Age=0")
  })
})
