import { useCallback, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Benefits from './components/Benefits'
import Catalog from './components/Catalog'
import About from './components/About'
import HowToOrder from './components/HowToOrder'
import Footer from './components/Footer'
import './styles.css'

function App() {
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3500)
  }, [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Catalog onToast={showToast} />
        <About />
        <HowToOrder />
      </main>
      <Footer />

      <div className={`toast ${toastVisible ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}

export default App
