/**
 * All public copy lives in this file.
 * Do not add client names, quotes, prices, or metrics that are not already true.
 */

export const site = {
  name: "Priyanshu Saini",
  url: "https://priyanshuxdev.vercel.app",
  email: "priyanshusaini1102@gmail.com",
  role: "Backend and AI systems",
  seo: {
    title: "Priyanshu Saini — Backend and AI systems",
    description:
      "Node.js backends, AI integrations, and semantic search for startups and businesses. 3+ years of production backend experience in fintech.",
    ogImage: "/og.png",
  },
  nav: [
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Stack", href: "#stack" },
    { label: "FAQ", href: "#faq" },
  ],
  socials: [
    { label: "GitHub", href: "https://github.com/priyanshusaini1102" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/priyanshusaini1102/" },
  ],
  hero: {
    kicker: "Consulting",
    title: "Backend and AI systems for startups and businesses.",
    lede: "I design and build Node.js backends, AI integrations, and semantic search that a team can run in production. Three-plus years of that work has been in fintech.",
    primaryCta: "Start a project",
    secondaryCta: "Selected work",
    sheetLabel: "Engagement",
    stamp: "Taking projects",
    sheet: [
      { label: "Focus", value: "APIs, retrieval, and automation" },
      { label: "For", value: "Startups and operating businesses" },
      { label: "Background", value: "3+ years of production backends in fintech" },
      { label: "First step", value: "A short discovery, then a written scope" },
    ],
  },
  services: {
    title: "Services",
    lede: "Scoped systems. The work is the backend, the integration, and the path to something your team can operate.",
    items: [
      {
        title: "Backend API development",
        text: "Node.js services with clear contracts: authentication, data, and the endpoints a product actually calls.",
      },
      {
        title: "AI integrations",
        text: "Models placed next to a normal backend. Where they help, how they fail, and how the rest of the system stays in control.",
      },
      {
        title: "RAG and semantic search",
        text: "Chunking, embeddings, and vector databases such as Qdrant, so search can follow meaning rather than keywords alone.",
      },
      {
        title: "Automation and bots",
        text: "Work that should run without someone watching it. Queues, workers, and the connections between systems.",
      },
      {
        title: "Fintech-grade backends",
        text: "Production habits from fintech: careful data, permissions, and services other people depend on.",
      },
      {
        title: "Performance and scaling",
        text: "Find what is slow, then fix the API, the query, or the queue. I measure before I claim a result.",
      },
    ],
  },
  process: {
    title: "Process",
    lede: "Four steps. You get a scope before the build, and a system you can run after it.",
    steps: [
      {
        title: "Discover",
        text: "What you are building, what already exists, and what done means.",
      },
      {
        title: "Build",
        text: "The risky path first: the data model, the integrations, and the API other work depends on.",
      },
      {
        title: "Ship",
        text: "Deployed, documented enough to hand off, and runnable by someone who was not in the repo every day.",
      },
      {
        title: "Support",
        text: "Fixes and the next slice of scope, if you want them. Support after ship is agreed, not assumed.",
      },
    ],
  },
  work: {
    title: "Selected work",
    lede: "Public repositories of systems I built. These are not client engagements, and they do not stand in for a logo wall.",
    items: [
      {
        title: "movies-vector-search",
        problem: "Keyword search misses what a description means.",
        solution: "A Node.js lab that chunks movie descriptions three ways — fixed tokens, sentence-aware splits, and semantic splits — embeds them with FastEmbed, and connects to a local Qdrant collection.",
        stack: ["Node.js", "Qdrant", "FastEmbed", "Transformers"],
        links: [
          { label: "Source", href: "https://github.com/priyanshusaini1102/movies-vector-search" },
        ],
      },
      {
        title: "vercel-clone",
        problem: "A project in Git still has to become a URL.",
        solution: "A TypeScript deploy system. One service clones a repository, stores the files in Cloudflare R2, and queues a job on Redis. A worker builds it. A handler serves the result. A React app sits in front.",
        stack: ["TypeScript", "Node.js", "Redis", "Cloudflare R2", "React"],
        links: [
          { label: "Live", href: "https://vercel-clone-mauve.vercel.app" },
          { label: "Source", href: "https://github.com/priyanshusaini1102/vercel-clone" },
        ],
      },
      {
        title: "mernStore",
        problem: "An online store needs accounts, a catalog, orders, and payments.",
        solution: "An Express and MongoDB API for users, products, orders, and Stripe payments, with a separate React storefront.",
        stack: ["Node.js", "Express", "MongoDB", "React", "Stripe"],
        links: [
          { label: "Live", href: "https://mern-store-frontend-sandy.vercel.app" },
          { label: "Frontend", href: "https://github.com/priyanshusaini1102/mernStore-frontend" },
          { label: "Backend", href: "https://github.com/priyanshusaini1102/mernStore-backend" },
        ],
      },
      {
        title: "nexstores",
        problem: "A storefront that editors should be able to change without a code deploy.",
        solution: "A Next.js storefront backed by Sanity, with product, about, and contact pages.",
        stack: ["Next.js", "Sanity", "Tailwind CSS"],
        links: [
          { label: "Live", href: "https://nexstores.vercel.app" },
          { label: "Source", href: "https://github.com/priyanshusaini1102/nexstores" },
        ],
      },
    ],
  },
  stack: {
    title: "Stack",
    lede: "Tools these systems were actually built with.",
    groups: [
      { label: "Backend", items: ["Node.js", "TypeScript", "Express"] },
      { label: "Data", items: ["MongoDB", "Redis", "Qdrant"] },
      { label: "AI", items: ["FastEmbed", "Transformers"] },
      { label: "Web", items: ["React", "Next.js"] },
      { label: "Platform", items: ["Cloudflare R2", "Stripe", "Sanity"] },
    ],
  },
  faq: {
    title: "FAQ",
    lede: "Straight answers before you write.",
    items: [
      {
        q: "What do you build?",
        a: "Node.js backends, AI integrations, retrieval with vector databases, and automation. The repositories in Selected work are the public evidence.",
      },
      {
        q: "Who is this for?",
        a: "Startups and businesses that need a backend or an AI system built properly, including teams that already have a product in production.",
      },
      {
        q: "How does a project start?",
        a: "With an email. I ask a few questions, then write a scope before any build.",
      },
      {
        q: "Do you publish prices?",
        a: "No. Price follows the scope. I do not quote a number before I understand the system.",
      },
      {
        q: "Can you work in an existing codebase?",
        a: "Yes. A lot of production work starts from a system that already runs.",
      },
    ],
  },
  contact: {
    title: "Start a project",
    lede: "Send a short note about the system you need. Email is the way in.",
    submit: "Email this inquiry",
    sent: "Your email app should open with this inquiry. If it does not, use the address above.",
    fields: {
      name: "Name",
      email: "Email",
      company: "Company",
      companyHint: "Optional",
      need: "What you need",
      needPlaceholder: "Choose a starting point",
      unsure: "Not sure yet",
      message: "What should this system do?",
    },
  },
  footer: "Backend and AI systems for startups and businesses.",
}

site.jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.seo.description,
  serviceType: site.services.items.map((item) => item.title),
  sameAs: site.socials.map((item) => item.href),
}
