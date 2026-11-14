const WINDOW_MS = 15 * 60 * 1000
const MAX_FAILURES = 8
const buckets = new Map()

export function resetRateLimits() {
  buckets.clear()
}

export function checkRateLimit(ip, now = Date.now()) {
  const bucket = buckets.get(ip)
  if (!bucket) return { allowed: true, retryAfter: 0 }
  if (now - bucket.start > WINDOW_MS) {
    buckets.delete(ip)
    return { allowed: true, retryAfter: 0 }
  }
  if (now < bucket.nextAt) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.nextAt - now) / 1000)) }
  }
  if (bucket.fails >= MAX_FAILURES) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((bucket.start + WINDOW_MS - now) / 1000)) }
  }
  return { allowed: true, retryAfter: 0 }
}

export function recordFailure(ip, now = Date.now()) {
  let bucket = buckets.get(ip)
  if (!bucket || now - bucket.start > WINDOW_MS) {
    bucket = { start: now, fails: 0, nextAt: 0 }
    buckets.set(ip, bucket)
  }
  bucket.fails += 1
  const delay = Math.min(60_000, 1000 * 2 ** (bucket.fails - 1))
  bucket.nextAt = now + delay
  return { fails: bucket.fails, retryAfter: Math.ceil(delay / 1000) }
}

export function clearFailures(ip) {
  buckets.delete(ip)
}
