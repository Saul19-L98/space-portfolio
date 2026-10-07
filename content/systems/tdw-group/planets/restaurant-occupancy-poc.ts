import type { Planet } from "@/content/schema";

export const restaurantOccupancyPoc: Planet = {
  slug: "restaurant-occupancy-poc",
  name: "Restaurant Occupancy CV Proof of Concept",
  codename: "TDW-24",
  start: "2026-09-02",
  end: "2026-09-10",
  status: "prototype",
  domain: "cv",
  size: "medium",
  clientLabel: "a restaurant group",
  summary:
    "A computer-vision proof of concept for restaurant occupancy: a YOLO11 staff/table detector trained in three phases, a FastAPI job service with a FIFO worker and MLflow on a GPU EC2 box, a per-frame benchmark with a promotion gate, a BoT-SORT occupancy tracker, and a Next.js 15 site on Amplify with Cognito and chunked uploads.",
  problem: "Which model deserves production? The gate had to be able to say no — including to the author's own retrain.",
  role: "Built the whole proof of concept in nine days (44 commits, agent-assisted from his own workstation). The promotion gate rejected his larger retrained model: 23.23 against the champion's 33.76. Model size did not help; labels would.",
  outcome: [
    "Champion score 33.76; staff mAP50 0.84, table mAP50 0.23.",
    "~4,800 lines of TypeScript for the site; first training on 148 images and 1,028 boxes.",
  ],
  metrics: [
    { label: "Days", value: "9" },
    { label: "Commits", value: "44" },
    { label: "Promotion gate", value: "23.23 vs 33.76" },
  ],
  tech: ["YOLO11", "Ultralytics", "BoT-SORT", "FastAPI", "MLflow", "Amazon EC2 (GPU)", "Next.js 15", "AWS Amplify", "Amazon Cognito", "Amazon S3", "Python", "TypeScript"],
  moons: [
    { slug: "detector", name: "Staff / Table Detector", summary: "YOLO11 trained in three phases from 148 images and 1,028 boxes; staff mAP50 0.84, table mAP50 0.23.", tech: ["YOLO11"] },
    { slug: "promotion-gate", name: "Promotion Gate", summary: "A per-frame benchmark with a promotion rule for new models. It rejected the author's own retrain at 23.23 against the champion's 33.76." },
    { slug: "occupancy-tracker", name: "Occupancy Tracker", summary: "BoT-SORT tracking that unions COCO person detections with the custom staff model, with confirmed-customer dwell times.", tech: ["BoT-SORT"] },
    { slug: "portal", name: "Observability Site", summary: "A ~4,800-line Next.js 15 site on Amplify with Cognito and chunked uploads for clips and results.", tech: ["Next.js 15", "AWS Amplify", "Amazon Cognito"] },
  ],
  timeline: [
    { date: "2026-09-02", title: "Mission start", detail: "Detector, FastAPI job service and MLflow on the GPU box." },
    { date: "2026-09-06", title: "Benchmark v1 and champion v1" },
    { date: "2026-09-07", title: "Occupancy tracker and site", detail: "BoT-SORT, confirmed-customer dwell, chunked uploads." },
    { date: "2026-09-09", title: "Retrain rejected by the gate", detail: "23.23 vs 33.76 — size does not help, labels do." },
    { date: "2026-09-10", title: "Proof of concept delivered" },
  ],
  sources: ["vault:#39", "article-digest.md:28-29", "session notes"],
};
