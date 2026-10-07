import type { Planet } from "@/content/schema";

export const eventDrivenPlatform: Planet = {
  slug: "event-driven-platform",
  name: "Event-Driven Serverless Platform",
  codename: "TDW-16",
  start: "2026-06-12",
  end: "2026-06-23",
  status: "done",
  domain: "cloud",
  size: "large",
  flagship: true,
  summary:
    "An event-driven serverless e-commerce platform ported to Terraform from an AWS reference architecture and extended: ten services on one EventBridge bus, each allowed to publish only its own events, with AppSync GraphQL in front, Cognito, API Gateway, DynamoDB streams, dashboards, alarms, dead-letter queues, X-Ray and WAF.",
  problem: "Prove that a complete, observable, multi-service platform can be stood up as code — fast — with observability designed in rather than bolted on.",
  role:
    "Sole author: 362 AWS resources across 10 services in 11 days, 39 of 39 commits across 28 repositories; ~3,000 lines of TypeScript Lambda handlers, 4,328 lines of Terraform, 16 AppSync resolvers; and a Spanish architecture document generated from the deployed code and delivered to the client.",
  outcome: [
    "CloudWatch dashboards per service, 8 alarms plus an anomaly-detection alarm, DLQs on every async consumer, X-Ray tracing.",
    "26 Lambda repositories split out automatically; a Next.js storefront on top.",
  ],
  metrics: [
    { label: "AWS resources", value: "362" },
    { label: "Services", value: "10" },
    { label: "Days", value: "11" },
    { label: "Lambda functions", value: "26" },
  ],
  tech: ["Terraform", "AWS Lambda", "Amazon EventBridge", "AWS AppSync", "Amazon DynamoDB", "Amazon Cognito", "API Gateway", "Amazon SQS", "Amazon CloudWatch", "AWS X-Ray", "AWS WAF", "Node.js", "TypeScript", "Next.js"],
  moons: [
    { slug: "lambda-split", name: "Automated Lambda Split", summary: "A script that split 26 Lambda functions into their own repositories in one pass.", start: "2026-06-18", end: "2026-06-18" },
    { slug: "architecture-document", name: "Generated Architecture Document", summary: "A Spanish architecture document and diagram generated from the deployed code, delivered to the client.", start: "2026-06-23", end: "2026-06-23" },
  ],
  timeline: [
    { date: "2026-06-12", title: "Mission start", detail: "Terraform port of the reference architecture begins." },
    { date: "2026-06-18", title: "26 Lambda repositories split out automatically" },
    {
      date: "2026-06-23",
      title: "Architecture document generated from the code",
      detail: "Ten services, one bus, per-source IAM restriction, filtered subscriptions.",
      image: {
        src: "/missions/event-driven-platform/architecture.webp",
        alt: "Architecture diagram of the event-driven serverless platform: AppSync front door, ten services around an EventBridge bus, DynamoDB tables with streams, Cognito, REST APIs and a simulated payment provider",
        caption: "Architecture diagram generated from the deployed Terraform code.",
        width: 1600,
        height: 656,
      },
    },
  ],
  sources: ["vault:#22", "cv.md:120-123", "article-digest.md:73-81"],
};
