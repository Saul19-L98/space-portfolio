import type { Planet } from "@/content/schema";

export const textToDaxAgent: Planet = {
  slug: "text-to-dax-agent",
  name: "Text-to-DAX Power BI Agent",
  codename: "TDW-06",
  start: "2025-09-17",
  end: "2025-09-18",
  status: "done",
  domain: "genai",
  size: "small",
  clientLabel: "a Central American manufacturer",
  summary:
    "A Bedrock agent tool that queries Power BI datasets with DAX: the Lambda signs in to Microsoft Entra ID with OAuth2 client credentials, caches tokens in PostgreSQL and hands results back to the agent.",
  problem: "The client's truth lived in Power BI semantic models, not a database. The agent needed cross-cloud access without leaking credentials or hammering the token endpoint.",
  role: "Sole author (6 of 6 commits). First infrastructure-as-code (a 228-line SAM template), first pytest unit and integration suite, first structured observability with Lambda Powertools — raised unprompted, two weeks after shipping a comparable Lambda without them.",
  outcome: [
    "~2,900 lines of Python in 21 files and 778 lines of docs.",
    "The step change: tests, IaC and observability became the baseline for everything after.",
  ],
  metrics: [
    { label: "SAM template", value: "228 lines" },
    { label: "Lines of Python", value: "~2,900" },
    { label: "Commits", value: "6 / 6" },
  ],
  tech: ["Python", "AWS Lambda", "AWS SAM", "Amazon Bedrock Agents", "Power BI REST API", "Microsoft Entra ID", "Lambda Powertools", "pytest", "PostgreSQL"],
  timeline: [
    { date: "2025-09-17", title: "Mission start", detail: "Entra ID client-credentials flow with token caching." },
    { date: "2025-09-18", title: "SAM, Powertools and tests", detail: "The first project with IaC, structured logging and a test suite." },
  ],
  sources: ["vault:#8", "cv.md:127-129"],
};
