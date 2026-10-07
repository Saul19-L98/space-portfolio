import type { Planet } from "@/content/schema";

export const bottlingLineVision: Planet = {
  slug: "bottling-line-vision",
  name: "Computer Vision on a Bottling Line",
  codename: "TDW-23",
  start: "2026-08-01",
  end: "2026-09-30",
  status: "live",
  domain: "cv",
  size: "medium",
  clientLabel: "a water-bottling plant",
  summary:
    "Real-time bottle counting on a truck loading line: a custom YOLOv8 detector trained on a Label Studio dataset and deployed on a GPU VM, plus the benchmarking, dataset-provenance and video-evidence tooling around it.",
  problem: "Manual tally sheets and camera outages made counts unverifiable, and the model's real accuracy was unknown because gate totals lie without gallery audits.",
  role:
    "Trained and deployed the model. Built deterministic model benchmarks with gallery audits, rebuilt the training dataset's provenance (zip layering, id recompute, frozen split ids), wrote a Kinesis Video Streams export tool for evidence clips, and reconciled operator sheets against system counts. The production detection service and portal code are the team's.",
  outcome: [
    "A benchmark that shows which checkpoint actually belongs in production — and that a bigger model did not help without better labels.",
    "An outage-aware reconciliation method: 79.2 % of sampled rows proved unmeasurable because of camera outages, so only the measurable rows are compared.",
  ],
  metrics: [
    { label: "Rows unmeasurable (outages)", value: "79.2 %" },
    { label: "Cameras", value: "4" },
    { label: "Video retention", value: "168 h" },
  ],
  tech: ["YOLOv8", "Ultralytics", "Label Studio", "PyTorch", "Amazon Kinesis Video Streams", "Amazon EC2 (GPU)", "Amazon DynamoDB", "Python"],
  moons: [
    { slug: "benchmarks", name: "Model Benchmarks", summary: "Deterministic per-clip benchmarks with gallery audits; equal-weight camera balancing and leave-one-camera-out runs showed the advantage of one camera is viewpoint, not exposure.", start: "2026-09-01", end: "2026-09-07" },
    { slug: "dataset-provenance", name: "Dataset Provenance Rebuild", summary: "The merged training set was a pile of exports; rebuilt it by zip layering and id recompute, with repeated-path epoch lists, temporal tails and a frozen holdout.", start: "2026-09-04" },
    { slug: "kvs-export", name: "Video Evidence Export", summary: "A reusable tool that pulls archived camera video from Kinesis Video Streams for a time range and saves verified MP4 clips — fragments, not HLS, because HLS breaks the timestamps.", start: "2026-09-01", tech: ["Amazon Kinesis Video Streams"] },
    { slug: "outage-reconciliation", name: "Outage-Aware Reconciliation", summary: "Manual operator sheets compared against system counts with the plant's timezone and outage windows applied; 79.2 % of rows were unmeasurable, 52.6 % agreement on the measurable rest.", start: "2026-09-14" },
    { slug: "inspection-dashboard", name: "Bottle-Inspection Dashboard (earlier)", summary: "An earlier adjacency: server-side pagination and a DynamoDB index on a bottle-quality inspection operator dashboard (11 of 23 commits).", start: "2025-10-13", end: "2025-10-17", tech: ["Next.js", "Amazon DynamoDB"] },
  ],
  timeline: [
    { date: "2025-10-13", title: "First computer-vision adjacency", detail: "Pagination and an index on an inspection dashboard." },
    { date: "2026-08", title: "Model trained and deployed on the GPU VM" },
    { date: "2026-09-01", title: "Video evidence export tool" },
    { date: "2026-09-07", title: "Benchmarks with gallery audits", detail: "Bigger model, worse score: labels, not size." },
    { date: "2026-09-14", title: "Outage-aware reconciliation report" },
  ],
  sources: ["cv.md:185-186", "article-digest.md:31", "session notes", "vault:#29"],
};
