import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { validatePdfBase64 } from "./_lib/pdf.js"
import { resetRateLimits } from "./_lib/rateLimit.js"
import { COOKIE_NAME, verifySession } from "./_lib/session.js"
import login from "./login.js"
import resume from "./resume.js"
import session from "./session.js"

const SECRET = "test-session-secret-value"
const PASSWORD = "test-admin-password"

function mockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value },
    status(code) { this.statusCode = code; return this },
    json(data) { this.body = data },
  }
}

function mockReq({ method = "POST", body, headers = {} } = {}) {
  return {
    method,
    body,
    headers: { host: "resume.test", ...headers },
  }
}

describe("admin http", () => {
  beforeEach(() => {
    resetRateLimits()
    process.env.ADMIN_PASSWORD = PASSWORD
    process.env.ADMIN_SESSION_SECRET = SECRET
    delete process.env.GITHUB_TOKEN
    delete process.env.VERCEL
  })

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD
    delete process.env.ADMIN_SESSION_SECRET
    delete process.env.GITHUB_TOKEN
    delete process.env.VERCEL
    resetRateLimits()
  })

  it("fails closed when the env vars are missing", async () => {
    delete process.env.ADMIN_PASSWORD
    const response = mockRes()
    await login(mockReq({ body: { password: PASSWORD } }), response)
    expect(response.statusCode).toBe(503)
    expect(response.body.disabled).toBe(true)
    expect(response.body.error).toMatch(/ADMIN_PASSWORD/)

    const sessionResponse = mockRes()
    await session(mockReq({ method: "GET" }), sessionResponse)
    expect(sessionResponse.statusCode).toBe(503)
  })

  it("rejects the wrong password and then backs off", async () => {
    const first = mockRes()
    await login(mockReq({ body: { password: "nope" } }), first)
    expect(first.statusCode).toBe(401)
    expect(first.body.error).toBe("That password is not right.")

    const second = mockRes()
    await login(mockReq({ body: { password: "still nope" } }), second)
    expect(second.statusCode).toBe(429)
    expect(second.headers["retry-after"]).toBeTruthy()
  })

  it("sets a signed cookie only after the right password", async () => {
    const response = mockRes()
    await login(mockReq({
      body: { password: PASSWORD },
      headers: { "x-forwarded-proto": "https" },
    }), response)
    expect(response.statusCode).toBe(200)
    const cookie = response.headers["set-cookie"]
    expect(cookie).toContain("HttpOnly")
    expect(cookie).toContain("Secure")
    expect(cookie).toContain("SameSite=Strict")
    const token = cookie.split(";")[0].slice(`${COOKIE_NAME}=`.length)
    expect(verifySession(token, SECRET)?.v).toBe(1)
    expect(response.body.password).toBeUndefined()
    expect(JSON.stringify(response.body)).not.toContain(PASSWORD)
    expect(JSON.stringify(response.body)).not.toContain(SECRET)
  })

  it("blocks a cross-origin login", async () => {
    const response = mockRes()
    await login(mockReq({
      body: { password: PASSWORD },
      headers: { origin: "https://evil.example" },
    }), response)
    expect(response.statusCode).toBe(403)
  })

  it("requires a session to read or publish the resume", async () => {
    const anonymous = mockRes()
    await resume(mockReq({ method: "GET" }), anonymous)
    expect(anonymous.statusCode).toBe(401)

    const loginResponse = mockRes()
    await login(mockReq({ body: { password: PASSWORD } }), loginResponse)
    const token = loginResponse.headers["set-cookie"].split(";")[0].slice(`${COOKIE_NAME}=`.length)
    const authed = mockRes()
    await resume(mockReq({
      method: "GET",
      headers: { cookie: `${COOKIE_NAME}=${token}` },
    }), authed)
    expect(authed.statusCode).toBe(200)
    expect(authed.body.source).toBe("bundle")
    expect(authed.body.resume.name).toBe("Priyanshu Saini")
    expect(JSON.stringify(authed.body)).not.toContain(PASSWORD)

    process.env.GITHUB_TOKEN = "not-used"
    const invalid = mockRes()
    await resume(mockReq({
      method: "POST",
      headers: { cookie: `${COOKIE_NAME}=${token}` },
      body: { resume: { name: "" }, pdfBase64: "AAAA" },
    }), invalid)
    expect(invalid.statusCode).toBe(400)
    expect(invalid.body.errors.length).toBeGreaterThan(0)
  })

  it("checks PDF bytes before a publish would commit them", () => {
    const good = Buffer.concat([Buffer.from("%PDF-1.4\n"), Buffer.alloc(900, 0x20)])
    expect(validatePdfBase64(good.toString("base64")).ok).toBe(true)
    expect(validatePdfBase64(Buffer.from("not a pdf").toString("base64")).ok).toBe(false)
    expect(validatePdfBase64("")).toEqual({ ok: false, error: "PDF is missing." })
  })
})
