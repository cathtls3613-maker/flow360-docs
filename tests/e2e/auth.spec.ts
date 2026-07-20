import { expect, test } from "@playwright/test";

/**
 * Auth screen tests that run WITHOUT a Supabase project: they verify
 * rendering, navigation, and route protection. Full sign-up/sign-in
 * journeys require a live database and run once one is connected (see
 * the skipped test at the bottom).
 */

test.describe("Sign in page", () => {
  test("renders the sign-in form", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: /welcome back/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in/i })).toBeVisible();
  });

  test("links to workspace creation", async ({ page }) => {
    await page.goto("/login");
    await page
      .getByRole("link", { name: /create your company workspace/i })
      .click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe("Sign up page", () => {
  test("renders the workspace creation form", async ({ page }) => {
    await page.goto("/signup");

    await expect(
      page.getByRole("heading", { name: /create your company workspace/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/your name/i)).toBeVisible();
    await expect(page.getByLabel(/company name/i)).toBeVisible();
    await expect(page.getByLabel(/work email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });
});

test.describe("Route protection", () => {
  test("redirects signed-out visitors from the dashboard to sign-in", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Landing page entry points", () => {
  test("header links reach the auth screens", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /get started/i }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

// Runs only when a live Supabase project is configured for the test
// environment — the full journey: create workspace, sign in, dashboard.
test.describe("Full auth journey (requires Supabase)", () => {
  test.skip(
    !process.env.NEXT_PUBLIC_SUPABASE_URL,
    "Set NEXT_PUBLIC_SUPABASE_URL to run the full journey",
  );

  test("signs up, signs in, and reaches the dashboard", async ({ page }) => {
    const unique = Date.now();
    const email = `e2e+${unique}@flow360.example`;
    const password = `E2e-pass-${unique}`;

    await page.goto("/signup");
    await page.getByLabel(/your name/i).fill("E2E Tester");
    await page.getByLabel(/company name/i).fill(`E2E Test Co ${unique}`);
    await page.getByLabel(/work email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /create workspace/i }).click();

    // Depending on project settings we land on the dashboard directly
    // or are asked to confirm email first.
    await expect(
      page
        .getByRole("heading", { name: /welcome/i })
        .or(page.getByRole("heading", { name: /check your email/i })),
    ).toBeVisible();
  });
});
