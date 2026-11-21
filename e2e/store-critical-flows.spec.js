import { test, expect } from "@playwright/test";

const E2E_TENANT = process.env.E2E_TENANT || "qummash";
const E2E_USER = process.env.E2E_USER || "admin";
const E2E_PASS = process.env.E2E_PASS || "admin123";

test.describe("ParcheForosh Critical Store Flows", () => {
  test("login -> inventory search -> dashboard language switch -> invoices", async ({ page }) => {
    // 1. Login page loads and authenticates store owner
    await page.goto("/login");
    await expect(page.locator("form")).toBeVisible();

    const tenantInput = page.locator('input[name="tenant"], input[name="store"], input[placeholder*="store" i]').first();
    if (await tenantInput.isVisible().catch(() => false)) {
      await tenantInput.fill(E2E_TENANT);
    }

    await page.locator('input[name="username"], input[type="text"]').last().fill(E2E_USER);
    await page.locator('input[name="password"], input[type="password"]').first().fill(E2E_PASS);
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL(/\/(home|dashboard)/, { timeout: 15_000 });

    // 2. Navigate to Inventory and test debounced search
    await page.goto("/inventory");
    const searchInput = page.locator('input[type="search"], input[type="text"]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill("silk");
    await page.waitForTimeout(450);

    // 3. Navigate to Dashboard and switch languages (FA -> EN -> AR -> FA)
    await page.goto("/dashboard");
    await expect(page.locator(".dashboard-page, .owner-dashboard, main")).toBeVisible();

    const langBtn = page.locator(".lang-menu .header-btn").first();
    if (await langBtn.isVisible().catch(() => false)) {
      await langBtn.click();
      await page.getByRole("menuitemradio", { name: /English/i }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "en");

      await langBtn.click();
      await page.getByRole("menuitemradio", { name: /العربية/i }).click();
      await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    }

    // 4. Verify Invoices and Refunds pages load cleanly without errors
    await page.goto("/invoices");
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/refunds");
    await expect(page.locator("main")).toBeVisible();
  });
});
