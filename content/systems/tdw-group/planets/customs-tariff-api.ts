import type { Planet } from "@/content/schema";

export const customsTariffApi: Planet = {
  slug: "customs-tariff-api",
  name: "Customs Tariff API Walker",
  codename: "TDW-15",
  start: "2026-06-03",
  end: "2026-06-08",
  status: "done",
  domain: "data",
  size: "small",
  summary:
    "Found the public REST API behind a government customs site and walked the full tariff hierarchy through it — chapter, heading, subheading, item, detail — upserting into PostgreSQL, tested offline against captured responses.",
  problem: "After a year of DOM automation, the question was finally asked first: is there an API?",
  role: "Sole author. Also wrote an eleven-document Playwright skill for coding agents.",
  outcome: [
    "Built against the API in 517 lines instead of 14,000.",
    "1,078 lines of Python and 2,474 lines of docs.",
  ],
  metrics: [
    { label: "Lines", value: "517 vs 14,000" },
    { label: "Hierarchy levels", value: "5" },
  ],
  tech: ["Python", "REST", "PostgreSQL", "pytest"],
  timeline: [
    { date: "2026-06-03", title: "API discovered behind the Angular site" },
    { date: "2026-06-08", title: "Full hierarchy walk with offline tests" },
  ],
  sources: ["vault:#21", "cv.md:136-140"],
};
