import type { System } from "../schema";

export const aracariStudios: System = {
  slug: "aracari-studios",
  name: "Aracari Studios",
  kind: "dim",
  roles: [{ title: "Full Stack Developer", start: "2023-11", end: "2025-05" }],
  location: "Remote",
  summary:
    "Eighteen months of full-stack work: NestJS, ASP.NET Core and Python services behind React, Next.js and Angular front ends, MongoDB and Redis persistence, and the Azure deployment and CI/CD architecture that shipped the team's applications. Individual projects are not on record, so this system is a dim star with gas giants.",
  bullets: [
    {
      title: "Backend Services & REST APIs",
      text: "Built backend services and REST APIs in Node.js and TypeScript with NestJS, alongside ASP.NET Core (C#) and Python services, integrating them with React, Next.js and Angular front ends.",
      tech: ["NestJS", "TypeScript", "ASP.NET Core", "C#", "Python", "React", "Angular"],
    },
    {
      title: "Persistence & Caching",
      text: "Modelled and queried application persistence in MongoDB and Redis, using Redis for caching and session state.",
      tech: ["MongoDB", "Redis"],
    },
    {
      title: "Azure Delivery Architecture",
      text: "Designed the Azure deployment and CI/CD architecture: the delivery path and environment/deployment topology across Azure DevOps and GitHub Actions pipelines that shipped the team's applications to Azure.",
      tech: ["Azure DevOps", "GitHub Actions", "Azure"],
    },
    {
      title: "Azure Functions & SQL",
      text: "Developed cloud solutions on Azure Functions and Azure SQL.",
      tech: ["Azure Functions", "Azure SQL"],
    },
  ],
  planets: [],
  galaxyPosition: [-10, -4, 40],
};
