import type { Profile } from "./schema";

export const profile: Profile = {
  name: "Saúl Laínez",
  fullName: "Saúl Alejandro Laínez Mejía",
  headline: "AI Engineer & Cloud Solutions Architect",
  summary: [
    "I design event-driven AWS platforms and the AI agents that run on top of them. Over the last twelve months: 28 projects, 60 repositories, 10 clients, 754 commits — moving from “get me this data” to “here is the platform your team builds on.”",
    "Cloud architecture & IaC. Designed and deployed a 362-resource, ten-service event-driven AWS platform solo in eleven days, and a Terraform/Terragrunt landing zone for a regional food manufacturer with a site-to-site VPN to their on-premises network, .NET Lambdas and a four-stage CodePipeline with SonarQube. I can stand up a complete client engagement — IaC, backend, CI/CD, front-end shells — in a day.",
    "AI & agent engineering. A multi-tenant GenAI assistant platform on Amazon Bedrock, text-to-SQL over PostgreSQL, text-to-DAX against Power BI, vision tools inside a live WhatsApp sales agent. The design principle is constant: let the model generate the query, constrain what the query can do.",
    "Data acquisition & ETL. Nine production pipelines against systems that did not want to be read — subscription trade platforms, a bot-protected supplier portal with SMS 2FA, an SAP ERP, a government customs API. One ran in production for ten months, with deduplication solved at the schema level.",
    "Deployment, documentation, security. The recurring role across projects someone else wrote: making them deployable, secure and repeatable. I usually write more documentation than code, and I have shipped unprompted security assessments with prioritized remediation.",
  ],
  location: "San Salvador, El Salvador",
  timezone: "UTC−6",
  photo: { src: "/profile.webp", alt: "Saúl Laínez, smiling, arms crossed, in a garden", width: 800, height: 1067 },
  links: {
    github: "https://github.com/Saul19-L98",
    linkedin: "https://www.linkedin.com/in/sa%C3%BAl-la%C3%ADnez-764a131a8",
    email: "saul.alejandro19@gmail.com",
    twitter: "https://twitter.com/sallanez",
  },
  skills: [
    { group: "Cloud & IaC", items: ["AWS", "Terraform", "Terragrunt", "AWS SAM", "Docker", "Amazon ECR", "CodePipeline", "Amplify", "App Runner", "GitHub Actions", "Azure DevOps"] },
    { group: "AWS", items: ["Lambda", "ECS Fargate", "EventBridge", "S3", "Glue", "Athena", "Lake Formation", "Redshift Serverless", "MWAA", "DynamoDB", "Aurora", "RDS Proxy", "API Gateway", "AppSync", "Cognito", "SQS / SNS", "CloudWatch", "X-Ray", "WAF", "KMS", "Secrets Manager"] },
    { group: "AI", items: ["Amazon Bedrock (agents, action groups, knowledge bases, guardrails)", "Bedrock AgentCore", "RAG", "MCP", "Claude Agent Skills", "YOLO (v8 / 11)", "Label Studio", "MLflow"] },
    { group: "Languages", items: ["Python", "TypeScript", "PHP", "C# / .NET", "SQL", "Bash", "GLSL"] },
    { group: "Backend & web", items: ["Node.js", "NestJS", "Next.js", "React", "Laravel", "Filament", "FastAPI", "ASP.NET Core", "Angular", "Tailwind CSS"] },
    { group: "Data", items: ["PostgreSQL", "pandas", "Polars", "dbt", "Playwright", "Parquet", "MongoDB", "Redis", "pipeline & schema design"] },
  ],
  certifications: [
    { name: "AWS Certified Developer – Associate", issuer: "Amazon Web Services", period: "2026 – 2029", url: "https://www.credly.com/badges/66b3ae87-f503-487f-ac56-f8580d20d1cf/linked_in_profile" },
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", period: "2025 – 2029", url: "https://www.credly.com/badges/6f26c2bd-14fb-4c5e-9c44-3ec2f31276b3/linked_in_profile" },
    { name: "Microsoft Certified: Azure Fundamentals (AZ-900)", issuer: "Microsoft", period: "2024", url: "https://www.credly.com/badges/ebc4caaa-ad93-4e5e-acb2-e1f68aad526d/linked_in_profile" },
  ],
  education: { degree: "Computer Science Engineer", school: "Universidad Don Bosco, San Salvador", year: "2022" },
  languages: ["Spanish (native)", "English (advanced, client-facing)"],
  stats: [
    { label: "Projects", value: "28" },
    { label: "Repositories", value: "60" },
    { label: "Clients", value: "10" },
    { label: "Commits", value: "754" },
  ],
};
