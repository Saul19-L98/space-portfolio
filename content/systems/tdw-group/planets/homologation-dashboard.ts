import type { Planet } from "@/content/schema";

export const homologationDashboard: Planet = {
  slug: "homologation-dashboard",
  name: "Catalogue Homologation Dashboard",
  codename: "TDW-09",
  start: "2025-11-28",
  end: "2025-12-10",
  status: "prototype",
  domain: "web",
  size: "small",
  summary:
    "A Next.js dashboard over Amazon Athena that matches product barcodes to commercial codes, with URL-synced table state and quality gates.",
  problem: "Two catalogues described the same products with different identifiers. Analysts needed one place to reconcile them against the lake.",
  role: "Scaffolded and built the dashboard on a colleague's repository (18 of 27 commits): Athena queries, Zustand plus URL table state, lint and format gates.",
  outcome: ["Lives on a development branch — a working prototype."],
  metrics: [{ label: "Commits", value: "18 / 27" }],
  tech: ["TypeScript", "Next.js 16", "Amazon Athena", "Zustand", "Tailwind CSS"],
  timeline: [
    { date: "2025-11-28", title: "Mission start" },
    { date: "2025-12-10", title: "Homologation table over Athena" },
  ],
  sources: ["vault:#31"],
};
