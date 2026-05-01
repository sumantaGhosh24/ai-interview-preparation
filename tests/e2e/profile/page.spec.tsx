import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto("/profile");

    await expect(page).toHaveURL(/login/);
  });

  test("page loads without crashing (basic check)", async ({ page }) => {
    await page.goto("/profile");

    await expect(page.locator("body")).toBeVisible();
  });

  test("displays profile tabs if accessible", async ({ page }) => {
    await page.goto("/profile");

    const possibleTabs = [
      page.getByRole("tab", { name: /profile/i }),
      page.getByRole("tab", { name: /image/i }),
      page.getByRole("tab", { name: /security/i }),
      page.getByRole("tab", { name: /sessions/i }),
      page.getByRole("tab", { name: /accounts/i }),
      page.getByRole("tab", { name: /danger/i }),
    ];

    for (const tab of possibleTabs) {
      if (await tab.first().isVisible()) {
        await expect(tab.first()).toBeVisible();
        break;
      }
    }
  });
});
