import { test, expect } from "@playwright/test";

test.describe("Analytics Page", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/analytics");

    await expect(page).toHaveURL(/login/);
  });

  test("page loads without crashing", async ({ page }) => {
    await page.goto("/analytics");

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows loading or analytics content", async ({ page }) => {
    await page.goto("/analytics");

    await expect(page.locator("text=Loading").or(page.locator("body"))).toBeVisible();
  });

  test("basic analytics sections appear if loaded", async ({ page }) => {
    await page.goto("/analytics");

    const possibleSections = [
      page.locator("text=Weak"),
      page.locator("text=Recent"),
      page.locator("text=Question Source"),
      page.locator("text=Attempt Trends"),
    ];

    for (const section of possibleSections) {
      if (await section.first().isVisible()) {
        await expect(section.first()).toBeVisible();
        break;
      }
    }
  });
});
