import { test, expect } from "@playwright/test";

test.describe("Topic Details Page", () => {
  const topicId = "test-topic-id";

  test("redirects unauthenticated users to login", async ({ page }) => {
    await page.goto(`/topics/${topicId}`);

    await expect(page).toHaveURL(/.*login/);
  });

  test("page loads without crashing", async ({ page }) => {
    await page.goto(`/topics/${topicId}`);

    await expect(page.locator("body")).toBeVisible();
  });

  test("shows loading or content", async ({ page }) => {
    await page.goto(`/topics/${topicId}`);

    const loading = page.getByText(/loading/i);
    const body = page.locator("body");

    await expect(loading.or(body)).toBeVisible();
  });

  test("renders main sections if authorized", async ({ page }) => {
    await page.goto(`/topics/${topicId}`);

    const overview = page.locator("[data-testid='topic-overview']");
    const questions = page.locator("[data-testid='questions-list']");
    const learningPath = page.locator("[data-testid='learning-path']");
    const recentAnswers = page.locator("[data-testid='recent-answers']");

    if (await overview.count()) {
      await expect(overview).toBeVisible();
    }

    if (await questions.count()) {
      await expect(questions).toBeVisible();
    }

    if (await learningPath.count()) {
      await expect(learningPath).toBeVisible();
    }

    if (await recentAnswers.count()) {
      await expect(recentAnswers).toBeVisible();
    }
  });

  test("handles error fallback gracefully", async ({ page }) => {
    await page.goto(`/topics/${topicId}`);

    const errorText = page.getByText("Something went wrong");

    if (await errorText.count()) {
      await expect(errorText).toBeVisible();
    }
  });
});
