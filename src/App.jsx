import { useState } from "react"
import { Routes, Route, NavLink, useLocation, Link } from "react-router-dom"
import { StoreProvider, useStore } from "./store.jsx"
import {
  IconHome, IconCompass, IconBookmark, IconChart, IconTag, IconGear,
  IconSearch, IconSpark, IconCheck, IconSun, IconMoon,
} from "./components/icons.jsx"
import { Badge } from "./components/ui.jsx"

import Dashboard from "./pages/Dashboard.jsx"
import Discover from "./pages/Discover.jsx"
import Profile from "./pages/Profile.jsx"
import Lists from "./pages/Lists.jsx"
import Competitors from "./pages/Competitors.jsx"
import Pricing from "./pages/Pricing.jsx"
import Settings from "./pages/Settings.jsx"

const NAV = [
  { to: "/", label: "Dashboard", icon: IconHome, end: true },
  { to: "/discover", label: "Search & Discover", icon: IconCompass },
  { to: "/lists", label: "My Lists", icon: IconBookmark },
  { to: "/competitors", label: "Competitor Tracker", icon: IconChart },
  { to: "/pricing", label: "Pricing", icon: IconTag },
  { to: "/settings", label: "Settings", icon: IconGear },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M6 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="7.5" r="2.6" fill="currentColor" />
        </svg>
      </span>
      <span className="text-[17px] font-extrabold tracking-tight text-ink-900">
        connect<span className="text-brand-600">PR</span>
      </span>
    </Link>
  )
}

function Sidebar() {
  const { searchesUsed, searchQuota } = useStore()
  const pct = Math.round((searchesUsed / searchQuota) * 100)
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-ink-200 bg-surface">
      <div className="px-5 py-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-700" : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={19} className={isActive ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"} />
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50 to-surface p-4">
        <div className="flex items-center justify-between text-xs font-medium text-ink-600">
          <span>Free plan</span>
          <span className="text-ink-400">{searchesUsed}/{searchQuota} searches</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
          <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
        </div>
        <Link
          to="/pricing"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-brand-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
        >
          <IconSpark size={14} /> Upgrade to Pro
        </Link>
      </div>
    </aside>
  )
}

function MobileNav() {
  const loc = useLocation()
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t border-ink-200 bg-surface/95 backdrop-blur">
      <div className="flex items-center justify-around px-2 py-1.5">
        {NAV.slice(0, 5).map((item) => {
          const active = item.end ? loc.pathname === item.to : loc.pathname.startsWith(item.to)
          return (
            <NavLink key={item.to} to={item.to} className="flex flex-col items-center gap-0.5 px-2 py-1">
              <item.icon size={20} className={active ? "text-brand-600" : "text-ink-400"} />
              <span className={`text-[10px] font-medium ${active ? "text-brand-600" : "text-ink-400"}`}>
                {item.label.split(" ")[0]}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useStore()
  const dark = theme === "dark"
  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="grid h-9 w-9 place-items-center rounded-xl border border-ink-200 bg-surface text-ink-500 transition-all hover:border-brand-200 hover:text-brand-600 active:scale-95"
    >
      {dark ? <IconSun size={18} className="animate-pop" /> : <IconMoon size={18} />}
    </button>
  )
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-200 bg-surface/80 px-4 py-3 backdrop-blur lg:px-8">
      <div className="lg:hidden"><Logo /></div>
      <div className="relative ml-auto hidden max-w-md flex-1 lg:block">
        <IconSearch size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
        <input
          placeholder="Quick search — try “beauty creators in Mumbai”"
          className="w-full rounded-xl border border-ink-200 bg-ink-50 py-2 pl-9 pr-3 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:bg-surface focus:outline-none focus:ring-4 focus:ring-brand-100"
        />
      </div>
      <div className="ml-auto flex items-center gap-3 lg:ml-0">
        <ThemeToggle />
        <Badge tone="emerald" className="hidden sm:inline-flex">Data updated · today</Badge>
        <div className="flex items-center gap-2">
          <img
            src="https://api.dicebear.com/7.x/notionists/svg?seed=Chhavi&backgroundColor=ede9fe"
            alt="You"
            className="h-9 w-9 rounded-full ring-2 ring-surface shadow-sm"
          />
          <div className="hidden text-left sm:block">
            <div className="text-sm font-semibold leading-tight text-ink-800">Chhavi B.</div>
            <div className="text-xs leading-tight text-ink-400">Founder · connectPR</div>
          </div>
        </div>
      </div>
    </header>
  )
}

function Toast() {
  const { toast } = useStore()
  if (!toast) return null
  const tone = toast.tone === "brand"
    ? "bg-ink-900 dark:bg-brand-600 dark:text-white"
    : "bg-ink-700 dark:bg-ink-200"
  return (
    <div className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 lg:bottom-6">
      <div className={`animate-fade-up flex items-center gap-2 rounded-full ${tone} px-4 py-2.5 text-sm font-medium text-white shadow-xl`}>
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15"><IconCheck size={13} /></span>
        {toast.message}
      </div>
    </div>
  )
}

function Shell() {
  return (
    <div className="flex min-h-screen bg-ink-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">
          <div className="mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/contact/:id" element={<Profile />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/competitors" element={<Competitors />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
      <MobileNav />
      <Toast />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
