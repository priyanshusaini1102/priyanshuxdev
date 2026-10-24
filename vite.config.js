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
        source: `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
      })
      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site.url}/</loc></url>\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seoFromContent()],
})
