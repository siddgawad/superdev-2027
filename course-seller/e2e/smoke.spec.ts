import { test, expect } from "@playwright/test";

test("home renders", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await expect(page).toHaveTitle(/(Next|Course|App)/i);
});
