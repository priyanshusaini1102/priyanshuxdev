import { resolve } from "node:path"
import { pathToFileURL } from "node:url"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { site } from "./src/content.js"

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
}

function seoFromContent() {
  const image = new URL(site.seo.ogImage, site.url).href
  const jsonLd = JSON.stringify(site.jsonLd).replace(/</g, "\\u003c")
  const tags = `
    <title>${escapeAttr(site.seo.title)}</title>
    <meta name="description" content="${escapeAttr(site.seo.description)}" />
    <meta name="author" content="${escapeAttr(site.name)}" />
    <meta name="robots" content="index,follow" />
    <link rel="canonical" href="${escapeAttr(site.url)}" />
    <meta name="theme-color" content="#eef1f4" />
    <meta property="og:site_name" content="${escapeAttr(site.name)}" />
    <meta property="og:title" content="${escapeAttr(site.seo.title)}" />
    <meta property="og:description" content="${escapeAttr(site.seo.description)}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${escapeAttr(site.url)}" />
    <meta property="og:image" content="${escapeAttr(image)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_IN" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(site.seo.title)}" />
    <meta name="twitter:description" content="${escapeAttr(site.seo.description)}" />
    <meta name="twitter:image" content="${escapeAttr(image)}" />
    <script type="application/ld+json">${jsonLd}</script>`

  return {
    name: "seo-from-content",
    transformIndexHtml(html) {
      return html.replace("<!-- seo -->", tags)
    },
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${site.url}/sitemap.xml\n`,
      })
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site.url}/</loc></url>\n</urlset>\n`,
      })
    },
  }
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = []
    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolveBody(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

function adminApiDev() {
  const routes = {
    "/api/login": "login.js",
    "/api/logout": "logout.js",
    "/api/session": "session.js",
    "/api/resume": "resume.js",
  }
  return {
    name: "admin-api-dev",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split("?")[0]
        const file = routes[path]
        if (!file) return next()
        try {
          const raw = await readBody(req)
          if (raw) {
            try {
              req.body = JSON.parse(raw)
            } catch {
              req.invalidJson = true
            }
          }
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (data) => {
            if (!res.getHeader("Content-Type")) res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify(data))
          }
          const href = pathToFileURL(resolve(process.cwd(), "api", file)).href
          const mod = await import(href)
          await mod.default(req, res)
          if (!res.writableEnded) res.end()
        } catch (error) {
          server.config.logger.error(error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader("Content-Type", "application/json; charset=utf-8")
            res.end(JSON.stringify({ error: "Server error." }))
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seoFromContent(), adminApiDev()],
  test: {
    environment: "node",
    testTimeout: 30000,
    fileParallelism: false,
  },
})
