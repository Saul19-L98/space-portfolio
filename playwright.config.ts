import { defineConfig, devices } from "@playwright/test";

/**
 * Two modes:
 *  - local (default): starts `next start` on PORT and tests http://127.0.0.1:PORT
 *  - live: BASE_URL=https://host/base-path tests a deployed site; no server is started.
 * BASE_PATH is derived from BASE_URL (or set explicitly) so tests can build prefixed paths.
 */
const port = Number(process.env.PORT ?? 3000);
const liveBase = process.env.BASE_URL?.replace(/\/$/, "");
const basePath = (process.env.BASE_PATH ?? (liveBase ? new URL(liveBase).pathname : "")).replace(/\/$/, "");
process.env.BASE_PATH = basePath;
const baseURL = liveBase ?? `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  expect: { timeout: 20_000 },
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    viewport: { width: 1280, height: 720 },
    trace: "retain-on-failure",
    // No GPU in CI or on the build box: software WebGL through SwiftShader.
    launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] },
  },
  webServer: liveBase
    ? undefined
    : {
        command: `npm run start -- --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
