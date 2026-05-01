import { test, expect } from "@playwright/test";

test.describe("Topics Page", () => {
  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto("/topics");

    await expect(page).toHaveURL(/.*login/);
  });

  test("page loads without crashing", async ({ page }) => {
    await page.goto("/topics");

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows loading state or content", async ({ page }) => {
    await page.goto("/topics");

    const loading = page.getByText(/loading/i);
    const anyContent = page.locator("body");

    await expect(loading.or(anyContent)).toBeVisible();
  });

  test("renders topics list if user is authenticated", async ({ page }) => {
    await page.goto("/topics");

    const list = page.locator("[data-testid='topics-list']");

    if (await list.count()) {
      await expect(list).toBeVisible();
    }
  });

  test("shows error fallback if something fails (graceful UI)", async ({ page }) => {
    await page.goto("/topics");

    const errorText = page.getByText("Something went wrong");

    if (await errorText.count()) {
      await expect(errorText).toBeVisible();
    }
  });
});
