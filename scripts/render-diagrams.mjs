#!/usr/bin/env node
/**
 * Renders assets-src/diagrams/*.mmd to public/missions/bi-portal-rollout/*.svg
 * with mermaid-cli. Needs a Chromium: set MMD_CHROME to the executable, or
 * let Playwright's bundled headless shell be found.
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const srcDir = path.join(root, "assets-src", "diagrams");
const outDir = path.join(root, "public", "missions", "bi-portal-rollout");
mkdirSync(outDir, { recursive: true });

function findChrome() {
  if (process.env.MMD_CHROME) return process.env.MMD_CHROME;
  const pw = path.join(homedir(), ".cache", "ms-playwright");
  if (existsSync(pw)) {
    for (const d of readdirSync(pw)) {
      if (d.startsWith("chromium_headless_shell")) {
        const p = path.join(pw, d, "chrome-headless-shell-linux64", "chrome-headless-shell");
        if (existsSync(p)) return p;
      }
    }
  }
  return null;
}

const chrome = findChrome();
if (!chrome) {
  console.error("No Chromium found. Set MMD_CHROME=/path/to/chrome.");
  process.exit(1);
}
const puppeteerCfg = path.join(outDir, ".puppeteer.json");
writeFileSync(puppeteerCfg, readFileSync(path.join(srcDir, "puppeteer.json"), "utf8").replace("__CHROME__", chrome));

for (const f of readdirSync(srcDir).filter((f) => f.endsWith(".mmd"))) {
  const out = path.join(outDir, f.replace(/\.mmd$/, ".svg"));
  execFileSync("npx", ["-y", "@mermaid-js/mermaid-cli", "-p", puppeteerCfg, "-i", path.join(srcDir, f), "-o", out, "-b", "transparent"], { stdio: "inherit" });
  console.log("rendered", path.relative(root, out));
}
