// Auth context. In cloud mode (Supabase configured) it tracks the real
// session. In local mode it reports a "guest" so the app is fully usable
// without any backend.
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase, isSupabaseConfigured } from "./lib/supabase.js"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => { active = false; sub.subscription.unsubscribe() }
  }, [])

  const signUp = useCallback(async ({ email, password, fullName, brandName }) => {
    if (!isSupabaseConfigured) return { error: { message: "Backend not configured." } }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName || "", brand_name: brandName || "" } },
    })
    return { error }
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    if (!isSupabaseConfigured) return { error: { message: "Backend not configured." } }
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const value = {
    cloud: isSupabaseConfigured, // true when a real backend is wired
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
