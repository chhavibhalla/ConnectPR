// Shared UI primitives — Button, Badge, Avatar, Skeleton, Card, Toggle, Stat.
import { platformIcon } from "./icons.jsx"

export function Button({ variant = "primary", size = "md", className = "", children, ...props }) {
  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
    secondary: "bg-surface text-ink-700 border border-ink-200 hover:bg-ink-50 hover:border-ink-300",
    ghost: "text-ink-600 hover:bg-ink-100",
    subtle: "bg-brand-50 text-brand-700 hover:bg-brand-100",
    danger: "bg-surface text-red-600 border border-red-200 hover:bg-red-50",
  }
  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5 rounded-lg",
    md: "text-sm px-3.5 py-2 gap-2 rounded-xl",
    lg: "text-sm px-5 py-2.5 gap-2 rounded-xl font-semibold",
  }
  return (
    <button
      className={`inline-flex items-center justify-center font-medium transition-all active:scale-[.97] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const badgeTones = {
  brand: "bg-brand-50 text-brand-700 ring-brand-100",
  slate: "bg-ink-100 text-ink-600 ring-ink-200",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  sky: "bg-sky-50 text-sky-700 ring-sky-100",
}

export function Badge({ tone = "slate", className = "", children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${badgeTones[tone] || badgeTones.slate} ${className}`}>
      {children}
    </span>
  )
}

export function Avatar({ src, name, size = 44, ring = true }) {
  return (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      className={`shrink-0 rounded-full bg-brand-50 object-cover ${ring ? "ring-2 ring-surface shadow-sm" : ""}`}
      style={{ width: size, height: size }}
    />
  )
}

export function PlatformPill({ platform, size = "sm" }) {
  const Icon = platformIcon(platform)
  const tone = {
    Instagram: "text-rose-600 bg-rose-50 ring-rose-100",
    YouTube: "text-red-600 bg-red-50 ring-red-100",
    Blog: "text-sky-600 bg-sky-50 ring-sky-100",
    "News/Press": "text-ink-600 bg-ink-100 ring-ink-200",
  }[platform] || "text-ink-600 bg-ink-100 ring-ink-200"
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${tone}`}>
      <Icon size={13} /> {platform}
    </span>
  )
}

export function Card({ className = "", children, ...props }) {
  return (
    <div className={`rounded-2xl border border-ink-200/80 bg-surface shadow-sm ${className}`} {...props}>
      {children}
    </div>
  )
}

export function Stat({ label, value, sub, tone = "ink" }) {
  const toneMap = {
    ink: "text-ink-900", brand: "text-brand-700",
    emerald: "text-emerald-600", amber: "text-amber-600",
  }
  return (
    <div>
      <div className="text-xs font-medium text-ink-500">{label}</div>
      <div className={`mt-0.5 text-2xl font-bold tracking-tight ${toneMap[tone]}`}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-ink-400">{sub}</div>}
    </div>
  )
}

export function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-lg ${className}`} />
}

export function Toggle({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-ink-200 bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
            value === o.value ? "bg-brand-600 text-white shadow-sm" : "text-ink-500 hover:text-ink-700"
          }`}
          title={o.label}
        >
          {o.icon} <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  )
}

export function EngagementDot({ value }) {
  const tone = value >= 6 ? "bg-emerald-500" : value >= 4 ? "bg-amber-500" : "bg-ink-300"
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${tone}`} />
}
