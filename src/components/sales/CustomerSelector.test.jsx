import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import CustomerSelector from "./CustomerSelector";
import { renderWithProviders } from "../../test/renderWithProviders";

const customersList = [
  { id: 1, full_name: "Sara Ali", phone: "9651111", type: "VIP", gender: "F" },
  { id: 2, full_name: "Ali Omar", phone: "9652222", type: "Regular", gender: "M" },
];

const setup = (props = {}) => {
  const handlers = {
    setCustomerSearch: vi.fn(),
    onSearchFocus: vi.fn(),
    onSearchBlur: vi.fn(),
    onSelectCustomer: vi.fn(),
    onClearCustomer: vi.fn(),
    onAddCustomer: vi.fn(),
  };
  const utils = renderWithProviders(
    <CustomerSelector
      selectedCustomer={null}
      customerSearch=""
      customersList={[]}
      showCustDropdown={false}
      {...handlers}
      {...props}
    />,
  );
  return { ...utils, handlers };
};

describe("CustomerSelector", () => {
  it("reports typed search text", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-search__input"), {
      target: { value: "sara" },
    });
    expect(handlers.setCustomerSearch).toHaveBeenCalledWith("sara");
  });

  it("lists matching customers", () => {
    const { container } = setup({ customersList, showCustDropdown: true });
    expect(container.querySelectorAll(".sales-dropdown__item")).toHaveLength(2);
    expect(container.textContent).toContain("9651111");
  });

  it("selects a customer from the dropdown", () => {
    const { container, handlers } = setup({ customersList, showCustDropdown: true });
    fireEvent.click(container.querySelectorAll(".sales-dropdown__item")[1]);
    expect(handlers.onSelectCustomer).toHaveBeenCalledWith(customersList[1]);
  });

  it("opens the new customer form", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-btn-add"));
    expect(handlers.onAddCustomer).toHaveBeenCalled();
  });

  it("shows the selected customer details read-only", () => {
    const { container } = setup({ selectedCustomer: customersList[0] });
    const inputs = [...container.querySelectorAll(".sales-customer__input")];
    expect(inputs.map((i) => i.value)).toEqual([
      "Sara Ali",
      "9651111",
      expect.any(String),
      "VIP",
      "-",
    ]);
    expect(inputs.every((i) => i.readOnly)).toBe(true);
  });

  it("clears the selected customer", () => {
    const { container, handlers } = setup({ selectedCustomer: customersList[0] });
    fireEvent.click(container.querySelector(".sales-btn-icon--danger"));
    expect(handlers.onClearCustomer).toHaveBeenCalled();
  });
});
