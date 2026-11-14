import { lazy, Suspense } from "react"
import Atmosphere from "./components/Atmosphere.jsx"
import TopBar from "./components/TopBar.jsx"
import Intro from "./components/Intro.jsx"
import Services from "./components/Services.jsx"
import Process from "./components/Process.jsx"
import Work from "./components/Work.jsx"
import Stack from "./components/Stack.jsx"
import Questions from "./components/Questions.jsx"
import Inquiry from "./components/Inquiry.jsx"
import Colophon from "./components/Colophon.jsx"

const AdminApp = lazy(() => import("./admin/AdminApp.jsx"))

function isAdminRoute() {
  const path = window.location.pathname.replace(/\/+$/, "") || "/"
  return path === "/admin"
}

export default function App() {
  if (isAdminRoute()) {
    return (
      <Suspense fallback={null}>
        <AdminApp />
      </Suspense>
    )
  }

  return (
    <>
      <a className="skip" href="#content">Skip to content</a>
      <Atmosphere />
      <TopBar />
      <main id="content">
        <Intro />
        <Services />
        <Process />
        <Work />
        <Stack />
        <Questions />
        <Inquiry />
      </main>
      <Colophon />
    </>
  )
}
