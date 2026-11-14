import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { educationSchool, roleWhen } from "./format.js"
import { registerResumeFonts } from "./fonts.js"

registerResumeFonts()

const mm = (value) => (value * 72) / 25.4
const px = (value) => value * 0.75

const ink = "#111111"
const rule = "#444444"
const muted = "#333333"

const styles = StyleSheet.create({
  page: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    lineHeight: 1.2,
    color: ink,
    paddingTop: mm(7.2),
    paddingBottom: mm(7.2),
    paddingLeft: mm(11),
    paddingRight: mm(11),
  },
  name: {
    fontFamily: "Arimo",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.05,
    textAlign: "center",
  },
  contact: {
    fontFamily: "Arimo",
    fontSize: 8.3,
    lineHeight: 1.2,
    textAlign: "center",
    marginTop: px(2),
    marginBottom: px(1),
    color: ink,
  },
  link: {
    color: ink,
    textDecoration: "none",
  },
  section: {
    fontFamily: "Arimo",
    fontSize: 10.2,
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: 0.35,
    marginTop: px(4.6),
    marginBottom: px(1.2),
    paddingBottom: 0.6,
    borderBottomWidth: 0.8,
    borderBottomColor: rule,
  },
  paragraph: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    lineHeight: 1.2,
    marginTop: px(1.15),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: px(2.4),
  },
  rowLeft: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    fontWeight: 700,
    lineHeight: 1.2,
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  rowRight: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    fontWeight: 700,
    lineHeight: 1.2,
    textAlign: "right",
  },
  role: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: px(0.8),
  },
  roleLeft: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    fontStyle: "italic",
    fontWeight: 400,
    lineHeight: 1.2,
    flexGrow: 1,
    flexShrink: 1,
    paddingRight: 8,
  },
  roleRight: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    fontStyle: "italic",
    fontWeight: 400,
    lineHeight: 1.2,
    textAlign: "right",
  },
  list: {
    marginTop: px(0.4),
  },
  bullet: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: px(0.35),
    paddingLeft: px(4),
  },
  mark: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    lineHeight: 1.2,
    width: px(10),
  },
  bulletText: {
    fontFamily: "Arimo",
    fontSize: 8.9,
    lineHeight: 1.2,
    flexGrow: 1,
    flexShrink: 1,
  },
  stack: {
    fontFamily: "Arimo",
    fontSize: 8.7,
    fontStyle: "italic",
    fontWeight: 400,
    lineHeight: 1.2,
    color: muted,
    marginTop: px(0.4),
  },
  degree: {
    fontFamily: "Arimo",
    fontWeight: 400,
  },
})

function Section({ children }) {
  return <Text style={styles.section} minPresenceAhead={28}>{children}</Text>
}

function BulletList({ items }) {
  const bullets = (items || []).filter((item) => String(item).trim() !== "")
  if (bullets.length === 0) return null
  return (
    <View style={styles.list}>
      {bullets.map((item, index) => (
        <View key={`${index}-${item.slice(0, 24)}`} style={styles.bullet} wrap={false}>
          <Text style={styles.mark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function ContactLine({ contact }) {
  const items = contact || []
  return (
    <Text style={styles.contact}>
      {items.map((item, index) => (
        <Text key={`${item.label}-${index}`}>
          {index > 0 ? " | " : ""}
          {item.href ? <Link src={item.href} style={styles.link}>{item.label}</Link> : item.label}
        </Text>
      ))}
    </Text>
  )
}

export function ResumeDocument({ resume }) {
  const data = resume || {}
  const name = data.name || ""

  return (
    <Document title={`${name} - Resume`} author={name} language="en">
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{name}</Text>
        <ContactLine contact={data.contact} />

        <Section>SUMMARY</Section>
        <Text style={styles.paragraph}>{data.summary}</Text>

        <Section>TECHNICAL SKILLS</Section>
        {(data.skills || []).map((skill) => (
          <Text key={skill.label} style={styles.paragraph}>
            <Text style={{ fontWeight: 700 }}>{skill.label}: </Text>
            {skill.items}
          </Text>
        ))}

        <Section>EXPERIENCE</Section>
        {(data.experience || []).map((job) => (
          <View key={`${job.company}-${job.dates}`}>
            <View style={styles.row}>
              <Text style={styles.rowLeft}>{job.company}</Text>
              <Text style={styles.rowRight}>{job.dates}</Text>
            </View>
            {(job.roles || []).map((role, index) => (
              <View key={`${role.title}-${role.dates}`}>
                <View style={styles.role}>
                  <Text style={styles.roleLeft}>{role.title}</Text>
                  <Text style={styles.roleRight}>{roleWhen(role, job, index)}</Text>
                </View>
                <BulletList items={role.bullets} />
              </View>
            ))}
          </View>
        ))}

        <Section>PROJECTS</Section>
        {(data.projects || []).map((project) => (
          <View key={project.name}>
            <View style={styles.row}>
              <Text style={styles.rowLeft}>{project.name}</Text>
              <Text style={styles.rowRight}>
                {project.href
                  ? <Link src={project.href} style={styles.link}>{project.linkLabel}</Link>
                  : project.linkLabel}
              </Text>
            </View>
            {project.stack ? <Text style={styles.stack}>{project.stack}</Text> : null}
            <BulletList items={project.bullets} />
          </View>
        ))}

        <Section>EDUCATION</Section>
        {(data.education || []).map((school) => (
          <View key={`${school.school}-${school.dates}`} style={styles.row}>
            <Text style={styles.rowLeft}>
              {educationSchool(school)}
              <Text style={styles.degree}>{` — ${school.degree}`}</Text>
            </Text>
            <Text style={styles.rowRight}>{school.dates}</Text>
          </View>
        ))}
      </Page>
    </Document>
  )
}
