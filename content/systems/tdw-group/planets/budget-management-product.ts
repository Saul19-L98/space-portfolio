import type { Planet } from "@/content/schema";

export const budgetManagementProduct: Planet = {
  slug: "budget-management-product",
  name: "Budget-Management Product",
  codename: "TDW-11",
  start: "2025-12-10",
  end: "2026-06-24",
  status: "live",
  domain: "web",
  size: "large",
  flagship: true,
  clientLabel: "an industrial paper manufacturer",
  summary:
    "A budget-management system for a paper and corrugated-products manufacturer: yearly budgets in two units, manual adjustments with approval, deviation and tolerance reports, projections, ERP consumption data and Excel import/export — built end to end in Laravel 12 and Filament.",
  problem: "Planners managed budgets across spreadsheets with no approval trail, no tolerance alerts and no link to the consumption data coming out of the ERP.",
  role:
    "Built it end to end over six and a half months — 183 commits — and learned PHP on the job. Wrote the Spanish end-user manuals with FAQ and terminology for non-technical planners, and ~30 machine-readable rule files published as Claude Agent Skills to keep the AI-assisted workflow honest.",
  outcome: [
    "26,547 lines of PHP in 193 files; 58,918 lines of documentation in 172 files.",
    "Six feature branches, all merged; Pest tests; Docker → ECR delivery.",
    "A demand-forecasting companion app followed in June 2026.",
  ],
  metrics: [
    { label: "Lines of PHP", value: "26,547" },
    { label: "Commits", value: "183" },
    { label: "Duration", value: "6.5 months" },
  ],
  tech: ["PHP 8", "Laravel 12", "Filament v3", "PostgreSQL", "Docker", "Amazon ECR", "Pest", "Excel import/export", "Claude Agent Skills"],
  moons: [
    { slug: "forecasting-companion", name: "Demand-Forecasting Companion", summary: "A Next.js forecasting companion: prediction-model views, planning UI and data tables (~9,900 lines of TypeScript). Built the prediction models behind it; no accuracy figures are published.", start: "2026-06-01", end: "2026-06-05", tech: ["Next.js", "TypeScript", "AWS Amplify"] },
  ],
  timeline: [
    { date: "2025-12-10", title: "Mission start", detail: "Laravel 12 + Filament, learning PHP in production." },
    { date: "2026-01", title: "Budgets in two units", detail: "Short tons and million square metres." },
    { date: "2026-03", title: "Adjustments with approval, deviation and tolerance reports" },
    { date: "2026-05", title: "Spanish end-user manuals", detail: "FAQ and terminology for non-technical planners." },
    { date: "2026-06-01", title: "Forecasting companion", detail: "Prediction-model views in five days." },
    { date: "2026-06-24", title: "Final release" },
  ],
  sources: ["vault:#16", "vault:#20", "article-digest.md:18,225"],
};
