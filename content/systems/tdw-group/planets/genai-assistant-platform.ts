import type { Planet } from "@/content/schema";

export const genaiAssistantPlatform: Planet = {
  slug: "genai-assistant-platform",
  name: "Multi-Tenant GenAI Assistant Platform",
  codename: "TDW-18",
  start: "2026-06-01",
  status: "ongoing",
  domain: "genai",
  size: "large",
  flagship: true,
  clientLabel: "multiple enterprise clients",
  summary:
    "A multi-tenant conversational AI platform on Amazon Bedrock, delivered over WhatsApp, instantiated as an isolated per-tenant stack from a shared Terraform module library — roughly 110 managed AWS resources per tenant.",
  problem: "Each enterprise client wanted its own assistant. Forking the platform per client would have multiplied delivery effort and operational risk.",
  role:
    "Designed and own the platform as AI Solution Architect: tenant isolation (own AWS account and Terraform state, ~10 IAM roles, 12 role policies and 13 policy attachments per stack, per-tenant PostgreSQL roles with generated credentials), six container-image services per tenant on ECS Fargate with multi-region warm-standby failover, the FIFO-plus-debounce messaging backbone with dead-letter queues on every async consumer, Bedrock prompts as Terraform-managed resources, and the agent action-group contract.",
  outcome: [
    "Onboarding a tenant is a stack instantiation, not a fork: per-client delivery effort falls to configuration.",
    "RAG over Bedrock Knowledge Bases with an Aurora Serverless vector store; three-layer hallucination safeguards; a defined human-escalation boundary.",
    "Inference-facing and long-running services on ECS Fargate, event-driven paths on Lambda; routine request classes routed to cheaper models.",
  ],
  metrics: [
    { label: "Resources per tenant", value: "~110" },
    { label: "Services per tenant", value: "6" },
    { label: "IAM roles per stack", value: "~10" },
  ],
  tech: ["Amazon Bedrock", "Bedrock Knowledge Bases", "Bedrock Guardrails", "Terraform", "Amazon ECS Fargate", "Amazon ECR", "Amazon SQS FIFO", "Amazon DynamoDB", "Amazon S3", "Amazon SNS", "Amazon EventBridge", "Aurora Serverless (vector store)", "AWS CodePipeline", "Lambda Powertools", "WhatsApp Business API"],
  moons: [
    { slug: "rag", name: "RAG over the Product Catalogue", summary: "Bedrock Knowledge Bases vectorizing the client's product catalogue from S3, backed by an Aurora Serverless vector store, plus multimodal tool-calling through an OCR endpoint.", tech: ["Bedrock Knowledge Bases", "Aurora Serverless"] },
    { slug: "guardrails", name: "Three-Layer Hallucination Safeguards", summary: "Bedrock Guardrails contextual-grounding and relevance policies, deterministic output validation against real inventory, and read-only execution boundaries.", tech: ["Bedrock Guardrails"] },
    { slug: "human-escalation", name: "Human-Escalation Boundary", summary: "The assistant escalates to a human agent when a request falls outside what it is permitted or able to answer — a defined stopping point rather than an open-ended mandate." },
    { slug: "runtime-split", name: "Runtime Selection", summary: "Inference-facing and long-running services on ECS Fargate where Lambda's execution model was the wrong fit; Lambda kept for event-driven, short-lived paths.", tech: ["Amazon ECS Fargate", "AWS Lambda"] },
    { slug: "cost-tiering", name: "Token-Cost Tiering", summary: "Prompt and context-size reduction plus model tiering, routing routine request classes to cheaper models. No before/after percentage is published." },
  ],
  timeline: [
    { date: "2026-06", title: "Platform design", detail: "Per-tenant stack from a shared module library." },
    { date: "2026-07", title: "Tenant isolation and messaging backbone", detail: "Own account and state per tenant; FIFO core queue plus debounce queue, DLQs everywhere." },
    { date: "2026-08", title: "RAG, guardrails and human escalation" },
    { date: "2026-09", title: "Multi-region warm standby", detail: "Six container-image services per tenant on ECS Fargate." },
  ],
  sources: ["cv.md:59-96", "article-digest.md:1-4,10c,10d,15"],
};
