import { useState } from "react"
import { useAuth } from "../auth.jsx"
import { Button } from "../components/ui.jsx"
import { IconSpark, IconCheck, IconMail } from "../components/icons.jsx"

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-600/30">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M6 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="7.5" r="2.6" fill="currentColor" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight text-ink-900">
        connect<span className="text-brand-600">PR</span>
      </span>
    </div>
  )
}

const PERKS = [
  "12,000+ verified India-focused contacts",
  "Save shortlists & export to CSV",
  "Track competitors' PR & collabs",
]

export default function Auth() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState("signin") // signin | signup
  const [form, setForm] = useState({ email: "", password: "", fullName: "", brandName: "" })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(""); setNotice(""); setBusy(true)
    const fn = mode === "signin" ? signIn : signUp
    const { error } = await fn(form)
    setBusy(false)
    if (error) { setError(error.message); return }
    if (mode === "signup") {
      setNotice("Account created. If email confirmation is on, check your inbox — otherwise you're in!")
    }
    // On success the auth listener flips the app to the dashboard automatically.
  }

  return (
    <div className="flex min-h-screen bg-ink-50">
      {/* Left — brand panel (desktop only) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 p-10 text-white lg:flex">
        <Logo2 />
        <div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
            Find the right creators &amp; journalists to pitch — in seconds.
          </h1>
          <ul className="mt-6 space-y-3">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-brand-50">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15"><IconCheck size={13} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-brand-100">Made in India · for homegrown brands 🇮🇳</p>
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
      </div>

      {/* Right — form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="lg:hidden"><Logo /></div>
          <div className="mt-6 lg:mt-0">
            <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              {mode === "signin" ? "Log in to your connectPR workspace." : "Start finding contacts to pitch — free."}
            </p>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-3">
            {mode === "signup" && (
              <>
                <Field label="Full name" value={form.fullName} onChange={set("fullName")} placeholder="Chhavi Bhalla" />
                <Field label="Brand / Company" value={form.brandName} onChange={set("brandName")} placeholder="connectPR" />
              </>
            )}
            <Field label="Email" type="email" required value={form.email} onChange={set("email")} placeholder="you@brand.in" />
            <Field label="Password" type="password" required value={form.password} onChange={set("password")} placeholder="••••••••" minLength={6} />

            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600 ring-1 ring-inset ring-rose-100">{error}</p>}
            {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 ring-1 ring-inset ring-emerald-100">{notice}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "signin" ? "Log in" : "Create account"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-ink-500">
            {mode === "signin" ? "New to connectPR?" : "Already have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setNotice("") }}
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              {mode === "signin" ? "Create an account" : "Log in"}
            </button>
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-ink-100 px-3 py-2 text-xs text-ink-500">
            <IconMail size={14} className="shrink-0" />
            Free plan: 20 searches / month · no credit card needed.
          </div>
        </div>
      </div>
    </div>
  )
}

function Logo2() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 text-white">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <path d="M6 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="7.5" r="2.6" fill="currentColor" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight">connectPR</span>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-ink-200 bg-surface px-3 py-2.5 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </label>
  )
}
