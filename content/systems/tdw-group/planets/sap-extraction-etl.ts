import type { Planet } from "@/content/schema";

export const sapExtractionEtl: Planet = {
  slug: "sap-extraction-etl",
  name: "SAP Fiori Extraction ETL",
  codename: "TDW-10",
  start: "2025-12-03",
  end: "2026-03-19",
  status: "done",
  domain: "data",
  size: "medium",
  clientLabel: "an industrial manufacturer's SAP ERP",
  summary:
    "Browser automation that pulls two SAP Fiori reports — material consumption and stock — into PostgreSQL on a schedule, feeding a downstream budget and planning product.",
  problem: "No API access to the ERP. Two menu items shared the same label, the current month must refresh while closed months stay untouched, and the Fiori UI times out unpredictably.",
  role: "Sole author (33 of 33 commits). Told the identical SAP menu entries apart through the ARIA tree, implemented open-period overwrite semantics, Docker → ECR delivery, pytest, and an iframe-timeout fix in production.",
  outcome: [
    "1,878 lines of Python and 13 docs; both branches merged.",
    "The ERP extraction the budget-management product runs on.",
  ],
  metrics: [
    { label: "Reports extracted", value: "2" },
    { label: "Commits", value: "33 / 33" },
  ],
  tech: ["Python", "Playwright", "SAP Fiori", "PostgreSQL", "Docker", "Amazon ECR", "pytest"],
  timeline: [
    { date: "2025-12-03", title: "Mission start", detail: "First internal ERP target." },
    { date: "2026-01", title: "Open-period overwrite semantics", detail: "Current month refreshed, closed months untouched." },
    { date: "2026-03-19", title: "Iframe-timeout fix in production" },
  ],
  sources: ["vault:#15", "cv.md:110-113"],
};
