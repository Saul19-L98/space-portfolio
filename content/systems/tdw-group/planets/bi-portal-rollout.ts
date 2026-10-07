import type { Planet } from "@/content/schema";

const DIAGRAM = (name: string, alt: string, caption: string, width: number, height: number) => ({
  src: `/missions/bi-portal-rollout/${name}.svg`,
  alt,
  caption,
  width,
  height,
});

export const biPortalRollout: Planet = {
  slug: "bi-portal-rollout",
  name: "Power BI Portal Rollout",
  codename: "TDW-19",
  start: "2026-06-17",
  end: "2026-09-02",
  status: "live",
  domain: "ops",
  size: "medium",
  clientLabel: "an electric utility, plus three sister deployments",
  summary:
    "Deployment, hardening and documentation of a Power BI report-portal product — portal, admin panel, Laravel API and an export service — for an electric utility and three sister client branches. Deployed and secured, not built.",
  problem: "A colleague's product had to go live on AWS Amplify with federated Microsoft Entra ID sign-in, and it shipped with a self-signed-certificate failure and TLS verification switched off.",
  role:
    "Deployed both apps to Amplify, replaced the TLS-verification bypass with a same-origin proxy across 33 call sites the next day, wrote two unprompted security reports (159 and 252 lines) and took them to leadership, upgraded the stack (Next 16, Laravel 13, PHP 8.4, Better Auth), and produced a 41-page client documentation set plus a 13-item findings memo.",
  outcome: [
    "In use by 169 users, 63 of them signing in through Microsoft Entra ID.",
    "The diagrams below are from that documentation, re-rendered with the client's name removed.",
  ],
  metrics: [
    { label: "Users", value: "169" },
    { label: "Call sites fixed", value: "33" },
    { label: "Client documentation", value: "41 pages" },
  ],
  tech: ["AWS Amplify", "Next.js 16", "Laravel 13", "AWS App Runner", "Amazon Cognito", "Microsoft Entra ID", "Power BI Embedded", "API Gateway", "AWS Lambda", "Amazon RDS PostgreSQL", "Mermaid"],
  moons: [
    { slug: "proxy-fix", name: "Same-Origin Proxy Fix", summary: "A 77-line proxy route that fixed a self-signed-certificate failure at all 33 API call sites at once, replacing a blunt TLS-verification bypass.", start: "2026-06-22", end: "2026-06-22" },
    { slug: "security-reports", name: "Security Reports", summary: "Two unprompted vulnerability reports — 159 and 252 lines — naming disabled TLS verification, an exposed personal access token and secrets at rest, each with prioritized remediation, taken to company leadership.", start: "2026-06-17", end: "2026-06-22" },
    { slug: "stack-upgrade", name: "Stack Upgrade", summary: "Next 16, React 19, Laravel 13, PHP 8.4 and a move from NextAuth to Better Auth across the three product repositories.", start: "2026-08-24", end: "2026-08-24" },
    { slug: "client-docs", name: "Client Documentation", summary: "A 41-page Spanish documentation set with five rendered diagrams plus a 13-item findings memo.", start: "2026-09-02", end: "2026-09-02" },
  ],
  timeline: [
    { date: "2026-06-17", title: "Amplify deployments", detail: "Portal and admin panel live; security report written." },
    { date: "2026-06-22", title: "Same-origin proxy across 33 call sites", detail: "TLS verification turned back on." },
    { date: "2026-08-24", title: "Stack upgrade", detail: "Next 16, Laravel 13, PHP 8.4, Better Auth." },
    {
      date: "2026-09-02",
      title: "Access model documented",
      detail: "Audiences drive the menu, roles drive the data filters, a Cognito group gates the admin panel.",
      image: DIAGRAM("access-model", "Flowchart of the portal access model: a user belongs to audiences that enable menu routes linking to Power BI reports, holds one role that groups data filters applied to the Power BI model, and reaches the admin panel only through an administrators group", "Access model: audiences, routes, roles and filters.", 1429, 522),
    },
    {
      date: "2026-09-02",
      title: "Components documented",
      detail: "Portal and admin panel on Amplify, Laravel engine on App Runner, RDS, Cognito, an export service and Power BI.",
      image: DIAGRAM("components", "Component diagram: employees and administrators reach the portal and admin panel on AWS Amplify; a Laravel engine on App Runner uses PostgreSQL on RDS and Amazon Cognito, which federates Microsoft Entra ID; the portal embeds Power BI reports and calls an export service on API Gateway and Lambda writing to S3", "System components across AWS and Microsoft.", 616, 1164),
    },
    {
      date: "2026-09-02",
      title: "Sign-in flow documented",
      detail: "Cognito federates Entra ID; the engine renews Power BI embed tokens on demand.",
      image: DIAGRAM("sign-in", "Sequence diagram of sign-in: the user clicks sign in, the portal redirects to Cognito, Cognito authenticates with Microsoft Entra ID, a temporary token returns to the portal, the engine verifies it and returns the menu, then requests a Power BI embed token and returns the report address with role filters", "Sign-in and report-embedding sequence.", 1775, 893),
    },
    {
      date: "2026-09-02",
      title: "Export pipeline documented",
      detail: "API Gateway, a FastAPI Lambda, an SQS job queue, a worker Lambda querying Athena, DynamoDB job state and 90-day download links.",
      image: DIAGRAM("export", "Flowchart of the export pipeline: a user requests an export through API Gateway to a FastAPI Lambda that enqueues a job in SQS and records it in DynamoDB; a worker Lambda queries Athena over S3 data loaded from the ERP three times a day, stores the file for 90 days and updates the job state; failed jobs go to a dead-letter queue and the user polls the state every five seconds", "Asynchronous export pipeline.", 2414, 378),
    },
  ],
  sources: ["vault:#41", "vault:#24", "vault:#25", "cv.md:153-157", "session notes"],
};
