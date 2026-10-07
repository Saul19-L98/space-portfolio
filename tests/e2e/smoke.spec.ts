import { expect, test, type Page } from "@playwright/test";

const IGNORED_CONSOLE = /swiftshader|software webgl|GPU stall|WebGL|GroupMarkerNotSet|Automatic fallback to software/i;
/** Path prefix of the deployment under test ("" locally, "/space-portfolio" on GitHub Pages). */
const BP = (process.env.BASE_PATH ?? "").replace(/\/$/, "");
const u = (path: string) => `${BP}${path}`;

function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error" && !IGNORED_CONSOLE.test(msg.text())) errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

async function waitForScene(page: Page) {
  await expect(page.getByTestId("universe-root")).toHaveAttribute("data-scene-ready", "1", { timeout: 60_000 });
}

test("galaxy view renders the canvas, systems, ship and intro", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(u("/"));
  await expect(page.locator("canvas")).toBeVisible();
  await waitForScene(page);
  await expect(page.getByTestId("intro-card")).toBeVisible();
  for (const slug of ["independent-contractor", "orbitweb", "aracari-studios", "tdw-group"]) {
    await expect(page.getByTestId(`system-label-${slug}`)).toHaveAttribute("data-visible", "1");
  }
  await expect(page.getByTestId("ship-label")).toHaveAttribute("data-visible", "1");
  await expect(page.getByRole("link", { name: /TDW Group/ }).first()).toBeAttached();
  expect(errors).toEqual([]);
});

test("flying into the TDW system shows its planets and the system panel", async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto(u("/system/tdw-group"));
  await waitForScene(page);
  await expect(page.getByTestId("system-panel")).toContainText("TDW Group");
  await expect(page.getByTestId("universe-root")).toHaveAttribute("data-camera-mode", /orbit|idle/, { timeout: 30_000 });
  const visible = page.locator('[data-testid^="planet-label-"][data-visible="1"]');
  await expect.poll(async () => visible.count(), { timeout: 30_000 }).toBeGreaterThanOrEqual(6);
  expect(errors).toEqual([]);
});

test("clicking a planet label opens its mission record; Escape returns to the system", async ({ page }) => {
  await page.goto(u("/system/tdw-group"));
  await waitForScene(page);
  // Let the fly-in finish: labels are re-laid out every frame while the camera moves.
  await expect(page.getByTestId("universe-root")).toHaveAttribute("data-camera-mode", /orbit|idle/, { timeout: 30_000 });
  const label = page.getByTestId("planet-label-event-driven-platform");
  await expect(label).toHaveAttribute("data-visible", "1", { timeout: 30_000 });
  // Dispatch on the element: a real pointer click can fall through to the canvas if the
  // collision logic hides this label between the visibility check and the click.
  await label.dispatchEvent("click");
  await expect(page).toHaveURL(/\/system\/tdw-group\/event-driven-platform\/?$/);
  const record = page.getByTestId("mission-record");
  await expect(record).toBeVisible();
  await expect(record.getByRole("heading", { level: 2 })).toHaveText("Event-Driven Serverless Platform");
  await expect(record).toContainText("362");
  await expect(record.locator("img")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(page).toHaveURL(/\/system\/tdw-group\/?$/);
});

test("the time scrubber hides missions that have not started yet", async ({ page }) => {
  await page.goto(u("/system/tdw-group"));
  await waitForScene(page);
  await expect(page.getByTestId("planet-label-trade-data-pipelines")).toHaveAttribute("data-visible", "1", { timeout: 30_000 });
  const range = page.getByTestId("time-range");
  await range.evaluate((el: HTMLInputElement) => {
    el.value = String(Date.UTC(2024, 0, 1));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await expect(page.getByTestId("time-readout")).toHaveText("Jan 2024");
  await expect
    .poll(async () => page.locator('[data-testid^="planet-label-"][data-visible="1"]').count(), { timeout: 20_000 })
    .toBe(0);
});

test("the pilot record shows the photo and headline", async ({ page }) => {
  await page.goto(u("/pilot"));
  await expect(page.getByTestId("pilot-profile")).toContainText("AI Engineer & Cloud Solutions Architect");
  await expect(page.getByTestId("pilot-profile").locator("img")).toBeVisible();
});

test("dim systems render partial records", async ({ page }) => {
  await page.goto(u("/system/aracari-studios/aracari-studios-giant-1"));
  await expect(page.getByTestId("partial-record")).toBeVisible();
  await expect(page.getByTestId("mission-record")).toContainText("NestJS");
});

test("the text mission index lists every system and planet", async ({ page }) => {
  await page.goto(u("/missions"));
  const index = page.getByTestId("missions-index");
  await expect(index).toContainText("TDW Group");
  await expect(index).toContainText("Independent Contractor");
  await expect(index.locator("h3")).toHaveCount(24 + 8);
});

test("keyboard navigation cycles planets and opens one", async ({ page }) => {
  await page.goto(u("/system/tdw-group"));
  await waitForScene(page);
  await page.keyboard.press("ArrowRight");
  await expect(page.getByTestId("hover-card")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/system\/tdw-group\/[a-z-]+\/?$/);
  await expect(page.getByTestId("mission-record")).toBeVisible();
});

test("reduced motion still reaches a usable system view", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(u("/system/tdw-group"));
  await waitForScene(page);
  await expect(page.getByTestId("hud-motion")).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("system-panel")).toBeVisible();
});

test("metadata and social tags are per planet", async ({ page }) => {
  await page.goto(u("/system/tdw-group/genai-assistant-platform"));
  await expect(page).toHaveTitle(/Multi-Tenant GenAI Assistant Platform — TDW-18/);
  const og = page.locator('meta[property="og:image"]');
  await expect(og).toHaveAttribute("content", /opengraph-image/);
});
