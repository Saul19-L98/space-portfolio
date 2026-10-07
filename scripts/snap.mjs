#!/usr/bin/env node
/**
 * Captures screenshots of key views with the headless shell + SwiftShader.
 * Usage: node scripts/snap.mjs <outDir> [baseURL]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const out = process.argv[2] ?? "screenshots";
const base = process.argv[3] ?? "http://127.0.0.1:3000";
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

async function settle(ms = 2500) {
  await page.waitForSelector('[data-testid="universe-root"][data-scene-ready="1"]', { timeout: 90_000 });
  await page.waitForTimeout(ms);
}

const shots = [
  ["galaxy", "/", async () => settle(4000)],
  ["system-tdw", "/system/tdw-group", async () => settle(5000)],
  ["planet-event-driven", "/system/tdw-group/event-driven-platform", async () => settle(5000)],
  ["planet-genai", "/system/tdw-group/genai-assistant-platform?quality=high", async () => settle(5000)],
  ["system-dim", "/system/aracari-studios", async () => settle(4000)],
  ["pilot", "/pilot", async () => settle(3000)],
  ["gallery", "/dev/planets", async () => page.waitForTimeout(6000)],
  ["missions", "/missions", async () => page.waitForTimeout(800)],
];

for (const [name, url, wait] of shots) {
  await page.goto(base + url, { waitUntil: "domcontentloaded" });
  await wait();
  const file = path.join(out, `${name}.png`);
  await page.screenshot({ path: file, fullPage: name === "missions" });
  console.log("saved", file);
}
await browser.close();
console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "no console errors");
