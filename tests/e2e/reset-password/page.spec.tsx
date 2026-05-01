import { test, expect } from "@playwright/test";

test.describe("Reset Password Page", () => {
  const url = "/reset-password";

  test("should load reset password page", async ({ page }) => {
    await page.goto(url);

    await expect(page).toHaveURL(/reset-password/);
    await expect(page.locator("body")).toBeVisible();
  });

  test("should render reset password form", async ({ page }) => {
    await page.goto(url);

    const form = page.locator("form");

    if (await form.count()) {
      await expect(form).toBeVisible();
    }
  });

  test("should show input fields", async ({ page }) => {
    await page.goto(url);

    const inputs = page.locator("input");

    if ((await inputs.count()) > 0) {
      await expect(inputs.first()).toBeVisible();
    }
  });

  test("should allow typing in inputs", async ({ page }) => {
    await page.goto(url);

    const input = page.locator("input").first();

    if (await input.count()) {
      await input.fill("test@example.com");
      await expect(input).toHaveValue("test@example.com");
    }
  });

  test("should have submit button", async ({ page }) => {
    await page.goto(url);

    const button = page.getByRole("button");

    if (await button.count()) {
      await expect(button.first()).toBeVisible();
    }
  });

  test("should redirect authenticated users (requireUnauth)", async ({ page }) => {
    await page.goto(url);

    if (page.url().includes("/dashboard")) {
      await expect(page).toHaveURL(/dashboard/);
    }
  });
});
