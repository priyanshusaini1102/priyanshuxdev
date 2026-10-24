function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function renderInline(value) {
  const slots = []
  const stash = (html) => {
    const token = `%%SLOT${slots.length}%%`
    slots.push(html)
    return token
  }

  const withSlots = value
    .replace(/`([^`]+)`/g, (_, inner) => stash(`<code>${escapeHtml(inner)}</code>`))
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|tel:[^\s)]+)\)/g,
      (_, label, href) => {
        const external = /^https?:/i.test(href)
        const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ""
        return stash(`<a href="${escapeHtml(href)}"${attrs}>${escapeHtml(label)}</a>`)
      },
    )

  const html = escapeHtml(withSlots)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/%%SLOT(\d+)%%/g, (_, index) => slots[Number(index)])

  return html
}

function isList(line) {
  return /^(- |\d+\. )/.test(line)
}

export function renderMarkdown(source) {
  const lines = source.replace(/\r\n/g, "\n").split("\n")
  const blocks = []
  let i = 0

  const flushParagraph = (buffer) => {
    if (!buffer.length) return
    blocks.push(`<p>${renderInline(buffer.join(" "))}</p>`)
  }

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === "") {
      i += 1
      continue
    }

    if (line.startsWith("```")) {
      const body = []
      i += 1
      while (i < lines.length && !lines[i].startsWith("```")) {
        body.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push(`<pre><code>${escapeHtml(body.join("\n"))}</code></pre>`)
      continue
    }

    if (line.trim() === "---") {
      blocks.push("<hr />")
      i += 1
      continue
    }

    const heading = /^(#{1,3}) /.exec(line)
    if (heading) {
      const level = heading[1].length
      const tag = `h${Math.min(level + 3, 6)}`
      blocks.push(`<${tag}>${renderInline(line.slice(heading[1].length + 1))}</${tag}>`)
      i += 1
      continue
    }

    if (line.startsWith("> ")) {
      const quote = []
      while (i < lines.length && lines[i].startsWith("> ")) {
        quote.push(lines[i].slice(2))
        i += 1
      }
      blocks.push(`<blockquote><p>${renderInline(quote.join(" "))}</p></blockquote>`)
      continue
    }

    if (isList(line)) {
      const ordered = /^\d+\. /.test(line)
      const items = []
      while (i < lines.length && isList(lines[i])) {
        items.push(lines[i].replace(/^(- |\d+\. )/, ""))
        i += 1
      }
      const tag = ordered ? "ol" : "ul"
      blocks.push(`<${tag}>${items.map((item) => `<li>${renderInline(item)}</li>`).join("")}</${tag}>`)
      continue
    }

    const paragraph = []
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith("> ") &&
      !lines[i].startsWith("#") &&
      lines[i].trim() !== "---" &&
      !isList(lines[i])
    ) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    flushParagraph(paragraph)
  }

  return blocks.join("\n")
}
