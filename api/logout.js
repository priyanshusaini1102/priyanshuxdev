import { rejectMethod, sameOrigin, send } from "./_lib/http.js"
import { clearSessionCookie } from "./_lib/session.js"

export default async function handler(req, res) {
  if (rejectMethod(req, res, "POST")) return
  if (!sameOrigin(req)) return send(res, 403, { error: "Cross-origin sign-out was blocked." })
  return send(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie(req) })
}
