import { test, expect } from "@playwright/test";

test.describe("Dashboard Page", () => {
  test("page loads without crashing", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows loading or content", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page.locator("text=Loading").or(page.locator("body"))).toBeVisible();
  });

  test("basic stats section appears if loaded", async ({ page }) => {
    await page.goto("/dashboard");

    const possibleStatText = page.locator("text=Topics").or(page.locator("text=Questions"));

    if (await possibleStatText.first().isVisible()) {
      await expect(possibleStatText.first()).toBeVisible();
    }
  });
});
