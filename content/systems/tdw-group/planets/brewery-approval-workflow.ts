import type { Planet } from "@/content/schema";

export const breweryApprovalWorkflow: Planet = {
  slug: "brewery-approval-workflow",
  name: "Two-Step Approval Workflow",
  codename: "TDW-12",
  start: "2025-12-16",
  end: "2026-01-12",
  status: "live",
  domain: "web",
  size: "small",
  clientLabel: "a Salvadoran brewery",
  summary:
    "A two-step HR approval workflow inside a brewery's admin system — status tables, approval rules, approve/decline with a mandatory reason, e-mail hand-offs via SES — plus a payment-request form that computes the local taxes.",
  problem: "Requests moved by chat and spreadsheet; approvals had no rules, no audit trail and no notifications.",
  role: "Wrote the workflow specification and built the feature on a colleague's app: 31 commits across five branches, all merged, including a 478-line payment form with IVA, ISR and perception calculations.",
  outcome: ["Live in the client's admin system."],
  metrics: [
    { label: "Commits", value: "31" },
    { label: "Payment form", value: "478 lines" },
  ],
  tech: ["TypeScript", "Next.js", "Amazon SES", "PostgreSQL"],
  timeline: [
    { date: "2025-12-16", title: "Workflow specification" },
    { date: "2026-01", title: "Approve / decline with mandatory reason", detail: "SES e-mail hand-offs between the two steps." },
    { date: "2026-01-12", title: "Payment-request form", detail: "IVA, ISR and perception taxes computed." },
  ],
  sources: ["vault:#32", "article-digest.md:32"],
};
