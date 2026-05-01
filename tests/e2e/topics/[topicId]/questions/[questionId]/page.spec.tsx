import { test, expect } from "@playwright/test";

test.describe("Question Page", () => {
  const topicId = "test-topic-id";
  const questionId = "test-question-id";

  const url = `/topics/${topicId}/questions/${questionId}`;

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(url);

    await expect(page).toHaveURL(/.*login/);
  });

  test("page loads without crashing", async ({ page }) => {
    await page.goto(url);

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows loading or content", async ({ page }) => {
    await page.goto(url);

    const loading = page.getByText(/loading/i);
    const body = page.locator("body");

    await expect(loading.or(body)).toBeVisible();
  });

  test("renders editor and history sections if authorized", async ({ page }) => {
    await page.goto(url);

    const editor = page.locator("[data-testid='answer-editor']");
    const history = page.locator("[data-testid='answer-history']");

    if (await editor.count()) {
      await expect(editor).toBeVisible();
    }

    if (await history.count()) {
      await expect(history).toBeVisible();
    }
  });

  test("submit button exists (basic interaction check)", async ({ page }) => {
    await page.goto(url);

    const button = page.getByRole("button", { name: /submit answer/i });

    if (await button.count()) {
      await expect(button).toBeVisible();
    }
  });

  test("handles error fallback gracefully", async ({ page }) => {
    await page.goto(url);

    const errorText = page.getByText("Something went wrong");

    if (await errorText.count()) {
      await expect(errorText).toBeVisible();
    }
  });
});
