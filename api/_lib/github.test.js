import { describe, expect, it } from "vitest"
import { COMMIT_MESSAGE, fetchResumeFromGitHub, publishResume } from "./github.js"

function route(handlers) {
  const calls = []
  const request = async (path, options = {}) => {
    const method = options.method || "GET"
    calls.push({ path, method, body: options.body, token: options.token })
    const handler = handlers.find((item) => item.method === method && item.match(path))
    if (!handler) throw new Error(`unexpected ${method} ${path}`)
    return handler.run(path, options, calls)
  }
  return { request, calls }
}

describe("github publish", () => {
  it("commits both files and retries when the branch moved", async () => {
    let patches = 0
    const { request, calls } = route([
      {
        method: "POST",
        match: (path) => path.endsWith("/git/blobs"),
        run: (_path, options) => ({ sha: options.body.encoding === "base64" ? "pdf-blob" : "json-blob" }),
      },
      {
        method: "GET",
        match: (path) => path.includes("/git/ref/heads/"),
        run: () => ({ object: { sha: patches === 0 ? "parent-old" : "parent-new" } }),
      },
      {
        method: "GET",
        match: (path) => path.includes("/git/commits/"),
        run: () => ({ tree: { sha: patches === 0 ? "tree-old" : "tree-new" } }),
      },
      {
        method: "POST",
        match: (path) => path.endsWith("/git/trees"),
        run: () => ({ sha: "tree-next" }),
      },
      {
        method: "POST",
        match: (path) => path.endsWith("/git/commits"),
        run: () => ({ sha: patches === 0 ? "commit-old" : "commit-new" }),
      },
      {
        method: "PATCH",
        match: (path) => path.includes("/git/refs/heads/"),
        run: () => {
          patches += 1
          if (patches === 1) {
            const error = new Error("Update is not a fast forward")
            error.status = 422
            throw error
          }
          return { object: { sha: "commit-new" } }
        },
      },
    ])

    const commit = await publishResume({
      token: "gh-token",
      repo: "priyanshusaini1102/priyanshuxdev",
      branch: "main",
      jsonText: "{}\n",
      pdfBase64: "AAAA",
      request,
    })

    expect(commit).toEqual({
      sha: "commit-new",
      url: "https://github.com/priyanshusaini1102/priyanshuxdev/commit/commit-new",
    })
    expect(calls.filter((call) => call.path.endsWith("/git/blobs"))).toHaveLength(2)
    const update = calls.filter((call) => call.method === "PATCH")
    expect(update).toHaveLength(2)
    expect(update[1].body).toEqual({ sha: "commit-new", force: false })
    const created = calls.find((call) => call.method === "POST" && call.path.endsWith("/git/commits") && call.body.parents[0] === "parent-new")
    expect(created.body.message).toBe(COMMIT_MESSAGE)
    expect(created.body.tree).toBe("tree-next")
    const tree = calls.find((call) => call.method === "POST" && call.path.endsWith("/git/trees") && call.body.base_tree === "tree-new")
    expect(tree.body.tree.map((item) => item.path)).toEqual(["src/data/resume.json", "public/resume.pdf"])
    expect(calls.every((call) => call.token === "gh-token")).toBe(true)
  })

  it("reads the latest resume json from the branch", async () => {
    const resume = { name: "Priyanshu Saini" }
    const { request } = route([
      {
        method: "GET",
        match: (path) => path.includes("/contents/"),
        run: () => ({ content: Buffer.from(`${JSON.stringify(resume)}\n`, "utf8").toString("base64") }),
      },
      {
        method: "GET",
        match: (path) => path.includes("/git/ref/"),
        run: () => ({ object: { sha: "abc1234" } }),
      },
    ])
    const result = await fetchResumeFromGitHub({
      token: "gh-token",
      repo: "priyanshusaini1102/priyanshuxdev",
      branch: "main",
      request,
    })
    expect(result.resume).toEqual(resume)
    expect(result.commit.url).toBe("https://github.com/priyanshusaini1102/priyanshuxdev/commit/abc1234")
  })

  it("rejects a repository path that could escape the repo", async () => {
    await expect(publishResume({
      token: "x",
      repo: "owner/name/extra",
      branch: "main",
      jsonText: "{}",
      pdfBase64: "AA==",
      request: async () => { throw new Error("should not request") },
    })).rejects.toThrow(/GITHUB_REPO/)
  })
})
