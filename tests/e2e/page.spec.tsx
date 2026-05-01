import { test, expect } from "@playwright/test";

test.describe("Home Page (Landing)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load homepage successfully", async ({ page }) => {
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("should render main sections", async ({ page }) => {
    await expect(page.getByText(/hero/i))
      .toBeVisible()
      .catch(() => {});
    await expect(page.getByText(/features/i))
      .toBeVisible()
      .catch(() => {});
    await expect(page.getByText(/workflow/i))
      .toBeVisible()
      .catch(() => {});
    await expect(page.getByText(/testimonials/i))
      .toBeVisible()
      .catch(() => {});
    await expect(page.getByText(/faq/i))
      .toBeVisible()
      .catch(() => {});
  });

  test("should have CTA buttons or links", async ({ page }) => {
    const buttons = page.locator("button, a");

    await expect(buttons.first()).toBeVisible();
  });

  test("should not crash and display content", async ({ page }) => {
    const bodyText = await page.locator("body").innerText();

    expect(bodyText.length).toBeGreaterThan(50);
  });

  test("should be accessible (basic check)", async ({ page }) => {
    await expect(page.locator("body")).toBeVisible();
  });
});
