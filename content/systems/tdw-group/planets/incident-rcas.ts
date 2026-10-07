import type { Planet } from "@/content/schema";

export const incidentRcas: Planet = {
  slug: "incident-rcas",
  name: "Incident Command: Three Root-Cause Analyses",
  codename: "TDW-21",
  start: "2026-08-01",
  end: "2026-09-30",
  status: "done",
  domain: "ops",
  size: "medium",
  clientLabel: "an electric utility, a laboratory and a hardware retailer",
  summary:
    "Three production failures diagnosed to root cause rather than restarted: a 26-day site-to-site VPN outage, a 4-day silent MWAA scheduler hang, and a Power BI refresh loop against Redshift Serverless.",
  problem: "Each failure had been invisible or misdiagnosed for days. Restarting would have hidden the cause and guaranteed a repeat.",
  role:
    "Read the VPN log signature — Phase 1 succeeding roughly 1,300 times against zero Phase 2 — as a selector mismatch, traced it to inverted CIDR variables in his own Terraform module, fixed it in about nine minutes without credential churn, then audited every other client on the module. Caught the MWAA hang through a heartbeat-metric flatline and shipped an opt-in CloudWatch alarm, missing data treated as breaching, into the shared module. Found 6,028 parquet files averaging 347 KiB behind the Power BI broken-pipe loop and ordered the fix plan cheapest-first.",
  outcome: [
    "A permanent monitoring fix for every client on the shared module — it can never be silent again.",
    "Months are approximate: the CV records the incidents without dates.",
  ],
  metrics: [
    { label: "VPN outage", value: "26 days → ~9 min fix" },
    { label: "Scheduler hang", value: "4 days, now alarmed" },
    { label: "Parquet files found", value: "6,028" },
  ],
  tech: ["AWS Site-to-Site VPN", "Terraform", "Amazon MWAA", "Amazon CloudWatch", "Amazon Redshift Serverless", "Power BI", "Amazon S3", "Parquet"],
  moons: [
    { slug: "vpn-rca", name: "26-Day VPN Outage", summary: "Phase 1 succeeded ~1,300 times with zero Phase 2: a selector mismatch from inverted CIDR variables in his own module. Fixed in ~9 minutes, then every other client on the module was audited." },
    { slug: "mwaa-heartbeat", name: "Silent Scheduler Hang", summary: "A 4-day MWAA scheduler hang caught through a heartbeat flatline; an opt-in CloudWatch alarm with missing data treated as breaching now ships in the shared module." },
    { slug: "powerbi-loop", name: "Power BI Broken-Pipe Loop", summary: "A semantic-model refresh against Redshift Serverless looping on 6,028 small parquet files (347 KiB average, 570 partitions). Fix plan ordered cheapest-first, with added compute last." },
  ],
  timeline: [
    { date: "2026-08", title: "VPN outage closed", detail: "Log-signature RCA; module audited for every client." },
    { date: "2026-08", title: "Heartbeat alarm shipped to the shared MWAA module" },
    { date: "2026-09", title: "Power BI refresh loop diagnosed", detail: "6,028 parquet files, 347 KiB average." },
  ],
  sources: ["cv.md:174-180", "article-digest.md:20-22", "session notes"],
};
