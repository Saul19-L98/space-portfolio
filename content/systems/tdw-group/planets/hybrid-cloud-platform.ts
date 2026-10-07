import type { Planet } from "@/content/schema";

export const hybridCloudPlatform: Planet = {
  slug: "hybrid-cloud-platform",
  name: "Hybrid Cloud Platform with Site-to-Site VPN",
  codename: "TDW-17",
  start: "2026-06-23",
  end: "2026-07-27",
  status: "live",
  domain: "cloud",
  size: "large",
  flagship: true,
  clientLabel: "a regional food manufacturer",
  summary:
    "A Terraform/Terragrunt client platform: a VPC with a site-to-site VPN to the client's on-premises network (customer gateway, BGP ASN, tunnel addressing), API Gateway, .NET 10 Lambdas, Aurora PostgreSQL Serverless v2, Cognito, Amplify, and a four-stage CodePipeline — build, test, SonarQube, deploy — as the quality gate every change must pass.",
  problem: "An approval application had to reach on-premises systems securely and ship through a pipeline that enforces static analysis, on a landing zone a second developer could build on immediately.",
  role: "Owned the infrastructure, IaC and delivery pipeline; the application code is a colleague's. Generalized the platform into a reusable engagement template.",
  outcome: [
    "Aurora PostgreSQL 16.6 Serverless v2 scaling 0.5–2 ACU behind a dedicated security group and a two-AZ subnet group, credentials in Secrets Manager.",
    "Three commits of .NET scaffold and CI enabled three weeks of a colleague's work on a credit workflow.",
    "The template scaffolded an entire four-repository client engagement in one day: 84 Terraform/Terragrunt files, a .NET 10 Lambda backend, web and admin shells.",
  ],
  metrics: [
    { label: "Pipeline stages", value: "4" },
    { label: "Aurora capacity", value: "0.5 – 2 ACU" },
    { label: "Engagement scaffold", value: "1 day" },
  ],
  tech: ["Terraform", "Terragrunt", "Amazon VPC", "AWS Site-to-Site VPN", "API Gateway", "AWS Lambda (.NET 10)", "Aurora PostgreSQL Serverless v2", "Amazon Cognito", "AWS Amplify", "AWS CodePipeline", "SonarQube", "AWS Secrets Manager"],
  moons: [
    { slug: "credit-workflow-scaffold", name: "Credit Workflow Scaffold", summary: "The .NET 10 scaffold, four build specs and Amplify mock-up for a two-stage credit workflow, plus a fix to a YAML parse error in the SonarQube build spec. Three commits that enabled three weeks of a colleague's work.", start: "2026-07-04", end: "2026-07-04", tech: [".NET 10", "AWS CodeBuild", "SonarQube"] },
    { slug: "four-repo-engagement", name: "Four-Repo Engagement in a Day", summary: "Infrastructure (84 Terraform/Terragrunt files), a .NET 10 Lambda backend with four build specs, and web and admin shells for a new client — scaffolded in one day from the template.", start: "2026-07-05", end: "2026-07-06", tech: ["Terraform", "Terragrunt", ".NET 10"] },
  ],
  timeline: [
    { date: "2026-06-23", title: "Mission start", detail: "VPC, site-to-site VPN, Aurora Serverless v2." },
    { date: "2026-07-01", title: "Four-stage CodePipeline with SonarQube", detail: "Build, test, static analysis, deploy." },
    { date: "2026-07-04", title: "Credit workflow scaffold", detail: "Three commits, three weeks of a colleague's work." },
    { date: "2026-07-06", title: "Four-repository engagement scaffolded in a day" },
    { date: "2026-07-27", title: "Platform handed over", detail: "Network and data layers stayed when compute moved to App Runner." },
  ],
  sources: ["vault:#26", "vault:#27", "vault:#28", "cv.md:114-119,170-173"],
};
