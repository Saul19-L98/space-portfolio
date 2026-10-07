import type { Planet } from "@/content/schema";

export const whatsappSalesAgentVision: Planet = {
  slug: "whatsapp-sales-agent-vision",
  name: "Vision Tools for a WhatsApp Sales Agent",
  codename: "TDW-14",
  start: "2026-05-11",
  end: "2026-06-03",
  status: "live",
  domain: "genai",
  size: "medium",
  clientLabel: "a food-distribution client",
  summary:
    "Vision tools inside a live WhatsApp sales agent: a product-photo tool that looks items up in a Bedrock knowledge base, and a reader that extracts the nine-digit national ID number from a photo of an ID card.",
  problem: "Customers send photos, not product codes, and onboarding needed an ID number typed from a picture.",
  role: "Built the two tools and a prompt fix against invented price quotes (27 of 1,188 commits, two PRs) on Bedrock AgentCore with a Strands agent. The surrounding sales-assistant platform is the team's.",
  outcome: ["Two PRs merged into a production agent — the first PRs on a colleague's repository."],
  metrics: [
    { label: "PRs merged", value: "2" },
    { label: "Commits", value: "27" },
  ],
  tech: ["Python", "Amazon Bedrock AgentCore", "Strands Agents", "Bedrock Knowledge Bases", "Amazon Connect", "Amazon Lex", "Amazon ECS"],
  moons: [
    { slug: "agent-metrics-endpoint", name: "Agent-Metrics E-mail Endpoint", summary: "A daily agent-metrics e-mail endpoint on a Flask API (EventBridge Scheduler → Amazon Connect → SES) plus a 241-line architecture document.", start: "2026-05-11", end: "2026-05-12", tech: ["Flask", "AWS App Runner", "EventBridge Scheduler", "Amazon SES"] },
  ],
  timeline: [
    { date: "2026-05-11", title: "Product-photo tool", detail: "Knowledge-base lookup from an image." },
    { date: "2026-06-02", title: "National-ID reader", detail: "Nine digits from a photo of an ID card." },
    { date: "2026-06-03", title: "Cart units and anti-hallucination prompt fix" },
  ],
  sources: ["vault:#34", "vault:#35", "article-digest.md:30"],
};
