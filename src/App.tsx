import { useState } from 'react'
import SmoothScroll from './components/SmoothScroll'
import Cursor from './components/Cursor'
import Noise from './components/Noise'
import Loader from './components/Loader'
import Nav from './components/Nav'
import ScrollProgress from './components/ScrollProgress'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Ticker from './sections/Ticker'
import About from './sections/About'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Skills from './sections/Skills'
import Certifications from './sections/Certifications'
import Contact from './sections/Contact'

function App() {
  // Held until the intro curtain has lifted, so the hero performs its entrance
  // for the visitor rather than behind the loader.
  const [ready, setReady] = useState(false)

  return (
    <>
      <Noise />
      <Cursor />
      <ScrollProgress />

      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-void"
      >
        Skip to content
      </a>

      {/* Inside the provider so the loader and menu can pause Lenis directly */}
      <SmoothScroll>
        <Loader onDone={() => setReady(true)} />
        <Nav />
        <main id="content">
          <Hero ready={ready} />
          <Ticker />
          <About />
          <Projects />
          <Experience />
          <Skills />
          <Certifications />
          <Contact />
        </main>
        <Footer />
      </SmoothScroll>
    </>
  )
}

export default App
