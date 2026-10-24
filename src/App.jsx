import Header from "./components/Header.jsx"
import Hero from "./components/Hero.jsx"
import Build from "./components/Build.jsx"
import Exploring from "./components/Exploring.jsx"
import Projects from "./components/Projects.jsx"
import Writing from "./components/Writing.jsx"
import Now from "./components/Now.jsx"
import Story from "./components/Story.jsx"
import Contact from "./components/Contact.jsx"
import Footer from "./components/Footer.jsx"

export default function App() {
  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <p className="spine" aria-hidden="true">Priyanshu Saini — Backend engineer building with AI</p>
      <Header />
      <main id="content">
        <Hero />
        <Build />
        <Exploring />
        <Projects />
        <Writing />
        <Now />
        <Story />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
