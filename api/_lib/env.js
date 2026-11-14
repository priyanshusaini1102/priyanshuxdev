export const DISABLED_MESSAGE = "Admin login is disabled until ADMIN_PASSWORD and ADMIN_SESSION_SECRET are set."

export function getEnv() {
  const password = process.env.ADMIN_PASSWORD || ""
  const secret = process.env.ADMIN_SESSION_SECRET || ""
  const githubToken = process.env.GITHUB_TOKEN || ""
  const repo = process.env.GITHUB_REPO || "priyanshusaini1102/priyanshuxdev"
  const branch = process.env.GITHUB_BRANCH || "main"
  return {
    password,
    secret,
    githubToken,
    repo,
    branch,
    enabled: password.length > 0 && secret.length > 0,
  }
}
