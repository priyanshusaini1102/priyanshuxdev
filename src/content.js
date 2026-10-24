/**
 * Site content. Edit this file only.
 *
 * Instagram is a placeholder until you set `href` to your real profile URL.
 * Notes are markdown strings. Supported syntax:
 *   paragraphs, # ## ###, - lists, 1. lists, > quotes, ``` code fences,
 *   **bold**, *italic*, `code`, [label](https://...), and ---
 * Add a post to `writing.posts` (newest first). Set placeholder: false
 * once the note is real.
 */

export const site = {
  name: "Priyanshu Saini",
  role: "Backend engineer building with AI",
  url: "https://priyanshuxdev.vercel.app",
  email: "priyanshusaini1102@gmail.com",
  phone: "+917017413590",
  phoneDisplay: "+91 70174 13590",
  resumeUrl:
    "https://drive.google.com/uc?export=download&id=1ebzqYwYDCxSEkoDjWGwmaMer1TNiB830",
  location: "Budhana, Muzaffarnagar, Uttar Pradesh",
  seo: {
    title: "Priyanshu Saini — Backend engineer building with AI",
    description:
      "Priyanshu Saini is a Node.js backend engineer at Datacultr Fintech, building in public with vector search, models, and Rust.",
    ogImage: "/og.png",
  },
  nav: [
    { label: "Build", href: "#build" },
    { label: "Exploring", href: "#exploring" },
    { label: "Projects", href: "#projects" },
    { label: "Notes", href: "#notes" },
    { label: "Now", href: "#now" },
    { label: "Story", href: "#story" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    kicker: "Node.js · Fintech · AI",
    lines: ["Backend engineer", "building with AI."],
    lede: "I write Node.js backends at Datacultr Fintech. About three years in — I started at Internshala and have been promoted twice. Alongside the job I am learning vector search, models, and Rust by building them.",
    path: ["Budhana", "IMS Noida", "Graphic Era", "Internshala", "Datacultr", "AI"],
    asideLabel: "On the bench",
    aside: [
      { label: "Day job", value: "Node.js at Datacultr Fintech" },
      { label: "Studying", value: "Qdrant, models, Rust" },
      { label: "Building", value: "A trading bot, in progress" },
    ],
  },
  build: {
    index: "01",
    title: "What I build",
    lede: "Production backends first. AI work I can explain second.",
    items: [
      {
        title: "Node.js backends",
        text: "The day job is fintech. I build Node.js services that other people depend on: clear APIs, careful data, and code a teammate can change without a tour.",
      },
      {
        title: "Retrieval",
        text: "Vector search, practiced in the open. Chunking, embeddings, and Qdrant — on movie descriptions first, so I understand the pieces before I trust them.",
      },
      {
        title: "The path to a URL",
        text: "Small platforms I built to learn the whole path: a deploy system, and storefronts with a real frontend and a real backend.",
      },
    ],
  },
  exploring: {
    index: "02",
    title: "Exploring now",
    lede: "What I am actually studying. No wall of certificates.",
    items: [
      {
        title: "Vector search with Qdrant",
        status: "Active",
        text: "How chunking and embeddings change what a search can find. The lab is movies-vector-search.",
      },
      {
        title: "AI models",
        status: "Learning",
        text: "Where a model belongs next to a normal backend, and where it does not.",
      },
      {
        title: "Rust",
        status: "Learning",
        text: "A second language, closer to the metal, for systems I want to understand properly.",
      },
      {
        title: "Trading bot",
        status: "In progress",
        text: "Being built. There is no public repository yet.",
      },
    ],
  },
  projects: {
    index: "03",
    title: "Selected projects",
    lede: "Real repositories, AI work first. Copy tracks what is in the code.",
    items: [
      {
        title: "movies-vector-search",
        featured: true,
        text: "A Node.js lab for semantic search over movie descriptions. It chunks text three ways — fixed-size tokens, sentence-aware splits, and semantic splits — embeds with FastEmbed, and includes a Qdrant client pointed at a local collection. Study code, not a shipped product.",
        tags: ["Node.js", "Qdrant", "FastEmbed", "Transformers"],
        links: [
          {
            label: "Source",
            href: "https://github.com/priyanshusaini1102/movies-vector-search",
          },
        ],
      },
      {
        title: "vercel-clone",
        text: "A small deploy system in TypeScript. An upload service clones a Git repo, stores the files in Cloudflare R2, and enqueues a job on Redis. A worker builds the project. A request handler serves the result. A React app sits in front.",
        tags: ["TypeScript", "Node.js", "Redis", "Cloudflare R2", "React"],
        links: [
          {
            label: "Live",
            href: "https://vercel-clone-mauve.vercel.app",
          },
          {
            label: "Source",
            href: "https://github.com/priyanshusaini1102/vercel-clone",
          },
        ],
      },
      {
        title: "mernStore",
        text: "An ecommerce store split across two repos. The Express and MongoDB backend covers users, products, orders, and Stripe payments. The React frontend is a separate app.",
        tags: ["Node.js", "Express", "MongoDB", "React", "Stripe"],
        links: [
          {
            label: "Live",
            href: "https://mern-store-frontend-sandy.vercel.app",
          },
          {
            label: "Frontend",
            href: "https://github.com/priyanshusaini1102/mernStore-frontend",
          },
          {
            label: "Backend",
            href: "https://github.com/priyanshusaini1102/mernStore-backend",
          },
        ],
      },
      {
        title: "nexstores",
        text: "A Next.js storefront backed by Sanity, with product, about, and contact pages, styled with Tailwind.",
        tags: ["Next.js", "Sanity", "Tailwind CSS"],
        links: [
          {
            label: "Live",
            href: "https://nexstores.vercel.app",
          },
          {
            label: "Source",
            href: "https://github.com/priyanshusaini1102/nexstores",
          },
        ],
      },
      {
        title: "Trading bot",
        inProgress: true,
        text: "In progress. I am building it alongside the vector-search and Rust work. Nothing is public yet, so there is no repository link.",
        tags: ["In progress"],
        links: [],
      },
    ],
  },
  writing: {
    index: "04",
    title: "Notes",
    lede: "Building in public. Short notes on what I am learning and shipping. The first one is a placeholder.",
    posts: [
      {
        slug: "a-log-not-a-resume",
        title: "A log, not a resume",
        date: "2026-10-24",
        placeholder: true,
        excerpt:
          "Placeholder. This site is becoming a log of building with AI. The first real note is not written yet.",
        body: `This note is a **placeholder**. Replace it in \`src/content.js\` when there is something real to say, and set \`placeholder\` to \`false\`.

The old site was a resume. That was the wrong object. I want a record of learning in public: vector search with Qdrant, where models fit next to a Node.js backend, Rust, and a trading bot that is not ready to show.

The first real post should be about something that broke, or something that shipped. This one only marks the spot.

---

What I will not do here:

- Invent metrics to sound further along than I am
- Pretend a study repo is a product
- Wait until the work is polished before writing the lesson`,
      },
    ],
  },
  now: {
    index: "05",
    title: "Now",
    updated: "24 October 2026",
    lede: "A snapshot of the current season. Change the date when it goes stale.",
    items: [
      "Working at Datacultr Fintech, writing Node.js backends.",
      "Learning vector search with Qdrant, AI models, and Rust.",
      "Building a trading bot. No public repo yet.",
      "Writing lyrics, playing guitar, producing music, and training at the gym.",
    ],
  },
  story: {
    index: "06",
    title: "The short version",
    paragraphs: [
      "Born in 2001 in Budhana, a small town in Muzaffarnagar, Uttar Pradesh. BCA from IMS Noida. MCA from Graphic Era University, Dehradun.",
      "The path is short enough to say plainly: small town, then a fintech engineer, now building with AI.",
      "I started at Internshala. I work at Datacultr Fintech. Two promotions in. Node.js is the base. Vector search, models, and Rust are the work on top of it.",
    ],
    drivesTitle: "What drives me",
    drives: [
      { title: "Gym", text: "Training is how I stay steady." },
      { title: "Music", text: "Lyrics, guitar, and production." },
      { title: "Intelligence", text: "Get sharper by building, not by collecting theory." },
      { title: "Gratitude", text: "A small town can go a long way. I don't forget that." },
    ],
    facts: [
      { label: "From", value: "Budhana, Muzaffarnagar, UP" },
      { label: "Born", value: "2001" },
      { label: "BCA", value: "IMS Noida" },
      { label: "MCA", value: "Graphic Era University, Dehradun" },
      { label: "Work", value: "Datacultr Fintech" },
      { label: "Before that", value: "Internshala" },
    ],
  },
  contact: {
    index: "07",
    title: "Contact",
    lede: "Email is the best way in. If you are building backends, retrieval, or the tools around them, send a note.",
  },
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/priyanshusaini1102",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/priyanshusaini1102/",
    },
    {
      label: "Email",
      href: "mailto:priyanshusaini1102@gmail.com",
    },
    {
      label: "Phone",
      text: "+91 70174 13590",
      href: "tel:+917017413590",
    },
    {
      label: "Resume",
      href: "https://drive.google.com/uc?export=download&id=1ebzqYwYDCxSEkoDjWGwmaMer1TNiB830",
    },
    {
      label: "Instagram",
      href: "",
      placeholder: true,
      note: "Placeholder — add your Instagram URL in src/content.js",
    },
  ],
  footer: "Priyanshu Saini",
}

site.jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  telephone: site.phone,
  jobTitle: "Backend engineer",
  description: site.seo.description,
  worksFor: {
    "@type": "Organization",
    name: "Datacultr",
  },
  homeLocation: {
    "@type": "Place",
    name: site.location,
  },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "IMS Noida" },
    { "@type": "CollegeOrUniversity", name: "Graphic Era University, Dehradun" },
  ],
  knowsAbout: ["Node.js", "Vector search", "Qdrant", "Rust", "AI models"],
  sameAs: site.socials
    .filter((item) => item.href && (item.label === "GitHub" || item.label === "LinkedIn"))
    .map((item) => item.href),
}
