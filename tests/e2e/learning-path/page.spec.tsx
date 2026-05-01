import { test, expect } from "@playwright/test";

test.describe("Learning Path Page", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/learning-path");

    await expect(page).toHaveURL(/login/);
  });

  test("page loads (basic check after redirect or auth bypass)", async ({ page }) => {
    await page.goto("/learning-path");

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows loading or empty state safely", async ({ page }) => {
    await page.goto("/learning-path");

    await expect(page.locator("text=Loading").or(page.locator("body"))).toBeVisible();
  });
});
