import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import Auth from './pages/Auth.jsx'
import { AuthProvider, useAuth } from './auth.jsx'
import './index.css'

// Full-screen splash shown while we check for an existing session (cloud mode).
function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-ink-50">
      <div className="flex flex-col items-center gap-3">
        <span className="grid h-11 w-11 animate-pulse place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
            <path d="M6 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="12" cy="7.5" r="2.6" fill="currentColor" />
          </svg>
        </span>
        <span className="text-sm font-medium text-ink-400">Loading your workspace…</span>
      </div>
    </div>
  )
}

// Decides what to render based on auth state:
//   • local mode (no Supabase keys) → straight to the app (guest, localStorage)
//   • cloud + still checking session → splash
//   • cloud + not logged in         → login / sign-up screen
//   • cloud + logged in             → the app
function Root() {
  const { cloud, user, loading } = useAuth()
  if (cloud && loading) return <Splash />
  if (cloud && !user) return <Auth />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
