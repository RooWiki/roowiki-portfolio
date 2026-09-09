// Shared file — section order updated for CV redesign (2026-09-09).
// Theme management kept in useTheme but toggle hidden; design is always dark.
import Header from './components/Header'
import Hero from './sections/Hero/Hero'
import About from './sections/About'
import Software from './sections/Software'
import Skills from './sections/Skills'
import Tools from './sections/FeaturedProjects'
import Projects from './sections/SelectedWork'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ flex: 1, paddingTop: 52 /* fixed header height */ }}>
        <Hero />
        <About />
        <Software />
        <Skills />
        <Tools />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}
