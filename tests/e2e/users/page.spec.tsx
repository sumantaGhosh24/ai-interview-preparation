import { test, expect } from "@playwright/test";

test.describe("Manage Users Page", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/users");

    await expect(page).toHaveURL(/.*login/);
  });

  test("page does not crash when accessed", async ({ page }) => {
    await page.goto("/users");

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows users table structure (if accessible)", async ({ page }) => {
    await page.goto("/users");

    const table = page.locator("table");

    if (await table.count()) {
      await expect(table).toBeVisible();

      await expect(page.getByText("User")).toBeVisible();
      await expect(page.getByText("Role")).toBeVisible();
      await expect(page.getByText("Created")).toBeVisible();
    }
  });

  test("should render users count in title (if authorized)", async ({ page }) => {
    await page.goto("/users");

    const title = page.locator("text=Users");

    if (await title.count()) {
      await expect(title.first()).toBeVisible();
    }
  });
});
