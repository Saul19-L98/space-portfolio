import type { Planet } from "@/content/schema";

export const insuranceApi: Planet = {
  slug: "insurance-api",
  name: "Insurance Policy CRUD Service",
  codename: "TDW-08",
  start: "2025-11-04",
  end: "2025-11-05",
  status: "prototype",
  domain: "web",
  size: "small",
  clientLabel: "an insurer",
  summary:
    "A Lambda CRUD API over policyholders and their dependents, shaped to a TanStack Table front-end contract with offset and cursor pagination: API Gateway → Lambda → RDS Proxy → PostgreSQL.",
  problem: "A front-end team needed a clean, documented backend contract — fast.",
  role: "Sole author: seven endpoints, Pydantic models, Lambda Powertools, a 454-line OpenAPI description and pytest.",
  outcome: [
    "2,110 lines of Python and 3,650 lines of docs.",
    "The cleanest architecture in the account, per the retrospective; not deployed to production.",
  ],
  metrics: [
    { label: "Endpoints", value: "7" },
    { label: "OpenAPI", value: "454 lines" },
  ],
  tech: ["Python", "AWS Lambda", "API Gateway", "RDS Proxy", "PostgreSQL", "Pydantic", "Lambda Powertools", "OpenAPI", "pytest"],
  timeline: [
    { date: "2025-11-04", title: "Mission start", detail: "Seven endpoints shaped to the table contract." },
    { date: "2025-11-05", title: "OpenAPI description and tests" },
  ],
  sources: ["vault:#14"],
};
