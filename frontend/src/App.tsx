import { useCallback, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { StoreProvider } from './context/StoreContext'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Storefront from './pages/Storefront'
import Admin from './pages/Admin'
import Login from './pages/Login'
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
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin onToast={showToast} />
            </ProtectedRoute>
          }
        />
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
      <AuthProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
