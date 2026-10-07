import type { Planet } from "@/content/schema";

export const tradeDataPipelines: Planet = {
  slug: "trade-data-pipelines",
  name: "Trade-Data Intelligence Pipelines",
  codename: "TDW-02",
  start: "2025-08-01",
  status: "live",
  domain: "data",
  size: "large",
  flagship: true,
  clientLabel: "an agricultural-tools manufacturer",
  summary:
    "A family of Playwright pipelines that log into a subscription trade-data platform, search tariff codes across ten Latin American markets, download the Excel exports and load them into PostgreSQL with deduplication solved at the schema level.",
  problem:
    "Competitive intelligence — who imports which products into which markets, and at what price — was a manual download-and-paste chore across many countries and two export formats, each country with its own schema of 7 to 58 columns.",
  role:
    "Sole author of every line (all commits). Invented the elements/actions scraper pattern reused for a year, cookie-first login with form fallback, multi-part downloads and ZIP extraction, per-country schema mapping, Docker → ECR delivery and semantic versioning. Supported the production imports line for twelve months, including a four-defect post-mortem with a dry-run SQL clean-up.",
  outcome: [
    "Five repositories, four production lines; the surviving imports line alone is 13,155 lines of Python in 50 files.",
    "Deduplication through unique constraints and upserts rather than application code; database-driven date selection so runs only fetch what is missing.",
    "October 2025 was the busiest month of the tenure: 135 commits across two of the lines.",
  ],
  metrics: [
    { label: "In production", value: "12 months" },
    { label: "Commits", value: "297" },
    { label: "Markets", value: "10" },
  ],
  tech: ["Python", "Playwright", "PostgreSQL", "pandas", "SQLAlchemy", "openpyxl", "Docker", "Amazon ECR"],
  moons: [
    { slug: "six-country-scraper", name: "Six-Country Scraper v1", summary: "The original: six tariff codes across six Central American countries, Excel downloads, six country schemas (7 to 58 columns). ~4,800 lines in 14 modules.", start: "2025-08-01", end: "2025-09-08", tech: ["Playwright", "openpyxl"] },
    { slug: "exports-line", name: "Exports Line", summary: "Export data for four more markets: JWT login with form fallback, multi-part downloads, ZIP extraction, duplicate prevention (v2.0.0), Docker and ECR. ~9,350 lines, 90 commits.", start: "2025-09-24", end: "2026-03-11", tech: ["Docker", "Amazon ECR"] },
    { slug: "imports-v3", name: "Imports Pipeline v3", summary: "The imports pipeline that reached v3.1.1 and was deployed to ECR; 13,793 lines of Python and 18,991 lines of docs. 107 commits, the highest count of any repository.", start: "2025-09-24", end: "2025-11-21" },
    { slug: "production-imports", name: "Production Imports Line", summary: "The line that survived: database-level duplicate prevention, a full-rebuild path, and a 2026-09 post-mortem fixing four defects with a dry-run SQL clean-up.", start: "2025-09-24" },
  ],
  timeline: [
    { date: "2025-08-01", title: "Mission start", detail: "Skeleton and module split for the six-country scraper." },
    { date: "2025-08-12", title: "Six-country orchestrator", detail: "One run, six markets, six schemas." },
    { date: "2025-09-24", title: "The pipeline family begins", detail: "Four repositories start from one codebase." },
    { date: "2025-10", title: "135 commits in a month", detail: "The most productive month of the tenure." },
    { date: "2025-11-21", title: "v3.1.1 deployed to ECR" },
    { date: "2026-03-11", title: "Exports line v2.3.0" },
    { date: "2026-05-22", title: "Production workflow approved" },
    { date: "2026-09-14", title: "Four-defect post-mortem", detail: "Cross-market rows, tariff multi-select, partial exports counted as success, token format — with a dry-run SQL clean-up." },
  ],
  sources: ["vault:#1", "vault:#9", "vault:#11", "vault:#19", "cv.md:106-109"],
};
