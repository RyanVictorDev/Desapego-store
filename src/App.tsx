import { useCallback, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import Storefront from './pages/Storefront'
import Admin from './pages/Admin'
import './styles.css'

function AppContent() {
  const [toast, setToast] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3500)
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Storefront onToast={showToast} />} />
        <Route path="/admin" element={<Admin onToast={showToast} />} />
      </Routes>

      <div className={`toast ${toastVisible ? 'visible' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </BrowserRouter>
  )
}

export default App
