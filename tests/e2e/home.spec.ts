import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("shows the FLOW360 landing page", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/FLOW360/);
    await expect(
      page.getByRole("heading", {
        name: /AI Operating System for Industrial Equipment Distributors/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Smart Costing")).toBeVisible();
    await expect(page.getByText("Executive Dashboard")).toBeVisible();
  });

  test("switches to dark mode", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /toggle theme/i }).click();
    await page.getByRole("menuitem", { name: /dark/i }).click();

    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("shows the 404 page for unknown URLs", async ({ page }) => {
    await page.goto("/this-page-does-not-exist");

    await expect(
      page.getByRole("heading", { name: /page not found/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /back to home/i }),
    ).toBeVisible();
  });
});
