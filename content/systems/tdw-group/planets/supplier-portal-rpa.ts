import type { Planet } from "@/content/schema";

export const supplierPortalRpa: Planet = {
  slug: "supplier-portal-rpa",
  name: "Bot-Defended Supplier Portal Extraction",
  codename: "TDW-01",
  start: "2025-07-22",
  end: "2025-10-10",
  status: "done",
  domain: "data",
  size: "medium",
  clientLabel: "a consumer-goods supplier to a major retailer",
  summary:
    "Browser automation that signs into a legacy supplier portal — nested frames, no API, aggressive bot detection and SMS two-factor login — and requests and downloads the sales reports a supplier needs every week.",
  problem:
    "The portal exposes no API and actively defends against automation. Reports were pulled by hand, and every login needs a one-time SMS code that lands on a phone, not a server.",
  role:
    "Sole engineer. Reverse-engineered the frame maze, built the anti-detection layer, relayed SMS codes through a PostgreSQL table the scraper polls, added Dev/Prod cookie gating, Docker packaging and deploy scripts.",
  outcome: [
    "~14,000 lines of Python across 20 modules; the navigation module alone is ~9,800 lines.",
    "49 commits and 13 documentation files (1,855 lines).",
    "When the target hardened again, the deliverable became a ranked analysis of three bypass strategies with a recommendation — the decision, not more code.",
  ],
  metrics: [
    { label: "Lines of Python", value: "~14,000" },
    { label: "Commits", value: "49" },
    { label: "Docs", value: "13 files" },
  ],
  tech: ["Python", "Playwright", "PostgreSQL", "Docker", "pandas", "SQLAlchemy"],
  moons: [
    {
      slug: "bypass-analysis",
      name: "Bypass Strategy Analysis",
      summary:
        "A one-day, 517-line retry that deep-links past the frame maze and documents three ranked strategies for the portal's press-and-hold bot check. Delivered as a recommendation instead of code.",
      start: "2025-10-10",
      end: "2025-10-10",
      tech: ["Playwright", "MCP"],
    },
  ],
  timeline: [
    { date: "2025-07-22", title: "Mission start", detail: "First login automation against the nested-frame portal." },
    { date: "2025-08", title: "Anti-detection layer and SMS relay", detail: "One-time codes land in a PostgreSQL table the scraper polls; Dev/Prod cookie gating." },
    { date: "2025-09-02", title: "Docker packaging and deploy scripts", detail: "Three deploy scripts; 13 documentation files." },
    { date: "2025-10-10", title: "Ranked bypass analysis delivered", detail: "Three strategies for the press-and-hold check, with a recommendation." },
  ],
  sources: ["vault:#2", "cv.md:136-140"],
};
