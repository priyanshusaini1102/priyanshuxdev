import { useState } from "react"
import { api } from "./client.js"

export default function LoginScreen({ disabled = false, message = "", onSuccess }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(message)
  const [pending, setPending] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    if (disabled || pending) return
    setPending(true)
    setError("")
    try {
      await api("/api/login", { method: "POST", body: { password } })
      setPassword("")
      onSuccess()
    } catch (reason) {
      setError(reason.message || "Could not sign in.")
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="admin-login">
      <form className="admin-card" onSubmit={onSubmit}>
        <p className="eyebrow">Private</p>
        <h1>{disabled ? "Resume admin is off" : "Edit the resume"}</h1>
        <p className="admin-lede">
          {disabled
            ? "Set the server environment variables, then reload this page."
            : "Change the wording, check the one-page preview, and publish the PDF. This page is not linked from the site."}
        </p>
        {disabled ? null : (
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              maxLength={500}
            />
          </div>
        )}
        <p className="admin-status" role="status" aria-live="polite">{error}</p>
        {disabled ? null : (
          <button className="button" type="submit" disabled={pending}>
            {pending ? "Checking…" : "Enter"}
          </button>
        )}
      </form>
    </main>
  )
}
