export class ApiError extends Error {
  constructor(message, { status = 0, data = null } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export async function api(path, { method = "GET", body } = {}) {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await response.json().catch(() => ({ error: "Request failed." }))
  if (!response.ok) {
    throw new ApiError(data?.error || "Request failed.", { status: response.status, data })
  }
  return data
}
