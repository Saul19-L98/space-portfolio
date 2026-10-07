import type { Planet } from "@/content/schema";

export const lakehousePlatform: Planet = {
  slug: "lakehouse-platform",
  name: "Multi-Client Lakehouse Platform",
  codename: "TDW-20",
  start: "2025-05-01",
  status: "ongoing",
  domain: "cloud",
  size: "large",
  flagship: true,
  clientLabel: "a multi-account estate of ten-plus clients",
  summary:
    "A Terraform module library for an AWS-native lakehouse, instantiated per client across a multi-account estate: S3 data lake, Glue Data Catalog, Athena workgroups and Federated Query to on-premises sources, Lake Formation permissions, Redshift Serverless, Amazon MWAA orchestration and dbt.",
  problem: "Ten-plus clients, each in its own AWS account, each needing the same analytics platform shape — without ten hand-built copies and without one apply ever touching the wrong account.",
  role:
    "Build and operate the module library and the multi-account governance stacks, scoping every apply to a named CLI profile per client account. Provision and harden the compute and data tiers underneath: EC2 modules (a dbt development server; a GPU module with IMDSv2 required, an explicitly encrypted root volume, a pinned AMI and nightly auto-stop), Aurora and RDS PostgreSQL, and Linux administration with one idempotent Bash provisioning script.",
  outcome: [
    "Redshift Serverless for 10 clients, Amazon MWAA for 6, dbt for 10, a shared lakehouse network layer for 11.",
    "A standalone client estate — 27 Terragrunt units covering shared services, a data lake and Lake Formation governance — cut over in one day, with 18 of 18 units planning clean.",
    "Found a privilege-escalation hole in a shared user-accounts module affecting all 11 clients using it, and reported it with a scoped remediation.",
    "87 deployed resources in a single client's governance stack; a 41-item risk register for the GPU box.",
  ],
  metrics: [
    { label: "Redshift Serverless", value: "10 clients" },
    { label: "MWAA", value: "6 clients" },
    { label: "Shared network layer", value: "11 clients" },
  ],
  tech: ["Terraform", "Terragrunt", "Amazon S3", "AWS Glue", "Amazon Athena", "Athena Federated Query", "AWS Lake Formation", "Amazon Redshift Serverless", "Amazon MWAA", "dbt", "Amazon EC2", "Aurora PostgreSQL", "Amazon RDS", "IAM", "AWS KMS", "AWS Secrets Manager", "Bash"],
  moons: [
    { slug: "estate-cutover", name: "One-Day Estate Cutover", summary: "A client's own Terragrunt estate — 27 units: VPC, VPN, NAT, KMS, Route 53, S3, Glue, Athena, SFTP, Lambda and Lake Formation — applied end to end in one day, every vendored module change listed.", start: "2026-08-13", end: "2026-08-13", tech: ["Terragrunt", "AWS Lake Formation"] },
    { slug: "governance-stacks", name: "Governance Stacks", summary: "Multi-account governance stacks across the client estate, scoped to a named CLI profile per account; 87 deployed resources in a single client's stack.", tech: ["Terraform", "IAM"] },
    { slug: "iam-finding", name: "IAM Privilege-Escalation Finding", summary: "MFA delete and deactivate granted on every resource in a shared user-accounts module let any created user disarm another's MFA — affecting all 11 clients using it. Verified with the policy simulator, reported with a scoped fix.", tech: ["IAM", "Policy Simulator"] },
    { slug: "compute-modules", name: "Hardened Compute Modules", summary: "A dbt development server and a GPU instance module (IMDSv2, encrypted root, pinned AMI, nightly auto-stop) plus one idempotent Bash provisioning script giving a client's data team shared access.", tech: ["Amazon EC2", "Bash"] },
  ],
  timeline: [
    { date: "2025-05", title: "Cloud Engineer role begins", detail: "The lakehouse module library is the standing responsibility; exact start of the library work is not recorded." },
    { date: "2025-10", title: "Data-lake landing zones", detail: "Pipelines start landing date-partitioned data for Glue." },
    { date: "2026-06", title: "Governance stacks and IAM finding", detail: "87 resources in one governance stack; privilege-escalation hole reported across 11 clients." },
    { date: "2026-08-13", title: "Standalone estate cut over in a day" },
    { date: "2026-09", title: "GPU module and provisioning script", detail: "41-item risk register." },
  ],
  sources: ["cv.md:101-105,141-143,162-173,181-184", "vault:#37", "article-digest.md:23-25,236"],
};
