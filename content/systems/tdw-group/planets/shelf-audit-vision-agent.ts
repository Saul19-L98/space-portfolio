import type { Planet } from "@/content/schema";

export const shelfAuditVisionAgent: Planet = {
  slug: "shelf-audit-vision-agent",
  name: "Retail Shelf-Audit Vision Agent",
  codename: "TDW-03",
  start: "2025-08-14",
  end: "2025-08-25",
  status: "prototype",
  domain: "genai",
  size: "small",
  summary:
    "A mobile-first Next.js PWA for field reps auditing retail shelves: photos go to an Amazon Bedrock agent that scores product position, promotions and stock, and GPS confirms the rep was actually in the store.",
  problem: "Shelf audits were subjective clipboard exercises. The demo asked whether a vision agent could score them consistently.",
  role: "Lead developer on the first GenAI and first front-end project of the tenure: a nine-step audit flow, Bedrock Agent Runtime integration, and ESLint, Prettier and Husky quality gates.",
  outcome: [
    "~5,700 lines of TypeScript in 46 files plus 1,217 lines of docs, in eleven days.",
    "Mock data only — a prototype, not a production rollout.",
  ],
  metrics: [
    { label: "Days", value: "11" },
    { label: "Lines of TypeScript", value: "~5,700" },
    { label: "Commits", value: "26" },
  ],
  tech: ["TypeScript", "Next.js 15", "React 19", "Amazon Bedrock Agent Runtime", "Zustand", "Tailwind CSS", "shadcn/ui", "Recharts", "PWA"],
  timeline: [
    { date: "2025-08-14", title: "Mission start", detail: "First GenAI project and first front-end project." },
    { date: "2025-08-20", title: "Nine-step audit flow", detail: "Photo capture, GPS check, Bedrock scoring, review." },
    { date: "2025-08-25", title: "Demo delivered" },
  ],
  sources: ["vault:#3", "github profile README"],
};
