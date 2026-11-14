export function clientIp(req) {
  const forwarded = req.headers?.["x-forwarded-for"]
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim().slice(0, 80)
  }
  return req.socket?.remoteAddress || "local"
}

export function sameOrigin(req) {
  const origin = req.headers?.origin
  if (!origin) return true
  const host = req.headers?.host
  if (!host) return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function send(res, status, body, headers = {}) {
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("X-Content-Type-Options", "nosniff")
  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value)
  res.status(status).json(body)
}

export function rejectMethod(req, res, allowed) {
  if (req.method === allowed) return false
  res.setHeader("Allow", allowed)
  send(res, 405, { error: "Method not allowed." })
  return true
}

export function jsonBody(req) {
  if (req.invalidJson) return { ok: false, error: "Request body must be JSON." }
  const length = Number(req.headers?.["content-length"] || 0)
  if (length > 3_000_000) return { ok: false, error: "Request is too large." }
  if (req.body == null || req.body === "") return { ok: true, value: {} }
  if (typeof req.body === "string") {
    try {
      return { ok: true, value: JSON.parse(req.body) }
    } catch {
      return { ok: false, error: "Request body must be JSON." }
    }
  }
  if (Buffer.isBuffer(req.body)) {
    try {
      return { ok: true, value: JSON.parse(req.body.toString("utf8")) }
    } catch {
      return { ok: false, error: "Request body must be JSON." }
    }
  }
  if (typeof req.body === "object") return { ok: true, value: req.body }
  return { ok: false, error: "Request body must be JSON." }
}
