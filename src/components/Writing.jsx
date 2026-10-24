import { useEffect, useRef } from "react"
import { site } from "../content.js"
import { renderMarkdown } from "../markdown.js"
import { useHash } from "../useHash.js"

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export default function Writing() {
  const section = site.writing
  const hash = useHash()
  const articleRef = useRef(null)
  const slug = hash.startsWith("#notes/") ? hash.slice("#notes/".length) : ""
  const post = section.posts.find((item) => item.slug === slug) ?? null

  useEffect(() => {
    const base = site.seo.title
    document.title = post ? `${post.title} — ${site.name}` : base
  }, [post])

  useEffect(() => {
    if (!post) return undefined
    articleRef.current?.focus({ preventScroll: true })
    articleRef.current?.scrollIntoView({ block: "start" })
    return undefined
  }, [post])

  return (
    <section className="section" id="notes" aria-labelledby="notes-title">
      <div className="shell">
        <header className="section-head">
          <p className="index">{section.index}</p>
          <div>
            <h2 id="notes-title">{section.title}</h2>
            <p className="lede">{section.lede}</p>
          </div>
        </header>

        <ul className="note-list">
          {section.posts.map((item) => (
            <li key={item.slug}>
              <a href={`#notes/${item.slug}`} aria-current={item.slug === slug ? "true" : undefined}>
                <span className="note-date">
                  <time dateTime={item.date}>{formatDate(item.date)}</time>
                  {item.placeholder ? <span className="flag flag-quiet">Placeholder</span> : null}
                </span>
                <span className="note-title">{item.title}</span>
                <span className="note-excerpt">{item.excerpt}</span>
              </a>
            </li>
          ))}
        </ul>

        {post ? (
          <article
            ref={articleRef}
            className="note"
            id={`note-${post.slug}`}
            tabIndex={-1}
            aria-labelledby={`note-title-${post.slug}`}
          >
            <p className="note-back">
              <a href="#notes">All notes</a>
            </p>
            <header>
              <p className="note-date">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.placeholder ? <span className="flag flag-quiet">Placeholder</span> : null}
              </p>
              <h3 id={`note-title-${post.slug}`}>{post.title}</h3>
            </header>
            {post.placeholder ? (
              <p className="placeholder-banner">
                Placeholder. This is not a finished note. Replace the markdown in src/content.js.
              </p>
            ) : null}
            <div
              className="markdown"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }}
            />
          </article>
        ) : null}
      </div>
    </section>
  )
}
