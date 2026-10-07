import type { System } from "../schema";

export const independentContractor: System = {
  slug: "independent-contractor",
  name: "Independent Contractor",
  kind: "dim",
  roles: [{ title: "Software Engineer", start: "2021-01", end: "2022-11" }],
  location: "Remote",
  summary:
    "Two years of end-to-end client web applications as an independent contractor: requirements, backend APIs, database design, cloud hosting, deployment and CI/CD, working directly with clients from requirements through release. No mission logs survive from this period — only the CV record — so this system is a dim star with gas giants.",
  bullets: [
    {
      title: "End-to-End Client Applications",
      text: "Delivered client web applications end to end: backend APIs, database design, cloud hosting, deployment and CI/CD, working directly with clients from requirements through release.",
      tech: ["REST APIs", "Database design", "Cloud hosting", "CI/CD"],
    },
    {
      title: "React & Node.js Builds",
      text: "Built React front ends and Node.js backends for those client applications.",
      tech: ["React", "Node.js", "JavaScript"],
    },
  ],
  planets: [],
  galaxyPosition: [-150, -8, 50],
};
