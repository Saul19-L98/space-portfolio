import type { Planet } from "@/content/schema";

export const textToSqlAgent: Planet = {
  slug: "text-to-sql-agent",
  name: "Text-to-SQL Agent Tooling",
  codename: "TDW-04",
  start: "2025-09-01",
  end: "2025-09-08",
  status: "done",
  domain: "genai",
  size: "small",
  clientLabel: "a Honduran flour miller",
  summary:
    "A Lambda action group between a Bedrock agent and PostgreSQL: it validates that the model's SQL is read-only, runs it as a read-only database user, and answers in all three response envelopes Bedrock and API Gateway expect.",
  problem: "Business users wanted to ask questions of sales data in plain Spanish without handing a language model the power to change anything.",
  role: "Sole author (15 of 15 commits). Also elicited the 312-line Spanish specification — epics, user stories, a six-level drill-down and the business units — from a single client conversation.",
  outcome: [
    "Let the model generate the query, constrain what the query can do: SELECT/WITH-only validation plus a read-only database role.",
    "Agents could be reconfigured without touching the Lambda, thanks to the envelope-agnostic contract.",
  ],
  metrics: [
    { label: "Lines of Python", value: "347" },
    { label: "Specification", value: "312 lines" },
    { label: "Commits", value: "15 / 15" },
  ],
  tech: ["Python", "AWS Lambda", "Amazon Bedrock Agents", "PostgreSQL", "psycopg2", "API Gateway"],
  moons: [
    { slug: "requirements-spec", name: "Requirements Specification", summary: "A 312-line Spanish specification with epics A–J, user stories, acceptance criteria and business rules, written from one client conversation. No code.", start: "2025-09-01", end: "2025-09-01" },
  ],
  timeline: [
    { date: "2025-09-01", title: "Specification elicited", detail: "312 lines from a single conversation." },
    { date: "2025-09-03", title: "First Lambda agent", detail: "Bedrock → PostgreSQL bridge with a read-only guardrail." },
    { date: "2025-09-08", title: "Three response envelopes handled" },
  ],
  sources: ["vault:#5", "vault:#4", "cv.md:124-127"],
};
