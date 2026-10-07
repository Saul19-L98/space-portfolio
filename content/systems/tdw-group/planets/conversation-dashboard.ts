import type { Planet } from "@/content/schema";

export const conversationDashboard: Planet = {
  slug: "conversation-dashboard",
  name: "Contact-Center Conversation Dashboard",
  codename: "TDW-13",
  start: "2026-02-18",
  end: "2026-08-11",
  status: "live",
  domain: "web",
  size: "medium",
  clientLabel: "a US retailer's contact center",
  summary:
    "A Next.js read-only viewer over Amazon Connect chat transcripts: Cognito login, phone-number search, per-customer history and live streaming.",
  problem: "Supervisors could not browse what the chatbot and agents had said to a customer, and attachments were too large for the hosting platform's response limit.",
  role:
    "Took over a colleague's dashboard (31 of 60 commits): added Cognito authentication and a security report, upgraded to Next 16, built the history features and phone search. The attachments change serves files through a 302 redirect to a 300-second presigned S3 link because the platform caps responses at 6 MB — after checking all 40,202 attachment rows and blocking his own merge on a missing permission.",
  outcome: ["Live; introduced the dated plan-driven workflow used on later projects."],
  metrics: [
    { label: "Commits", value: "31 / 60" },
    { label: "Attachment rows audited", value: "40,202" },
  ],
  tech: ["TypeScript", "Next.js 16", "Amazon Connect", "Amazon Cognito", "Amazon S3 (presigned URLs)", "Server-Sent Events", "AWS Amplify"],
  timeline: [
    { date: "2026-02-18", title: "Takeover and Cognito login", detail: "Security report written the same week." },
    { date: "2026-03-05", title: "History features and phone search" },
    { date: "2026-08-11", title: "Attachments via presigned redirect", detail: "The PR names its own blocker: a missing permission." },
  ],
  sources: ["vault:#17", "article-digest.md:32"],
};
