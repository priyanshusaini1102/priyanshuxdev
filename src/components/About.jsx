import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const facts = [
  { num: "3+", text: "Years building production systems" },
  { num: "9", text: "Projects led at Datacultr" },
  { num: "3", text: "Companies shipped code for" },
  { num: "1", text: "Startup co-founded as CTO" },
];

export default function About() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section className="about" id="about" ref={sectionRef}>
      <div className="container">
        <div className="about-layout">
          {/* Left column — narrative */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="about-label">ABOUT</p>

            <h2 className="about-heading">Engineer who ships end-to-end</h2>

            <p className="about-text">
              I'm a Full Stack Developer at Datacultr, promoted to SDE-2, now
              leading 9 production projects — 4 backend services, 1 React Native
              app, and 4 frontend dashboards.
            </p>

            <p className="about-text">
              My journey started at Internshala where I migrated AngularJS to
              React. Since then I've built insurance portals, fintech dashboards,
              microservices, and co-founded a government-funded startup as Acting
              CTO.
            </p>

            <p className="about-text">
              I care about clean architecture, security-first dev, and systems
              that scale.
            </p>
          </motion.div>

          {/* Right column — facts */}
          <div className="about-facts">
            {facts.map((fact, i) => (
              <motion.div
                className="about-fact"
                key={fact.num}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.12,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <span className="about-fact-number">{fact.num}</span>
                <span className="about-fact-text">{fact.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
