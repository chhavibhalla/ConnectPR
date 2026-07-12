// Lightweight inline icon set — stroke-based, inherits currentColor.
const base = {
  fill: "none", stroke: "currentColor", strokeWidth: 1.8,
  strokeLinecap: "round", strokeLinejoin: "round",
}

const Svg = ({ children, size = 18, ...p }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...p}>{children}</svg>
)

export const IconSearch = (p) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>
export const IconGrid = (p) => <Svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></Svg>
export const IconRows = (p) => <Svg {...p}><rect x="3" y="4" width="18" height="5" rx="1.5" /><rect x="3" y="12" width="18" height="5" rx="1.5" /></Svg>
export const IconHome = (p) => <Svg {...p}><path d="M4 11.5 12 4l8 7.5" /><path d="M6 10v9h12v-9" /></Svg>
export const IconCompass = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></Svg>
export const IconBookmark = (p) => <Svg {...p}><path d="M6 4h12v16l-6-4-6 4z" /></Svg>
export const IconBookmarkFill = ({ size = 18, ...p }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...p}><path d="M6 4h12v16l-6-4-6 4z" /></svg>
export const IconChart = (p) => <Svg {...p}><path d="M4 20V4" /><path d="M4 20h16" /><rect x="7" y="11" width="3" height="6" rx="0.5" /><rect x="12" y="7" width="3" height="10" rx="0.5" /><rect x="17" y="13" width="3" height="4" rx="0.5" /></Svg>
export const IconTag = (p) => <Svg {...p}><path d="M20.5 12.5 12 21l-9-9V4h8z" /><circle cx="8" cy="8" r="1.4" /></Svg>
export const IconGear = (p) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2" /></Svg>
export const IconUsers = (p) => <Svg {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.5a3.2 3.2 0 0 1 0 6M17 20a5.5 5.5 0 0 0-2.5-4.6" /></Svg>
export const IconMail = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></Svg>
export const IconExport = (p) => <Svg {...p}><path d="M12 3v12" /><path d="m8 7 4-4 4 4" /><path d="M5 14v5h14v-5" /></Svg>
export const IconCheck = (p) => <Svg {...p}><path d="m5 12 4.5 4.5L19 7" /></Svg>
export const IconVerified = ({ size = 16, ...p }) => <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...p}><path d="m12 2 2.4 1.8 3-.2.9 2.9 2.5 1.6-1 2.9 1 2.9-2.5 1.6-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9L3.2 16l1-2.9-1-2.9 2.5-1.6.9-2.9 3 .2z" /><path d="m8.5 12 2.3 2.3L15.5 9.6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
export const IconPlus = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>
export const IconChevron = (p) => <Svg {...p}><path d="m9 6 6 6-6 6" /></Svg>
export const IconSpark = (p) => <Svg {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></Svg>
export const IconTrash = (p) => <Svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></Svg>
export const IconInstagram = (p) => <Svg {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17" cy="7" r="0.6" fill="currentColor" /></Svg>
export const IconYouTube = (p) => <Svg {...p}><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></Svg>
export const IconGlobe = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></Svg>
export const IconNews = (p) => <Svg {...p}><rect x="3" y="5" width="14" height="14" rx="2" /><path d="M17 8h3v9a2 2 0 0 1-2 2M7 9h6M7 12h6M7 15h4" /></Svg>

export const IconSun = (p) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></Svg>
export const IconMoon = (p) => <Svg {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" /></Svg>

export const platformIcon = (platform) => {
  switch (platform) {
    case "Instagram": return IconInstagram
    case "YouTube": return IconYouTube
    case "Blog": return IconGlobe
    case "News/Press": return IconNews
    default: return IconGlobe
  }
}
