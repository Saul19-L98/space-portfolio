import type { Planet } from "@/content/schema";

export const catalogueCrawler: Planet = {
  slug: "catalogue-crawler",
  name: "E-commerce Catalogue Crawler",
  codename: "TDW-07",
  start: "2025-10-20",
  end: "2025-10-24",
  status: "done",
  domain: "data",
  size: "small",
  clientLabel: "a hardware retailer",
  summary:
    "An async Playwright crawler for a retailer's entire public catalogue: it reads structured JSON-LD first, falls back to the page HTML, extracts 13 fields per product and lands date-partitioned files in S3 catalogued by AWS Glue.",
  problem: "Price monitoring needed the whole catalogue, regularly, into the data lake — not into yet another database.",
  role: "Sole author. First use of uv, first data-lake destination, tests included.",
  outcome: [
    "993 lines of Python and 1,303 lines of docs.",
    "Downstream consumers query the lake, not the pipeline that produced it.",
  ],
  metrics: [
    { label: "Fields per product", value: "13" },
    { label: "Lines of Python", value: "993" },
  ],
  tech: ["Python", "Playwright (async)", "uv", "Amazon S3", "AWS Glue", "pytest"],
  timeline: [
    { date: "2025-10-20", title: "Mission start", detail: "JSON-LD first, HTML fallback." },
    { date: "2025-10-24", title: "Date-partitioned landing zone", detail: "S3 + Glue catalogue." },
  ],
  sources: ["vault:#12", "cv.md:110-113"],
};
