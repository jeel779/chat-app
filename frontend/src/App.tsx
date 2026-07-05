import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import { useAuthStore } from './store/useAuthStore'

function App() {
  const { authUser, checkAuth, isLoading, isLoggedIn, connectSocket, disconnectSocket } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (isLoggedIn && authUser) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [isLoggedIn, authUser, connectSocket, disconnectSocket]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-blue border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-4 border-b-brand-accent border-t-transparent border-r-transparent border-l-transparent animate-spin [animation-direction:reverse]"></div>
          </div>
          <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
            Connecting...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={!isLoggedIn ? <Login /> : <Navigate to="/chat" replace />}
          />
          <Route
            path="/signup"
            element={!isLoggedIn ? <Signup /> : <Navigate to="/chat" replace />}
          />
          <Route
            path="/chat"
            element={isLoggedIn ? <Chat /> : <Navigate to="/login" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  )
}

export default App
