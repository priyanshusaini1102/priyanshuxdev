import { DISABLED_MESSAGE, getEnv } from "./_lib/env.js"
import { rejectMethod, send } from "./_lib/http.js"
import { COOKIE_NAME, readCookie, verifySession } from "./_lib/session.js"

export default async function handler(req, res) {
  if (rejectMethod(req, res, "GET")) return
  const env = getEnv()
  if (!env.enabled) return send(res, 503, { authenticated: false, disabled: true, error: DISABLED_MESSAGE })
  const token = readCookie(req.headers?.cookie, COOKIE_NAME)
  const session = verifySession(token, env.secret)
  if (!session) return send(res, 401, { authenticated: false })
  return send(res, 200, { authenticated: true })
}
