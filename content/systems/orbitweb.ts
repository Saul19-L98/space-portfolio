import type { System } from "../schema";

export const orbitweb: System = {
  slug: "orbitweb",
  name: "OrbitWeb Digital Marketing",
  kind: "dim",
  roles: [{ title: "Frontend Developer", start: "2022-12", end: "2023-10" }],
  location: "Canada · Remote",
  summary:
    "Front-end development for a Canadian digital-marketing agency, working alongside the design team on Angular and Next.js applications. The record is a single CV line, so this system is a dim star with gas giants.",
  bullets: [
    {
      title: "Agency Web Applications",
      text: "Developed web applications with Angular, Next.js, Tailwind and Node.js alongside the design team.",
      tech: ["Angular", "Next.js", "Tailwind CSS", "Node.js"],
    },
    {
      title: "Server-Side Logic",
      text: "Implemented server-side logic in Next.js API routes and server actions.",
      tech: ["Next.js API routes", "Server actions", "TypeScript"],
    },
  ],
  planets: [],
  galaxyPosition: [-80, 6, -30],
};
