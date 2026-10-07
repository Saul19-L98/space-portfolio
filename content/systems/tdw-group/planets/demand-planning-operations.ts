import type { Planet } from "@/content/schema";

export const demandPlanningOperations: Planet = {
  slug: "demand-planning-operations",
  name: "Demand-Planning Platform Operations",
  codename: "TDW-22",
  start: "2026-08-31",
  status: "ongoing",
  domain: "ops",
  size: "medium",
  clientLabel: "five manufacturing and retail clients",
  summary:
    "Operating a demand-planning platform — Next.js front end, five Lambda services, an ECS worker, Athena tables and Aurora — across five client deployments: deploy, diagnose, fix, scale and validate. Never built.",
  problem: "Container images would not run on Lambda, registry rate limits broke builds, login cookies failed on the wrong host, a single worker took about 20 hours per model tournament, and each deployment surfaced defects nobody had catalogued.",
  role:
    "Pinned the Lambda Web Adapter to x86_64, moved base images to ECR Public, added a 308 redirect to the canonical host with tests; autoscaled the ECS worker from 1 to 20 tasks on queue backlog so a 1,265-series run finished in about an hour; wrote a ~138-probe read-only validation harness and a 53-defect catalogue; sixteen PRs in one week.",
  outcome: [
    "127 probes passed, 0 failed on a client validation.",
    "Five client deployments — one in a brand-new AWS account — validated with the same harness.",
  ],
  metrics: [
    { label: "Worker scale", value: "1 → 20 tasks" },
    { label: "Series per run", value: "1,265 in ~1 h" },
    { label: "Validation probes", value: "~138" },
    { label: "Defect catalogue", value: "53" },
  ],
  tech: ["AWS Lambda (Web Adapter)", "Amazon ECS", "Amazon SQS", "Amazon Athena", "Aurora PostgreSQL", "AWS Amplify", "Amazon Cognito", "AWS CodePipeline", "Next.js", "Python", "Bash"],
  moons: [
    { slug: "lambda-fixes", name: "Lambda Runtime Fixes", summary: "Lambda Web Adapter pinned to x86_64 so five service images run on Lambda; base images moved to ECR Public after registry rate limits; a 308 redirect to the canonical host so login cookies work, with seven tests.", start: "2026-08-31", end: "2026-09-02" },
    { slug: "worker-autoscaling", name: "Worker Autoscaling", summary: "The model-tournament worker autoscaled 1 to 20 Fargate tasks on SQS backlog, with a claim/lease loop; a 1,265-series run dropped from ~20 hours to about one.", start: "2026-09-11", end: "2026-09-11", tech: ["Amazon ECS", "Amazon SQS"] },
    { slug: "validation-harness", name: "Validation Harness", summary: "~138 read-only probes over infrastructure and feature surface, a 53-defect catalogue with expected warnings, and a WebSocket smoke test for the agent.", start: "2026-09-07", tech: ["Bash", "AWS CLI"] },
  ],
  timeline: [
    { date: "2026-08-31", title: "Lambda runtime fixes", detail: "Web Adapter, ECR Public base images, canonical-host redirect." },
    { date: "2026-09-07", title: "Sixteen PRs in a week begin", detail: "Extraction, permissions, pip constraints, connection-string encoding, a parallel-safe worker." },
    { date: "2026-09-11", title: "Worker autoscaled 1 → 20; client validated 127 / 0" },
    { date: "2026-09-24", title: "Two more client deployments validated", detail: "129 and 134 probes passing." },
  ],
  sources: ["vault:#40", "vault:#38", "article-digest.md:33", "session notes"],
};
