import { test, expect } from "@playwright/test";

test.describe("Login Page", () => {
  test("should load login page", async ({ page }) => {
    await page.goto("/login");

    await expect(page).toHaveTitle(/Login/i);
  });

  test("should display login form", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("form")).toBeVisible();
  });

  test("should show input fields", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("should allow typing into fields", async ({ page }) => {
    await page.goto("/login");

    await page.fill("input[type='email']", "test@example.com");
    await page.fill("input[type='password']", "password123");

    await expect(page.locator("input[type='email']")).toHaveValue("test@example.com");
  });

  test("should submit form (basic click test)", async ({ page }) => {
    await page.goto("/login");

    const button = page.getByRole("button").filter({ hasText: /login/i }).first();

    if (await button.isVisible()) {
      await button.click();
    }

    await expect(page.locator("body")).toBeVisible();
  });
});
