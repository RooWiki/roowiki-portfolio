import { useTheme } from './hooks/useTheme'
import Header from './components/Header'
import Hero from './sections/Hero'
import FeaturedProjects from './sections/FeaturedProjects'
import SelectedWork from './sections/SelectedWork'
import About from './sections/About'
import Footer from './sections/Footer'

export default function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <main style={{ flex: 1 }}>
        <Hero />
        <FeaturedProjects />
        <SelectedWork />
        <About />
      </main>

      <Footer />
    </div>
  )
}
