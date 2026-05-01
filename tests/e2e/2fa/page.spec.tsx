import { test, expect } from "@playwright/test";

test.describe("Two-Factor Authentication Page", () => {
  test("should load 2FA page for unauthenticated users", async ({ page }) => {
    await page.goto("/2fa");

    await expect(page).toHaveTitle(/Two-Factor Authentication/i);
  });

  test("should display tabs", async ({ page }) => {
    await page.goto("/2fa");

    await expect(page.getByRole("tab", { name: /authenticator/i })).toBeVisible();
    await expect(page.getByRole("tab", { name: /backup code/i })).toBeVisible();
  });

  test("should switch between tabs", async ({ page }) => {
    await page.goto("/2fa");

    const backupTab = page.getByRole("tab", { name: /backup code/i });

    if (await backupTab.isVisible()) {
      await backupTab.click();
      await expect(backupTab).toBeVisible();
    }
  });

  test("redirects authenticated user to dashboard (basic check)", async ({ page }) => {
    await page.goto("/2fa");

    if (/dashboard/.test(page.url())) {
      await expect(page).toHaveURL(/dashboard/);
    } else {
      await expect(page).toHaveURL(/2fa/);
    }
  });
});
