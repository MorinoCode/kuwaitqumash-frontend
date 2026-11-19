import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import Cart from "./Cart";
import { renderWithProviders } from "../../test/renderWithProviders";

const cart = [
  {
    id: 1,
    item_name: "Silk Roll",
    item_name_ar: "لفة حرير",
    barcode: "SI-1",
    unit: "meter",
    cartQty: 2,
    meters: 3,
    quantity: 10,
    price_per_meter: 2,
    discount: 0,
    total_price: 12,
  },
];

const setup = (props = {}) => {
  const handlers = { onUpdateItem: vi.fn(), onRemoveItem: vi.fn() };
  const utils = renderWithProviders(
    <Cart cart={cart} {...handlers} {...props} />,
  );
  return { ...utils, handlers };
};

describe("Cart", () => {
  it("shows the item count", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-card__title").textContent).toContain("1");
  });

  it("renders the item name and barcode", () => {
    const { container } = setup();
    expect(container.textContent).toContain("Silk Roll");
    expect(container.textContent).toContain("SI-1");
  });

  it("shows the computed line total in meters", () => {
    const { container } = setup();
    expect(container.textContent).toContain("6");
  });

  it("updates the quantity", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-cart__input--qty"), {
      target: { value: "3" },
    });
    expect(handlers.onUpdateItem).toHaveBeenCalledWith(1, "cartQty", 3);
  });

  it("ignores a zero quantity", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-cart__input--qty"), {
      target: { value: "0" },
    });
    expect(handlers.onUpdateItem).not.toHaveBeenCalled();
  });

  it("accepts an empty quantity field", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-cart__input--qty"), {
      target: { value: "" },
    });
    expect(handlers.onUpdateItem).toHaveBeenCalledWith(1, "cartQty", "");
  });

  it("updates the meters", () => {
    const { container, handlers } = setup();
    const meters = container.querySelectorAll('input[type="number"]')[1];
    fireEvent.change(meters, { target: { value: "4.5" } });
    expect(handlers.onUpdateItem).toHaveBeenCalledWith(1, "meters", "4.5");
  });

  it("rejects a negative price", () => {
    const { container, handlers } = setup();
    const price = container.querySelectorAll('input[type="number"]')[2];
    fireEvent.change(price, { target: { value: "-2" } });
    expect(handlers.onUpdateItem).not.toHaveBeenCalled();
  });

  it("warns when the quantity exceeds stock", () => {
    const { container } = setup({
      cart: [{ ...cart[0], cartQty: 20 }],
    });
    expect(container.querySelector(".sales-cart__row--warning")).toBeInTheDocument();
    expect(container.querySelector(".sales-cart__stock-warning")).toBeInTheDocument();
  });

  it("removes an item", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-btn-icon--danger"));
    expect(handlers.onRemoveItem).toHaveBeenCalledWith(1);
  });

  it("shows the empty state", () => {
    const { container } = setup({ cart: [] });
    expect(container.querySelectorAll(".sales-cart__empty").length).toBeGreaterThan(0);
  });

  it("renders the mobile list alongside the table", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-cart__mobile-item")).toBeInTheDocument();
  });
});
