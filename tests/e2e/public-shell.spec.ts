import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public shell is responsive, keyboard reachable and accessible", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("#main-content")).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const blockingViolations = results.violations.filter(
    ({ impact }) => impact === "critical" || impact === "serious",
  );
  expect(blockingViolations).toEqual([]);
});

test("health endpoint is live and never cached", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["cache-control"]).toContain("no-store");
  await expect(response.json()).resolves.toMatchObject({
    status: "ok",
    service: "marketplace",
  });
});
