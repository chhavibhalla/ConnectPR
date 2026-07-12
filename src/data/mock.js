// Mock data for connectPR — no API wiring, everything runs off these arrays.

export const NICHES = [
  "Fashion", "Beauty", "Food", "Tech", "Fitness", "Travel",
  "Finance", "Parenting", "Gaming", "Lifestyle", "Startup/Business", "Sustainability",
]

export const CITIES = [
  "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Pune",
  "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh",
]

export const PLATFORMS = ["Instagram", "YouTube", "Blog", "News/Press"]

// avatar helper — deterministic, no external calls needed at import time
const av = (seed) => `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ede9fe,ddd6fe,c4b5fd`

export const CONTACTS = [
  {
    id: "c1", name: "Ananya Sharma", handle: "@ananya.styles", avatar: av("Ananya Sharma"),
    type: "Influencer", platform: "Instagram", city: "Mumbai",
    niches: ["Fashion", "Lifestyle"], followers: 248000, engagement: 4.8,
    verified: true, email: "ananya@stylescollab.in", price: "₹35k–₹60k / post",
    bio: "Mumbai-based fashion & slow-living creator. I work with homegrown D2C brands that care about craft. Reply rate is high if your pitch is specific 🙂",
    collabs: ["Nykaa Fashion", "Bewakoof", "The Souled Store"],
    languages: ["English", "Hindi"],
  },
  {
    id: "c2", name: "Rohan Verma", handle: "@rohan.techtalk", avatar: av("Rohan Verma"),
    type: "Influencer", platform: "YouTube", city: "Bengaluru",
    niches: ["Tech", "Startup/Business"], followers: 512000, engagement: 6.1,
    verified: true, email: "team@rohanverma.co", price: "₹1.2L–₹2L / video",
    bio: "Explaining consumer tech & Indian startups in plain Hindi-English. 500K subs, mostly tier-1 & tier-2 India.",
    collabs: ["boAt", "Cred", "Zerodha Varsity"],
    languages: ["Hindi", "English"],
  },
  {
    id: "c3", name: "Priya Nair", handle: "@priyaeats", avatar: av("Priya Nair"),
    type: "Influencer", platform: "Instagram", city: "Bengaluru",
    niches: ["Food", "Travel"], followers: 96000, engagement: 7.4,
    verified: false, email: "hello@priyaeats.com", price: "₹18k–₹30k / post",
    bio: "Bengaluru food & cafe hopping. High engagement micro-audience that actually shows up to launches.",
    collabs: ["Swiggy", "Third Wave Coffee"],
    languages: ["English"],
  },
  {
    id: "c4", name: "Kabir Singh", handle: "@fitwithkabir", avatar: av("Kabir Singh"),
    type: "Influencer", platform: "Instagram", city: "Delhi",
    niches: ["Fitness", "Lifestyle"], followers: 154000, engagement: 5.3,
    verified: true, email: "collab@fitwithkabir.in", price: "₹25k–₹45k / post",
    bio: "Fat-loss & habit coaching for busy folks. Supplements, wearables, activewear brands welcome.",
    collabs: ["HealthKart", "Fastrack"],
    languages: ["Hindi", "English"],
  },
  {
    id: "c5", name: "Meera Iyer", handle: "@meerawrites", avatar: av("Meera Iyer"),
    type: "Journalist", platform: "News/Press", city: "Mumbai",
    niches: ["Startup/Business", "Tech"], followers: 0, engagement: 0,
    verified: true, email: "meera.iyer@yourstory.example", price: "Editorial — no fee",
    bio: "Senior correspondent covering D2C, funding rounds and founder stories. Pitch me a story angle, not a product ad.",
    collabs: ["YourStory", "Inc42 (guest)"],
    languages: ["English"], outlet: "YourStory",
  },
  {
    id: "c6", name: "Aditya Rao", handle: "@aditya.finance", avatar: av("Aditya Rao"),
    type: "Influencer", platform: "YouTube", city: "Hyderabad",
    niches: ["Finance", "Startup/Business"], followers: 388000, engagement: 5.9,
    verified: true, email: "biz@adityarao.money", price: "₹80k–₹1.5L / video",
    bio: "Personal finance & investing for young India. Fintech, insurance and SaaS founders — let's talk.",
    collabs: ["Groww", "INDmoney", "Ditto Insurance"],
    languages: ["Hindi", "English"],
  },
  {
    id: "c7", name: "Sneha Kapoor", handle: "@snehaglow", avatar: av("Sneha Kapoor"),
    type: "Influencer", platform: "Instagram", city: "Delhi",
    niches: ["Beauty", "Lifestyle"], followers: 210000, engagement: 6.7,
    verified: true, email: "pr@snehaglow.in", price: "₹30k–₹55k / post",
    bio: "Clean beauty & skincare reviews. Honest 'would I repurchase' verdicts. Big on ingredient transparency.",
    collabs: ["Minimalist", "Plum", "mCaffeIne"],
    languages: ["English", "Hindi"],
  },
  {
    id: "c8", name: "Vikram Desai", handle: "@vikram.travels", avatar: av("Vikram Desai"),
    type: "Influencer", platform: "Blog", city: "Pune",
    niches: ["Travel", "Sustainability"], followers: 64000, engagement: 3.9,
    verified: false, email: "vikram@offbeatindia.blog", price: "₹12k–₹22k / feature",
    bio: "Long-form travel blog + newsletter (30k subs). Great for tourism boards, gear and eco brands.",
    collabs: ["Decathlon", "MakeMyTrip (blog)"],
    languages: ["English"],
  },
  {
    id: "c9", name: "Fatima Khan", handle: "@fatima.parenting", avatar: av("Fatima Khan"),
    type: "Influencer", platform: "Instagram", city: "Hyderabad",
    niches: ["Parenting", "Lifestyle"], followers: 128000, engagement: 8.1,
    verified: true, email: "fatima@momsofhyd.in", price: "₹22k–₹38k / post",
    bio: "New-mom community & product reviews. Toys, baby care, and safe-for-kids D2C brands convert really well here.",
    collabs: ["FirstCry", "The Moms Co."],
    languages: ["Hindi", "English"],
  },
  {
    id: "c10", name: "Arjun Menon", handle: "@arjunplays", avatar: av("Arjun Menon"),
    type: "Influencer", platform: "YouTube", city: "Chennai",
    niches: ["Gaming", "Tech"], followers: 640000, engagement: 9.2,
    verified: true, email: "arjun@arjunplays.gg", price: "₹90k–₹1.8L / video",
    bio: "Mobile & PC gaming, streams 5 days a week. Audience skews 16–24, tier-1/2. Peripherals & energy brands love it.",
    collabs: ["boAt", "Red Bull India", "Logitech G"],
    languages: ["Tamil", "English", "Hindi"],
  },
  {
    id: "c11", name: "Ishita Gupta", handle: "@ishita.press", avatar: av("Ishita Gupta"),
    type: "Journalist", platform: "News/Press", city: "Delhi",
    niches: ["Lifestyle", "Fashion"], followers: 0, engagement: 0,
    verified: true, email: "ishita.g@thehindu.example", price: "Editorial — no fee",
    bio: "Features desk — culture, fashion and consumer trends. I read every pitch; keep it under 150 words.",
    collabs: ["The Hindu", "Vogue India (freelance)"],
    languages: ["English"], outlet: "The Hindu",
  },
  {
    id: "c12", name: "Nikhil Joshi", handle: "@nikhil.sustainable", avatar: av("Nikhil Joshi"),
    type: "Influencer", platform: "Instagram", city: "Ahmedabad",
    niches: ["Sustainability", "Lifestyle"], followers: 78000, engagement: 6.3,
    verified: false, email: "nikhil@greenswitch.in", price: "₹15k–₹28k / post",
    bio: "Zero-waste living & conscious consumption. Small but very loyal, mission-aligned audience.",
    collabs: ["Bare Necessities", "Beco"],
    languages: ["English", "Hindi"],
  },
]

export const SAVED_LISTS = [
  {
    id: "l1", name: "Diwali D2C Launch", color: "brand",
    note: "Fashion + beauty micro-influencers for the festive drop.",
    contactIds: ["c1", "c7", "c3"], updated: "2 days ago",
  },
  {
    id: "l2", name: "Fintech PR Push", color: "emerald",
    note: "Finance creators + business journalists for the seed round announcement.",
    contactIds: ["c6", "c5", "c2"], updated: "5 days ago",
  },
  {
    id: "l3", name: "Gen-Z Gaming Campaign", color: "amber",
    note: "High-energy gaming & tech for the peripherals line.",
    contactIds: ["c10", "c2"], updated: "1 week ago",
  },
]

export const COMPETITORS = [
  {
    id: "k1", brand: "GlowKart", handle: "@glowkart", avatar: av("GlowKart"),
    category: "Beauty D2C", trackedSince: "Jun 2026",
    metrics: { collabs30d: 14, prMentions30d: 6, avgEngagement: 5.4, share: 42 },
    timeline: [
      { date: "Jul 09", type: "collab", title: "Reel with @snehaglow", detail: "Clean-beauty serum launch, ~210K reach", tag: "Instagram" },
      { date: "Jul 05", type: "press", title: "Featured in YourStory", detail: "'How GlowKart hit ₹10Cr ARR' founder story", tag: "News/Press" },
      { date: "Jul 02", type: "collab", title: "3 micro-creators, Delhi", detail: "Festive gifting bundle seeding", tag: "Instagram" },
      { date: "Jun 28", type: "collab", title: "YouTube integration", detail: "Skincare routine w/ mid-tier beauty creator", tag: "YouTube" },
    ],
  },
  {
    id: "k2", brand: "FitFuel", handle: "@fitfuel.in", avatar: av("FitFuel"),
    category: "Health & Nutrition", trackedSince: "May 2026",
    metrics: { collabs30d: 9, prMentions30d: 3, avgEngagement: 4.1, share: 27 },
    timeline: [
      { date: "Jul 08", type: "collab", title: "Reel with @fitwithkabir", detail: "Whey protein re-launch", tag: "Instagram" },
      { date: "Jul 01", type: "press", title: "Economic Times mention", detail: "Roundup of India's protein startups", tag: "News/Press" },
      { date: "Jun 25", type: "collab", title: "Fitness challenge campaign", detail: "5 creators, 21-day challenge", tag: "Instagram" },
    ],
  },
]

export const YOUR_BRAND = {
  name: "connectPR (You)",
  metrics: { collabs30d: 5, prMentions30d: 2, avgEngagement: 6.2, share: 31 },
}

export const RECENT_SEARCHES = [
  { q: "Beauty micro-influencers", city: "Mumbai", platform: "Instagram" },
  { q: "Fintech YouTubers", city: "Bengaluru", platform: "YouTube" },
  { q: "Food journalists", city: "Delhi", platform: "News/Press" },
]

export const EXAMPLE_SEARCHES = [
  "Fashion creators in Mumbai on Instagram",
  "Finance YouTubers with 100K+",
  "Startup journalists in Delhi",
  "High-engagement food micro-influencers",
]

export function formatFollowers(n) {
  if (!n) return "—"
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, "") + "M"
  if (n >= 1000) return Math.round(n / 1000) + "K"
  return String(n)
}
