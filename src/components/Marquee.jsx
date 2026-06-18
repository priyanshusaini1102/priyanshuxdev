import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const skills = [
  'React', 'Node.js', 'TypeScript', 'Next.js', 'React Native',
  'PHP', 'MongoDB', 'Redis', 'Docker', 'AWS',
  'System Design', 'Microservices', 'CI/CD', 'Kafka'
]

export default function Marquee() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      className="marquee-section"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className="marquee-track">
        {[...Array(4)].map((_, setIndex) => (
          <div className="marquee-item" key={setIndex}>
            {skills.map((skill, i) => (
              <span key={`${setIndex}-${i}`}>
                {skill}
                <span className="dot" style={{ marginLeft: '2.5rem' }}></span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
