import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const experiences = [
  {
    role: 'Software Engineer II',
    company: 'Datacultr',
    date: 'Jul 2025 — Present',
    current: true,
    highlights: [
      'Promoted to SDE-2, now leading <strong>9 production projects</strong> — 4 backends, 1 mobile app, 4 frontend dashboards',
      'Architected <strong>Servicedesk backend</strong> with generalized user management, proxy server, role-based auth with granular permissions',
      'Built API logging with MongoDB query logs, <strong>S3 log rotation</strong>, and single-session login via Redis'
    ],
    tech: ['Node.js', 'MongoDB', 'Redis', 'AWS S3', 'Docker']
  },
  {
    role: 'Full Stack Developer',
    company: 'Datacultr',
    date: 'Apr 2024 — Jun 2025',
    highlights: [
      'Built <strong>InsureOne</strong> — insurance buy portal with Next.js, PostgREST, V0.AI',
      'Owned <strong>SMF Pilot</strong> React Native app — IMEI scanning, 5 microservice integrations, payments, push notifications',
      'Created Node.js <strong>email microservice</strong> with Pub/Sub queue, Docker-deployed across all dashboards',
      'Fixed critical <strong>VAPT security</strong> findings — CAPTCHA, XSS, clickjacking, rate limiting',
      'Merged dashboards into unified <strong>Nucleus Platform</strong>'
    ],
    tech: ['React', 'React Native', 'Next.js', 'Node.js', 'PHP', 'Docker']
  },
  {
    role: 'Associate SDE',
    company: 'Internshala',
    date: 'Aug 2023 — Apr 2024',
    highlights: [
      'Led redesign of <strong>Placement Guarantee Course</strong> student dashboard',
      'Migrated flagship <strong>PGC Student Profile Tool</strong> from AngularJS to React',
      'Built custom Doctrine repositories to optimize API response sizes',
      'Implemented bulk CSV upload for exam questions'
    ],
    tech: ['React', 'PHP', 'TypeScript', 'MySQL']
  },
  {
    role: 'SDE Intern',
    company: 'Internshala',
    date: 'Feb 2023 — Aug 2023',
    highlights: [
      'Revamped two core student-facing modules',
      'Refactored backend cron jobs and optimized PHP REST APIs'
    ],
    tech: ['PHP', 'React', 'MySQL']
  },
  {
    role: 'Full Stack Intern',
    company: 'Mushin Innovation Labs',
    date: 'Sep 2021 — Dec 2021',
    highlights: [
      'Built JWT-based auth system and advanced search for food commerce platform',
      'Deployed scalable React + Node.js features for production'
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Tailwind']
  }
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export default function Experience() {
  const [openIndex, setOpenIndex] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="experience" id="experience">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.p className="exp-label" variants={itemVariants}>
            EXPERIENCE
          </motion.p>
          <motion.h2 className="exp-heading" variants={itemVariants}>
            Where I've been
          </motion.h2>

          <div className="exp-list">
            {experiences.map((exp, i) => (
              <motion.div
                className={`exp-item${openIndex === i ? ' open' : ''}`}
                key={i}
                variants={itemVariants}
              >
                <div className="exp-header" onClick={() => toggle(i)}>
                  <div className="exp-left">
                    <span className="exp-role">{exp.role}</span>
                    <span className="exp-company">
                      {exp.current && <span className="current-dot" />}
                      {exp.company}
                    </span>
                  </div>
                  <span className="exp-date">{exp.date}</span>
                  <span className="exp-toggle">+</span>
                </div>

                <div className="exp-details">
                  <div className="exp-details-inner">
                    <ul className="exp-highlights">
                      {exp.highlights.map((h, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: h }} />
                      ))}
                    </ul>
                    <div className="exp-tech">
                      {exp.tech.map((t, j) => (
                        <span key={j}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
