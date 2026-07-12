import { useState } from "react"
import { useStore } from "../store.jsx"
import { Card, Badge, Button } from "../components/ui.jsx"
import { IconCheck, IconSpark } from "../components/icons.jsx"

const PLANS = [
  {
    id: "free", name: "Free", tagline: "For trying it out",
    monthly: 0, yearly: 0,
    features: [
      "20 searches / month",
      "Basic filters (niche, city, platform)",
      "Save up to 2 lists",
      "1 competitor tracked",
      "Community support",
    ],
    cta: "Current plan", highlight: false,
  },
  {
    id: "pro", name: "Pro", tagline: "For growing brands",
    monthly: 1499, yearly: 14990,
    features: [
      "Unlimited searches",
      "All filters + engagement & fit scores",
      "Unlimited lists & CSV export",
      "Track 10 competitors",
      "Verified email & contact info",
      "Pitch templates",
      "Priority email support",
    ],
    cta: "Upgrade to Pro", highlight: true,
  },
  {
    id: "team", name: "Team", tagline: "For agencies & teams",
    monthly: 3999, yearly: 39990,
    features: [
      "Everything in Pro",
      "5 team seats included",
      "Shared lists & notes",
      "Track 30 competitors",
      "API access (beta)",
      "Dedicated success manager",
    ],
    cta: "Talk to sales", highlight: false,
  },
]

const COMPARE = [
  ["Monthly searches", "20", "Unlimited", "Unlimited"],
  ["Saved lists", "2", "Unlimited", "Unlimited"],
  ["CSV export", false, true, true],
  ["Competitor tracking", "1 brand", "10 brands", "30 brands"],
  ["Verified contact info", false, true, true],
  ["Team seats", "1", "1", "5"],
  ["API access", false, false, true],
]

export default function Pricing() {
  const { notify } = useStore()
  const [yearly, setYearly] = useState(true)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <Badge tone="brand"><IconSpark size={13} /> Simple, honest pricing</Badge>
        <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
          Pitch more, guess less.
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
          Start free. Upgrade when you're ready. No hidden fees, cancel anytime.
        </p>

        {/* billing toggle */}
        <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-ink-200 bg-surface p-1">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!yearly ? "bg-brand-600 text-white" : "text-ink-500"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${yearly ? "bg-brand-600 text-white" : "text-ink-500"}`}
          >
            Yearly <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${yearly ? "bg-white/20" : "bg-emerald-100 text-emerald-700"}`}>2 months free</span>
          </button>
        </div>
      </div>

      {/* plan cards */}
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.id}
            className={`relative flex flex-col p-6 ${p.highlight ? "ring-2 ring-brand-500 shadow-lg shadow-brand-600/10" : ""}`}
          >
            {p.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Most popular
              </span>
            )}
            <div>
              <h3 className="text-lg font-bold text-ink-900">{p.name}</h3>
              <p className="text-sm text-ink-400">{p.tagline}</p>
            </div>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-ink-900">
                ₹{yearly ? Math.round(p.yearly / 12).toLocaleString("en-IN") : p.monthly.toLocaleString("en-IN")}
              </span>
              <span className="mb-1 text-sm text-ink-400">/ month</span>
            </div>
            {yearly && p.yearly > 0 && (
              <p className="mt-0.5 text-xs text-ink-400">Billed ₹{p.yearly.toLocaleString("en-IN")} yearly</p>
            )}

            <Button
              variant={p.highlight ? "primary" : "secondary"}
              size="lg"
              className="mt-5 w-full"
              disabled={p.id === "free"}
              onClick={() => notify(p.id === "team" ? "Sales will reach out 👋" : "Redirecting to secure checkout…")}
            >
              {p.cta}
            </Button>

            <ul className="mt-6 space-y-2.5">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <span className="mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                    <IconCheck size={12} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      {/* comparison table */}
      <Card className="overflow-hidden">
        <div className="border-b border-ink-100 p-5">
          <h2 className="font-semibold text-ink-900">Compare plans</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink-100 text-ink-500">
                <th className="py-3 pl-5 pr-3 font-medium">Feature</th>
                <th className="px-3 py-3 text-center font-semibold text-ink-700">Free</th>
                <th className="px-3 py-3 text-center font-semibold text-brand-700">Pro</th>
                <th className="px-3 py-3 text-center font-semibold text-ink-700">Team</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row) => (
                <tr key={row[0]} className="border-b border-ink-50 last:border-0">
                  <td className="py-3 pl-5 pr-3 font-medium text-ink-700">{row[0]}</td>
                  {row.slice(1).map((cell, i) => (
                    <td key={i} className="px-3 py-3 text-center">
                      {cell === true ? (
                        <span className="inline-grid h-5 w-5 place-items-center rounded-full bg-emerald-50 text-emerald-600"><IconCheck size={13} /></span>
                      ) : cell === false ? (
                        <span className="text-ink-300">—</span>
                      ) : (
                        <span className="text-ink-700">{cell}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <p className="text-center text-xs text-ink-400">
        Prices in INR, incl. GST. Secure payments via Razorpay &amp; Stripe. Questions? hello@connectpr.in
      </p>
    </div>
  )
}
