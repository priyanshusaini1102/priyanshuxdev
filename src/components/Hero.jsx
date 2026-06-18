import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <motion.div
        className="container"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Eyebrow */}
        <motion.div className="hero-eyebrow" variants={fadeUp}>
          Software Engineer 2
          <span className="pulse" />
          Available for work
        </motion.div>

        {/* Name */}
        <motion.h1 className="hero-name" variants={fadeUp}>
          <span className="accent-letter">P</span>RIYANSHU
          <br />
          SAINI
        </motion.h1>

        {/* Bottom row */}
        <motion.div className="hero-bottom" variants={fadeUp}>
          <div>
            <p className="hero-desc">
              I build products from concept to deployment — crafting clean
              interfaces, solid backends, and everything in between. Focused on
              performance, clarity, and shipping things that matter.
            </p>
            <a
              className="hero-resume-link"
              href="https://drive.google.com/uc?export=download&id=18F9H0WjIZ6HrEohtHk7pIhflX11F7w1i"
              target="_blank"
              rel="noopener noreferrer"
            >
              ↓ Download Resume
            </a>
          </div>

          <div className="hero-scroll">
            <span>Scroll</span>
            <div className="hero-scroll-line" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
