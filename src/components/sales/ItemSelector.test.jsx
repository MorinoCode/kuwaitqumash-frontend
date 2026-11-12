import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import ItemSelector from "./ItemSelector";
import { renderWithProviders } from "../../test/renderWithProviders";

const inventoryList = [
  { id: 1, item_name: "Silk Roll", item_name_ar: "لفة حرير", barcode: "SI-1", length_m: 10, fabric_type: "Silk", price_per_meter: "2.5" },
  { id: 2, item_name: "Cotton Roll", barcode: "CO-2", length_m: 5, price_per_meter: "1.25" },
];

const setup = (props = {}) => {
  const handlers = {
    setItemSearch: vi.fn(),
    onAddToCart: vi.fn(),
    onScanClick: vi.fn(),
    onAddItemClick: vi.fn(),
    onSearchFocus: vi.fn(),
    onSearchBlur: vi.fn(),
  };
  const utils = renderWithProviders(
    <ItemSelector
      itemSearch=""
      inventoryList={[]}
      showItemDropdown={false}
      itemInputRef={{ current: null }}
      {...handlers}
      {...props}
    />,
  );
  return { ...utils, handlers };
};

describe("ItemSelector", () => {
  it("reports what the user types", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-search__input"), {
      target: { value: "silk" },
    });
    expect(handlers.setItemSearch).toHaveBeenCalledWith("silk");
  });

  it("lists matching items when the dropdown is open", () => {
    const { container } = setup({ inventoryList, showItemDropdown: true });
    expect(container.querySelectorAll(".sales-dropdown__item")).toHaveLength(2);
    expect(container.textContent).toContain("SI-1");
    expect(container.textContent).toContain("2.500 KD/m");
  });

  it("adds an item to the cart", () => {
    const { container, handlers } = setup({ inventoryList, showItemDropdown: true });
    fireEvent.click(container.querySelectorAll(".sales-dropdown__item")[0]);
    expect(handlers.onAddToCart).toHaveBeenCalledWith(inventoryList[0]);
  });

  it("hides the dropdown when there is nothing to show", () => {
    const { container } = setup({ inventoryList: [], showItemDropdown: true });
    expect(container.querySelector(".sales-dropdown")).toBeNull();
  });

  it("triggers the scan and add-item buttons", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-search__scan-btn"));
    fireEvent.click(container.querySelector(".sales-search__add-item-btn"));
    expect(handlers.onScanClick).toHaveBeenCalled();
    expect(handlers.onAddItemClick).toHaveBeenCalled();
  });

  it("forwards focus and blur", () => {
    const { container, handlers } = setup();
    const input = container.querySelector(".sales-search__input");
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(handlers.onSearchFocus).toHaveBeenCalled();
    expect(handlers.onSearchBlur).toHaveBeenCalled();
  });
});
