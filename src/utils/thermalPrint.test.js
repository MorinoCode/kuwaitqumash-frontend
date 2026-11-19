import { describe, it, expect } from "vitest";
import { buildThermalReceiptHtml } from "./thermalPrint";

describe("thermalPrint", () => {
  it("builds an 80mm RTL receipt in Persian/Arabic and escapes HTML", () => {
    const html = buildThermalReceiptHtml(
      {
        invoice_number: "INV-2026-001",
        total_amount: 42.5,
        total_discount: 2.5,
        customer: { full_name: "<script>alert(1)</script>", phone: "96550001111" },
        items: [
          {
            item_name: "Italian Silk",
            meters_sold: 4.5,
            subtotal: 45,
          },
        ],
        payments: [{ method: "K-Net", amount: 42.5 }],
      },
      { lang: "fa", storeName: "Parche Store" },
    );

    expect(html).toContain("size: 80mm auto");
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("INV-2026-001");
    expect(html).toContain("42.500");
    expect(html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(html).not.toContain("<script>alert(1)</script>");
  });

  it("prints InvoiceItem total_price correctly without falling back to 0.000", () => {
    // Matches database InvoiceItem model structure (total_price, meters, price_per_meter, quantity)
    const html = buildThermalReceiptHtml(
      {
        invoice_number: "INV-2026-002",
        total_amount: 75.0,
        total_discount: 0,
        items: [
          {
            item_name: "Japanese Wool",
            meters: "15.000",
            quantity: 1,
            price_per_meter: "5.000",
            total_price: "75.000",
            color: "Navy",
          },
        ],
        payments: [{ method: "Cash", amount: 75.0 }],
      },
      { lang: "en" },
    );

    expect(html).toContain("Japanese Wool (Navy)");
    expect(html).toContain("15.00m");
    expect(html).toContain("75.000");
    expect(html).toContain("@ 5.000 /m");
    expect(html).not.toContain("0.000");
  });

  it("displays both quantity and meters when qty > 1 and meters > 0", () => {
    const html = buildThermalReceiptHtml(
      {
        invoice_number: "INV-2026-003",
        total_amount: 120.0,
        items: [
          {
            item_name: "Cotton Roll",
            meters: "50.000",
            quantity: 2,
            price_per_meter: "2.400",
            total_price: "120.000",
          },
        ],
        payments: [{ method: "K-Net", amount: 120.0, reference_number: "REF123456" }],
      },
      { lang: "ar" },
    );

    expect(html).toContain("2x 50.00م");
    expect(html).toContain("120.000");
    expect(html).toContain("REF123456");
  });

  it("uses item_name_ar when available in Arabic language mode", () => {
    const html = buildThermalReceiptHtml(
      {
        invoice_number: "INV-2026-004",
        total_amount: 30.0,
        items: [
          {
            item_name: "Linen",
            item_name_ar: "كتان إيطالي",
            meters: "6.000",
            quantity: 1,
            total_price: "30.000",
          },
        ],
      },
      { lang: "ar" },
    );

    expect(html).toContain("كتان إيطالي");
    expect(html).toContain("30.000");
  });

  it("defaults to Arabic language and renders storeName at top and bottom without KuwaitQumash", () => {
    const html = buildThermalReceiptHtml(
      {
        invoice_number: "INV-2026-005",
        total_amount: 50.0,
        items: [
          {
            item_name: "Silk",
            item_name_ar: "حرير طبيعي",
            meters: "10.000",
            total_price: "50.000",
          },
        ],
      },
      { storeName: "متجر البركة للأقمشة" },
    );

    expect(html).toContain('lang="ar"');
    expect(html).toContain('dir="rtl"');
    expect(html).toContain("فاتورة");
    expect(html).toContain("متجر البركة للأقمشة");
    expect(html).toContain('<div class="brand-tag">متجر البركة للأقمشة</div>');
    expect(html).not.toContain("KuwaitQumash");
  });
});
