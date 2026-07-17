import { useState } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../store.jsx"
import { useAuth } from "../auth.jsx"
import { Card, Badge, Button, Avatar } from "../components/ui.jsx"
import { IconPlus, IconSpark, IconCheck, IconMail } from "../components/icons.jsx"

const TABS = ["Profile", "Billing", "Team", "Notifications"]

const TEAM = [
  { name: "Chhavi B.", email: "chhavi@connectpr.in", role: "Owner", seed: "Chhavi" },
  { name: "Rahul M.", email: "rahul@connectpr.in", role: "Editor", seed: "Rahul" },
]

function Field({ label, defaultValue, type = "text", placeholder }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-ink-200 bg-surface px-3 py-2.5 text-sm text-ink-700 placeholder:text-ink-400 focus:border-brand-300 focus:outline-none focus:ring-4 focus:ring-brand-100"
      />
    </label>
  )
}

export default function Settings() {
  const { notify } = useStore()
  const { cloud, user, signOut } = useAuth()
  const [tab, setTab] = useState("Profile")

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-ink-900">Settings</h1>
        <p className="text-sm text-ink-500">Manage your account, billing and team.</p>
      </div>

      {/* tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-ink-200">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative whitespace-nowrap px-4 py-2.5 text-sm font-medium transition ${
              tab === t ? "text-brand-700" : "text-ink-500 hover:text-ink-800"
            }`}
          >
            {t}
            {tab === t && <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-600" />}
          </button>
        ))}
      </div>

      {tab === "Profile" && (
        <Card className="max-w-2xl p-6">
          <div className="flex items-center gap-4">
            <Avatar src="https://api.dicebear.com/7.x/notionists/svg?seed=Chhavi&backgroundColor=ede9fe" name="Chhavi" size={64} />
            <div>
              <Button variant="secondary" size="sm">Change photo</Button>
              <p className="mt-1.5 text-xs text-ink-400">JPG or PNG, up to 2MB.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" defaultValue="Chhavi Bhalla" />
            <Field label="Brand / Company" defaultValue="connectPR" />
            <Field label="Email" type="email" defaultValue="chhavi@connectpr.in" />
            <Field label="City" defaultValue="Delhi" />
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="ghost">Cancel</Button>
            <Button onClick={() => notify("Profile saved")}><IconCheck size={16} /> Save changes</Button>
          </div>
        </Card>
      )}

      {tab === "Profile" && cloud && (
        <Card className="flex max-w-2xl items-center justify-between gap-4 p-6">
          <div className="min-w-0">
            <h2 className="font-semibold text-ink-900">Account</h2>
            <p className="truncate text-sm text-ink-500">
              Signed in as <span className="font-medium text-ink-700">{user?.email}</span>
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={async () => { await signOut(); notify("Signed out", "slate") }}
          >
            Log out
          </Button>
        </Card>
      )}

      {tab === "Billing" && (
        <div className="grid max-w-3xl gap-5 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-ink-900">Current plan</h2>
                <p className="text-sm text-ink-500">You're on the Free plan.</p>
              </div>
              <Badge tone="slate">Free</Badge>
            </div>
            <div className="mt-4 rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50 to-surface p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-900">
                <IconSpark size={16} className="text-brand-600" /> Upgrade to Pro
              </div>
              <p className="mt-1 text-sm text-ink-600">Unlimited searches, exports and 10 tracked competitors for ₹1,499/mo.</p>
              <Link to="/pricing"><Button size="sm" className="mt-3">See plans</Button></Link>
            </div>
            <div className="mt-5">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Payment method</h3>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-ink-200 p-3">
                <span className="text-sm text-ink-500">No payment method on file</span>
                <Button variant="secondary" size="sm" onClick={() => notify("Opening Razorpay…")}>Add card / UPI</Button>
              </div>
              <p className="mt-2 text-xs text-ink-400">Secured by Razorpay &amp; Stripe.</p>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-400">Usage this month</h3>
            <div className="mt-3 space-y-3">
              <div>
                <div className="flex justify-between text-sm"><span className="text-ink-600">Searches</span><span className="font-semibold">12 / 20</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full w-3/5 rounded-full bg-brand-500" /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm"><span className="text-ink-600">Lists</span><span className="font-semibold">2 / 2</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100"><div className="h-full w-full rounded-full bg-amber-500" /></div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === "Team" && (
        <Card className="max-w-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-ink-900">Team members</h2>
              <p className="text-sm text-ink-500">Invite teammates to collaborate on lists.</p>
            </div>
            <Button size="sm" onClick={() => notify("Invite sent")}><IconPlus size={15} /> Invite</Button>
          </div>
          <div className="mt-4 divide-y divide-ink-100">
            {TEAM.map((m) => (
              <div key={m.email} className="flex items-center gap-3 py-3">
                <Avatar src={`https://api.dicebear.com/7.x/notionists/svg?seed=${m.seed}&backgroundColor=ede9fe`} name={m.name} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-ink-900">{m.name}</div>
                  <div className="truncate text-xs text-ink-400">{m.email}</div>
                </div>
                <Badge tone={m.role === "Owner" ? "brand" : "slate"}>{m.role}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-ink-300 p-3 text-center text-sm text-ink-400">
            Team seats are a <b className="text-ink-600">Team plan</b> feature. <Link to="/pricing" className="text-brand-600">Upgrade →</Link>
          </div>
        </Card>
      )}

      {tab === "Notifications" && (
        <Card className="max-w-2xl divide-y divide-ink-100 p-2">
          {[
            ["Competitor activity", "Get notified when a tracked brand runs a new collab", true],
            ["New matching creators", "Weekly digest of creators matching your saved niches", true],
            ["Product updates", "Occasional emails about new features", false],
            ["Search quota alerts", "Warn me when I'm close to my monthly limit", true],
          ].map(([title, desc, on]) => (
            <label key={title} className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-900"><IconMail size={15} className="text-ink-400" /> {title}</div>
                <p className="mt-0.5 text-xs text-ink-500">{desc}</p>
              </div>
              <ToggleSwitch defaultOn={on} />
            </label>
          ))}
        </Card>
      )}
    </div>
  )
}

function ToggleSwitch({ defaultOn }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-brand-600" : "bg-ink-300"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-[#fff] shadow transition-transform ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  )
}
