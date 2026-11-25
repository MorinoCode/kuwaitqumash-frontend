import { test, expect } from "@playwright/test";

const E2E_TENANT = process.env.E2E_TENANT || "qa-beta-test";
const E2E_OWNER_USER = process.env.E2E_OWNER_USER || "qaowner";
const E2E_OWNER_PASS = process.env.E2E_OWNER_PASS || "NewPassword123!";
const E2E_SALES_USER = process.env.E2E_SALES_USER || "qasales";
const E2E_SALES_PASS = process.env.E2E_SALES_PASS || "Password123!";

function attachStrictErrorMonitors(page) {
  const consoleErrors = [];
  const pageErrors = [];
  const serverErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });
  page.on("pageerror", (err) => {
    pageErrors.push(err.message || String(err));
  });
  page.on("response", (res) => {
    if (res.status() >= 500) {
      serverErrors.push(`${res.status()} ${res.request().method()} ${res.url()}`);
    }
  });

  return {
    assertClean: ({ ignoreAuthMe400 = false } = {}) => {
      const filteredConsole = ignoreAuthMe400
        ? consoleErrors.filter((m) => !m.includes("status of 400"))
        : consoleErrors;
      expect(pageErrors, `Uncaught page errors:\n${pageErrors.join("\n")}`).toEqual([]);
      expect(serverErrors, `HTTP 5xx server errors:\n${serverErrors.join("\n")}`).toEqual([]);
      expect(filteredConsole, `Console errors:\n${filteredConsole.join("\n")}`).toEqual([]);
    },
  };
}

async function loginAs(page, { tenant = E2E_TENANT, username, password }) {
  await page.goto("/login");
  const inputs = page.locator("form input");
  await expect(inputs.nth(0)).toBeVisible();
  await inputs.nth(0).fill(tenant);
  await inputs.nth(1).fill(username);
  await inputs.nth(2).fill(password);
  await page.locator('button[type="submit"]').click();
  await expect(page).toHaveURL(/\/(home|dashboard)/, { timeout: 15_000 });
}

test.describe("ParcheForosh Pre-Launch Full E2E Suite", () => {
  test.setTimeout(90_000);

  test("1. Public pages, permanent /signup -> /contact lock, and auth redirect", async ({ page }) => {
    const monitor = attachStrictErrorMonitors(page);

    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();

    // /signup must permanently redirect to /contact
    await page.goto("/signup");
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.locator("form")).toBeVisible();

    // Legal pages load cleanly
    await page.goto("/privacy");
    await expect(page.locator("h1").first()).toBeVisible();
    await page.goto("/terms");
    await expect(page.locator("h1").first()).toBeVisible();

    // Protected route redirects unauthenticated user to /login
    await page.goto("/sales");
    await expect(page).toHaveURL(/\/login$/);

    // Note: visiting /sales without tenant_id triggers an expected 400 on /api/auth/me before redirect
    monitor.assertClean({ ignoreAuthMe400: true });
  });

  test("2. Full Store Owner Flow: Login -> Dashboard (3 langs) -> POS Sale -> Instant Cache Sync -> Logo Preview -> Help -> Change Password -> Logout", async ({
    page,
  }) => {
    const monitor = attachStrictErrorMonitors(page);

    await loginAs(page, { username: E2E_OWNER_USER, password: E2E_OWNER_PASS });

    // Home page has 8 cards including Refunds & Manage
    await page.goto("/home");
    await expect(page.locator(".dashboard-card")).toHaveCount(8);

    // /analytics redirects cleanly to /dashboard
    await page.goto("/analytics");
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.locator(".dashboard-page")).toBeVisible();

    // Language switch cycle: EN -> AR -> FA
    const langBtn = page.locator(".lang-menu .header-btn").first();
    await langBtn.click();
    await page.getByRole("menuitemradio", { name: /English/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    await langBtn.click();
    await page.getByRole("menuitemradio", { name: /العربية/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await langBtn.click();
    await page.getByRole("menuitemradio", { name: /فارسی/i }).click();
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    // Inventory page & debounced search
    await page.goto("/inventory");
    await expect(page.getByText("Italian Silk Gold").first()).toBeVisible();

    // POS Sale Flow (without page reload afterward to verify cache sync!)
    await page.goto("/sales");
    const itemSearch = page.locator(".sales-search input.sales-search__input").first();
    await itemSearch.click();
    await itemSearch.fill("Italian Silk");
    await page.waitForTimeout(350);
    await page.locator(".sales-search .sales-dropdown__item").first().click();

    // Select customer
    const custSearch = page.locator(".sales-customer input.sales-search__input").first();
    await custSearch.click();
    await custSearch.fill("Ahmad");
    await page.waitForTimeout(350);
    await page.locator(".sales-customer .sales-dropdown__item").first().click();

    // Complete sale
    const completeBtn = page.locator("button.sales-btn--large.sales-btn--primary").first();
    await expect(completeBtn).toBeEnabled();
    const saleResponsePromise = page.waitForResponse(
      (res) => res.url().includes("/api/sales/create") && res.request().method() === "POST"
    );
    await completeBtn.click();
    const saleRes = await saleResponsePromise;
    expect(saleRes.status()).toBe(201);
    const saleJson = await saleRes.json();
    const createdInvNumber = saleJson?.data?.invoice?.invoice_number;
    expect(createdInvNumber).toBeTruthy();

    // InvoicePreviewModal opens with invoice number
    await expect(page.locator(".sales-modal")).toBeVisible();
    await expect(page.locator(".sales-modal")).toContainText(createdInvNumber);

    // Close preview modal
    await page.locator(".sales-modal__close").click();
    await expect(page.locator(".sales-modal")).toBeHidden();

    // Navigate via SPA sidebar/link (NO reload!) to /invoices -> new invoice MUST appear immediately
    await page.locator(".hamburger-btn").click();
    await page.locator("a[href='/invoices']").first().click();
    await expect(page).toHaveURL(/\/invoices$/);
    await expect(page.getByText(createdInvNumber).first()).toBeVisible({ timeout: 10_000 });

    // Branch Logo preview loads real uploaded PNG from backend /uploads/
    await page.goto("/manage");
    await page.locator(".manage-card--main, .manage-card--clickable").first().click();
    await expect(page).toHaveURL(/\/manage\/branch\/\d+$/);
    // Click Logo tab
    const logoTab = page.locator("button").filter({ hasText: /لوگو|Logo|الشعار/i }).first();
    await logoTab.click();
    const previewImg = page.locator(".logo-upload__preview-img");
    await expect(previewImg).toBeVisible();
    await expect
      .poll(async () => previewImg.evaluate((el) => el.complete && el.naturalWidth > 0))
      .toBe(true);

    // HelpAssistant works
    await page.locator(".header-btn--help").click();
    const helpInput = page.locator(".help-assistant input, .help-assistant textarea").first();
    await expect(helpInput).toBeVisible();
    await helpInput.fill("چطور فاکتور بزنم؟");
    await helpInput.press("Enter");
    await expect(page.locator(".help-assistant")).toContainText(/فروش|فاکتور/);
    // Close HelpAssistant
    await page.locator(".header-btn--help").click();

    // Personal Change Password Modal works end-to-end without invalidating current session
    const pwdBtn = page.locator("button[aria-label*='Password' i], button[aria-label*='رمز'], button[aria-label*='كلمة']").first();
    await pwdBtn.click();
    await expect(page.locator(".pwd-modal")).toBeVisible();
    const pwdInputs = page.locator(".pwd-modal input");
    await pwdInputs.nth(0).fill(E2E_OWNER_PASS);
    await pwdInputs.nth(1).fill("TempBrowserPass123!");
    await pwdInputs.nth(2).fill("TempBrowserPass123!");
    await page.locator(".pwd-modal__btn--submit").click();
    await expect(page.locator(".pwd-modal")).toBeHidden({ timeout: 10_000 });

    // Change it back right away (proves the new session token returned by changePassword works!)
    await pwdBtn.click();
    await expect(page.locator(".pwd-modal")).toBeVisible();
    await pwdInputs.nth(0).fill("TempBrowserPass123!");
    await pwdInputs.nth(1).fill(E2E_OWNER_PASS);
    await pwdInputs.nth(2).fill(E2E_OWNER_PASS);
    await page.locator(".pwd-modal__btn--submit").click();
    await expect(page.locator(".pwd-modal")).toBeHidden({ timeout: 10_000 });

    // Logout
    await page.locator(".header-btn--logout").click();
    await expect(page).toHaveURL(/\/login$/);

    monitor.assertClean();
  });

  test("3. Salesman RBAC: /manage hidden & direct URL redirects to /home", async ({ page }) => {
    const monitor = attachStrictErrorMonitors(page);

    await loginAs(page, { username: E2E_SALES_USER, password: E2E_SALES_PASS });

    await page.goto("/home");
    // Manage card hidden (7 cards instead of 8)
    await expect(page.locator(".dashboard-card")).toHaveCount(7);

    // Direct navigation to /manage and /manage/branch/1 must redirect to /home
    await page.goto("/manage");
    await expect(page).toHaveURL(/\/home$/);

    await page.goto("/manage/branch/1");
    await expect(page).toHaveURL(/\/home$/);

    // Salesman dashboard, customers, refunds load cleanly
    await page.goto("/dashboard");
    await expect(page.locator(".dashboard-page")).toBeVisible();

    await page.goto("/customers");
    await expect(page.locator("main")).toBeVisible();

    await page.goto("/refunds");
    await expect(page.locator("main")).toBeVisible();

    monitor.assertClean();
  });

  test("4. Mobile viewport (390x844) layout & overflow check across all core pages", async ({ page }) => {
    const monitor = attachStrictErrorMonitors(page);
    await page.setViewportSize({ width: 390, height: 844 });

    await loginAs(page, { username: E2E_OWNER_USER, password: E2E_OWNER_PASS });

    const routes = ["/home", "/dashboard", "/inventory", "/sales", "/invoices", "/refunds", "/customers", "/manage"];
    const overflows = [];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(300);

      const metrics = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        bodyTextLen: (document.body.innerText || "").trim().length,
      }));

      expect(metrics.bodyTextLen, `Route ${route} rendered empty body`).toBeGreaterThan(20);
      if (metrics.scrollWidth > metrics.innerWidth + 8) {
        overflows.push(`${route}: scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`);
      }
    }

    expect(overflows, `Mobile horizontal overflow detected:\n${overflows.join("\n")}`).toEqual([]);
    monitor.assertClean();
  });
});
