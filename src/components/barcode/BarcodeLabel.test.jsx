import { describe, it, expect } from "vitest";
import { BarcodeLabel } from "./BarcodeLabel";
import { renderWithProviders } from "../../test/renderWithProviders";

const item = {
  item_name: "Silk Roll",
  item_name_ar: "لفة حرير",
  length_m: "12.3456",
  fabric_type: "Silk",
  color: "Black",
  pattern: "Plain",
  country_of_origin: "Italy",
  composition: "100% Silk",
  barcode: "SI-1234",
};

describe("BarcodeLabel", () => {
  it("renders nothing without an item", () => {
    const { container } = renderWithProviders(<BarcodeLabel item={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the item name and barcode text", () => {
    renderWithProviders(<BarcodeLabel item={item} />);
    expect(document.querySelector(".barcode-label__item-name-full").textContent).toBe(
      "Silk Roll",
    );
    expect(document.querySelector(".barcode-label__code").textContent).toBe("SI-1234");
  });

  it("formats the length with three decimals", () => {
    renderWithProviders(<BarcodeLabel item={item} />);
    expect(document.querySelector(".barcode-label__weight").textContent).toContain(
      "12.346",
    );
  });

  it("falls back to NOCODE for a missing barcode", () => {
    renderWithProviders(<BarcodeLabel item={{ ...item, barcode: "" }} />);
    expect(document.querySelector(".barcode-label__code").textContent).toBe("NOCODE");
  });

  it("shows the shop name only when requested", () => {
    const { container, rerender } = renderWithProviders(
      <BarcodeLabel item={item} shopName="KuwaitQumash" />,
    );
    expect(container.querySelector(".barcode-label__shop-name")).toBeNull();

    rerender(<BarcodeLabel item={item} shopName="KuwaitQumash" showShopName />);
    expect(
      container.querySelector(".barcode-label__shop-name").textContent,
    ).toBe("KuwaitQumash");
  });

  it("prints the country code in three letters", () => {
    renderWithProviders(<BarcodeLabel item={item} />);
    expect(document.querySelector(".barcode-label__country").textContent).toBe("ITA");
  });

  it("renders an svg barcode", () => {
    renderWithProviders(<BarcodeLabel item={item} />);
    expect(document.querySelector(".barcode-label__barcode-wrapper svg")).toBeTruthy();
  });
});
