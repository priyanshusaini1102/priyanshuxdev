import { describe, expect, it } from "vitest"
import { checkRateLimit, clearFailures, recordFailure, resetRateLimits } from "./rateLimit.js"

describe("login backoff", () => {
  it("backs off and then blocks the window", () => {
    resetRateLimits()
    const start = 1_000_000
    expect(checkRateLimit("1.2.3.4", start).allowed).toBe(true)

    const first = recordFailure("1.2.3.4", start)
    expect(first.retryAfter).toBe(1)
    expect(checkRateLimit("1.2.3.4", start + 100).allowed).toBe(false)
    expect(checkRateLimit("1.2.3.4", start + 1000).allowed).toBe(true)

    recordFailure("1.2.3.4", start + 1000)
    expect(checkRateLimit("1.2.3.4", start + 1500).retryAfter).toBeGreaterThan(1)

    clearFailures("1.2.3.4")
    expect(checkRateLimit("1.2.3.4", start + 1500).allowed).toBe(true)

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const now = start + attempt * 70_000
      expect(checkRateLimit("9.9.9.9", now).allowed).toBe(true)
      recordFailure("9.9.9.9", now)
    }
    expect(checkRateLimit("9.9.9.9", start + 7 * 70_000 + 61_000).allowed).toBe(false)
    expect(checkRateLimit("9.9.9.9", start + 15 * 60 * 1000 + 1).allowed).toBe(true)
  })
})
