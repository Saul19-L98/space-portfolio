import type { Planet } from "@/content/schema";

export const deploymentStandard: Planet = {
  slug: "deployment-standard",
  name: "Containerization & Deployment Standard",
  codename: "TDW-05",
  start: "2025-09-11",
  end: "2026-05-25",
  status: "done",
  domain: "ops",
  size: "medium",
  summary:
    "The recurring role across projects someone else wrote: make them deployable, secure and repeatable with Docker, Amazon ECR, App Runner and container-image Lambdas — documented so other engineers can repeat it without him.",
  problem: "Colleagues' services ran on laptops. Each needed containerization, a runtime, registry policies and IAM trust, and nobody had written the pattern down.",
  role:
    "Built the entire containerization, App Runner deployment, ECR access policy and IAM trust layer for a colleague's Bedrock chatbot service, documented in 1,005 lines against 547 lines of application code. Later containerized an open-source CRM: a three-stage Dockerfile (php-fpm + nginx), queues, ECR Public base images. Docker in 8 projects, ECR in 6.",
  outcome: [
    "A repeatable deployment standard other engineers applied on their own.",
    "Never the application code: the chatbot backend and the CRM customization belong to colleagues.",
  ],
  metrics: [
    { label: "Docs vs code", value: "1,005 / 547 lines" },
    { label: "Docker", value: "8 projects" },
    { label: "ECR", value: "6 projects" },
  ],
  tech: ["Docker", "Amazon ECR", "AWS App Runner", "AWS Lambda (container images)", "IAM", "nginx", "php-fpm"],
  moons: [
    { slug: "app-runner-layer", name: "App Runner Deployment Layer", summary: "One commit that added Docker, App Runner, ECR and IAM policies plus 1,005 lines of deployment docs to a colleague's Express chatbot backend.", start: "2025-09-11", end: "2025-09-11", tech: ["AWS App Runner", "Amazon ECR"] },
    { slug: "crm-containerization", name: "CRM Containerization", summary: "Containerized an open-source Laravel + Vue CRM: three-stage Dockerfile, php-fpm + nginx, queues, ECR Public base images, agent instructions file.", start: "2026-05-13", end: "2026-05-25", tech: ["Docker", "Laravel", "nginx"] },
  ],
  timeline: [
    { date: "2025-09-11", title: "Deployment layer for a colleague's Bedrock service", detail: "First appearance of the platform role." },
    { date: "2026-05-13", title: "CRM containerization", detail: "Three-stage Dockerfile and ECR Public base images." },
  ],
  sources: ["vault:#7", "vault:#36", "cv.md:130-135"],
};
