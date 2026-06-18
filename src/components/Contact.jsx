import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 }
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

export default function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section className="contact" id="contact">
      <div className="container">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.h2 className="contact-heading" variants={itemVariants}>
            Let's work
            <br />
            together<span className="accent">.</span>
          </motion.h2>

          <motion.p className="contact-sub" variants={itemVariants}>
            I'm exploring new opportunities where I can contribute to ambitious
            engineering teams. Whether it's a role, collaboration, or
            conversation — I'd love to connect.
          </motion.p>

          <motion.a
            className="contact-email"
            href="mailto:priyanshusaini1102@gmail.com"
            variants={itemVariants}
          >
            priyanshusaini1102@gmail.com →
          </motion.a>

          <motion.div className="contact-socials" variants={itemVariants}>
            <a
              className="contact-social"
              href="https://www.linkedin.com/in/priyanshusaini1102/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
            <a
              className="contact-social"
              href="https://github.com/priyanshusaini1102"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a className="contact-social" href="tel:+917017413590">Phone</a>
            <a
              className="contact-social"
              href="https://drive.google.com/uc?export=download&id=18F9H0WjIZ6HrEohtHk7pIhflX11F7w1i"
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume ↓
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
