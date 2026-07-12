// Tiny app store using Context — holds saved contacts, toasts, usage counter, theme.
import { createContext, useContext, useState, useCallback, useEffect } from "react"

const StoreContext = createContext(null)

function initialTheme() {
  if (typeof window === "undefined") return "light"
  const saved = window.localStorage.getItem("cpr-theme")
  if (saved === "dark" || saved === "light") return saved
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function StoreProvider({ children }) {
  const [saved, setSaved] = useState(() => new Set(["c1", "c7"]))
  const [toast, setToast] = useState(null)
  const [searchesUsed, setSearchesUsed] = useState(12)
  const searchQuota = 20

  const [theme, setTheme] = useState(initialTheme)
  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem("cpr-theme", theme)
  }, [theme])
  const toggleTheme = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), [])

  const notify = useCallback((message, tone = "brand") => {
    setToast({ message, tone, id: Math.round(performance.now()) })
    setTimeout(() => setToast(null), 2200)
  }, [])

  const toggleSave = useCallback((contact) => {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(contact.id)) {
        next.delete(contact.id)
        setToast({ message: `Removed ${contact.name} from saved`, tone: "slate", id: Math.round(performance.now()) })
      } else {
        next.add(contact.id)
        setToast({ message: `${contact.name} saved`, tone: "brand", id: Math.round(performance.now()) })
      }
      setTimeout(() => setToast(null), 2200)
      return next
    })
  }, [])

  const value = {
    saved, toggleSave, isSaved: (id) => saved.has(id),
    toast, notify,
    searchesUsed, searchQuota, bumpSearch: () => setSearchesUsed((n) => Math.min(searchQuota, n + 1)),
    theme, toggleTheme,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
