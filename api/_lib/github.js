export const RESUME_JSON_PATH = "src/data/resume.json"
export const RESUME_PDF_PATH = "public/resume.pdf"
export const COMMIT_MESSAGE = "Update resume via admin"

export function assertRepo(repo) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo || "")) {
    const error = new Error("GITHUB_REPO must look like owner/name.")
    error.status = 503
    throw error
  }
}

export function assertBranch(branch) {
  if (
    !/^[A-Za-z0-9._/-]{1,120}$/.test(branch || "")
    || branch.includes("..")
    || branch.startsWith("/")
    || branch.endsWith("/")
    || branch.includes("//")
  ) {
    const error = new Error("GITHUB_BRANCH is not a valid branch name.")
    error.status = 503
    throw error
  }
}

export async function githubRequest(path, { token, method = "GET", body } = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "priyanshuxdev-resume-admin",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text.slice(0, 300) }
    }
  }
  if (!response.ok) {
    const error = new Error(data?.message || `GitHub request failed (${response.status}).`)
    error.status = response.status
    throw error
  }
  return data
}

export async function fetchResumeFromGitHub({ token, repo, branch, request = githubRequest }) {
  assertRepo(repo)
  assertBranch(branch)
  const file = await request(`/repos/${repo}/contents/${RESUME_JSON_PATH}?ref=${encodeURIComponent(branch)}`, { token })
  const json = Buffer.from(String(file.content || ""), "base64").toString("utf8")
  const resume = JSON.parse(json)
  const ref = await request(`/repos/${repo}/git/ref/heads/${branch}`, { token })
  const sha = ref.object.sha
  return {
    resume,
    commit: { sha, url: `https://github.com/${repo}/commit/${sha}` },
  }
}

export async function publishResume({ token, repo, branch, jsonText, pdfBase64, request = githubRequest }) {
  assertRepo(repo)
  assertBranch(branch)
  const jsonBlob = await request(`/repos/${repo}/git/blobs`, {
    token,
    method: "POST",
    body: { content: jsonText, encoding: "utf-8" },
  })
  const pdfBlob = await request(`/repos/${repo}/git/blobs`, {
    token,
    method: "POST",
    body: { content: pdfBase64, encoding: "base64" },
  })

  let lastError = null
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const ref = await request(`/repos/${repo}/git/ref/heads/${branch}`, { token })
    const parentSha = ref.object.sha
    const parent = await request(`/repos/${repo}/git/commits/${parentSha}`, { token })
    const tree = await request(`/repos/${repo}/git/trees`, {
      token,
      method: "POST",
      body: {
        base_tree: parent.tree.sha,
        tree: [
          { path: RESUME_JSON_PATH, mode: "100644", type: "blob", sha: jsonBlob.sha },
          { path: RESUME_PDF_PATH, mode: "100644", type: "blob", sha: pdfBlob.sha },
        ],
      },
    })
    const commit = await request(`/repos/${repo}/git/commits`, {
      token,
      method: "POST",
      body: {
        message: COMMIT_MESSAGE,
        tree: tree.sha,
        parents: [parentSha],
      },
    })
    try {
      await request(`/repos/${repo}/git/refs/heads/${branch}`, {
        token,
        method: "PATCH",
        body: { sha: commit.sha, force: false },
      })
      return { sha: commit.sha, url: `https://github.com/${repo}/commit/${commit.sha}` }
    } catch (error) {
      lastError = error
      if (error.status !== 422 && error.status !== 409) throw error
    }
  }

  const error = new Error("The branch moved while publishing. Load the latest resume and try again.")
  error.status = 409
  error.cause = lastError
  throw error
}
