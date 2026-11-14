import { DISABLED_MESSAGE, getEnv } from "./_lib/env.js"
import { clientIp, jsonBody, rejectMethod, sameOrigin, send } from "./_lib/http.js"
import { checkRateLimit, clearFailures, recordFailure } from "./_lib/rateLimit.js"
import { passwordsMatch, sessionCookie, signSession } from "./_lib/session.js"

export default async function handler(req, res) {
  if (rejectMethod(req, res, "POST")) return
  if (!sameOrigin(req)) return send(res, 403, { error: "Cross-origin sign-in was blocked." })

  const env = getEnv()
  if (!env.enabled) return send(res, 503, { error: DISABLED_MESSAGE, disabled: true })

  const ip = clientIp(req)
  const limit = checkRateLimit(ip)
  if (!limit.allowed) {
    return send(res, 429, {
      error: `Too many attempts. Try again in ${limit.retryAfter} ${limit.retryAfter === 1 ? "second" : "seconds"}.`,
      retryAfter: limit.retryAfter,
    }, { "Retry-After": String(limit.retryAfter) })
  }

  const body = jsonBody(req)
  if (!body.ok) return send(res, 400, { error: body.error })
  const password = body.value?.password
  if (typeof password !== "string" || password.length === 0 || password.length > 500) {
    const failure = recordFailure(ip)
    return send(res, 401, {
      error: "That password is not right.",
      retryAfter: failure.retryAfter,
    })
  }

  if (!passwordsMatch(password, env.password)) {
    const failure = recordFailure(ip)
    return send(res, 401, {
      error: "That password is not right.",
      retryAfter: failure.retryAfter,
    })
  }

  clearFailures(ip)
  const token = signSession(env.secret)
  return send(res, 200, { ok: true }, { "Set-Cookie": sessionCookie(token, req) })
}
