import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const projects = [
  {
    num: '01',
    title: 'One-Click Deploy Tool',
    desc: 'A 3-service micro-architecture that automates React project deployment. Fetches GitHub repos, builds via Redis queue workers, stores on Cloudflare R2, and serves via custom subdomains.',
    tech: ['TypeScript', 'Node.js', 'Redis', 'Cloudflare R2', 'Express'],
    image: '/assets/project-vercel.png',
    link: 'https://github.com/priyanshusaini1102',
  },
  {
    num: '02',
    title: 'InsureOne Portal',
    desc: 'Full insurance buy portal with admin dashboard for policy management, claims, and document verification. Server-rendered with Next.js and PostgREST.',
    tech: ['Next.js', 'PostgREST', 'React', 'V0.AI'],
    image: '/assets/project-insureone.png',
  },
  {
    num: '03',
    title: 'SMF Pilot App',
    desc: 'React Native app on Google Play Store for retailers. IMEI barcode scanning, 5 microservice integrations, Razorpay & Stripe payments, Firebase notifications, deep linking.',
    tech: ['React Native', 'Expo', 'Zustand', 'Firebase'],
    image: '/assets/project-smf.png',
    link: 'https://play.google.com/store/apps/details?id=com.smf.retailerpro',
  },
  {
    num: '04',
    title: 'Servicedesk Backend',
    desc: 'Clean, scalable Node.js backend with generalized user management, proxy server for microservice communication, role-based auth with granular permissions, and S3 log rotation.',
    tech: ['Node.js', 'MongoDB', 'Redis', 'AWS S3'],
    placeholder: 'SD',
  },
  {
    num: '05',
    title: 'Nucleus Platform',
    desc: 'Unified dashboard merging two legacy systems. Restructured CodeIgniter codebase, integrated 20+ CRUD APIs from multiple microservices with consolidated logging.',
    tech: ['CodeIgniter', 'PHP', 'React', 'REST APIs'],
    placeholder: 'NX',
  },
]

function ProjectCard({ project, index }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: '-80px' })

  const isReversed = index % 2 === 1
  const gradClass = index % 2 === 0 ? 'grad-a' : 'grad-b'

  return (
    <motion.div
      ref={cardRef}
      className={`project-card${isReversed ? ' reverse' : ''}`}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {/* Image / placeholder side */}
      <div className="project-image-wrap">
        {project.image ? (
          <img src={project.image} alt={project.title} />
        ) : (
          <div className={`img-placeholder ${gradClass}`}>
            {project.placeholder}
          </div>
        )}
      </div>

      {/* Text side */}
      <div className="project-info">
        <span className="project-number">{project.num}</span>
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.desc}</p>

        <div className="project-tech">
          {project.tech.map((t) => (
            <span key={t}>
              {t}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            className="project-link"
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Project ↗
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const headerRef = useRef(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' })

  return (
    <section className="projects" id="work">
      <div className="container">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headerInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <p className="projects-label">SELECTED WORK</p>
        <h2 className="projects-heading">Projects</h2>
      </motion.div>

      {projects.map((project, i) => (
        <ProjectCard key={project.num} project={project} index={i} />
      ))}
      </div>
    </section>
  )
}
