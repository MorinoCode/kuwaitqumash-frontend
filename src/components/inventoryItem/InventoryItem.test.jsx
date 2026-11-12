import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import InventoryItem from "./InventoryItem";
import { renderWithProviders } from "../../test/renderWithProviders";

const item = {
  id: 7,
  item_name: "Silk Roll",
  barcode: "SI-777",
  fabric_type: "Silk",
  pattern: "Plain",
  color: "Black",
  composition: "100% Silk",
  length_m: 12.5,
  quantity: 3,
  cost_per_meter: "1.5",
};

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
};

const setup = (overrides = {}) => {
  const props = {
    item,
    calculateLivePrice: () => "2.500",
    calculateProfit: () => "1.000",
    onDelete: vi.fn(),
    onPrint: vi.fn(),
    onEdit: vi.fn(),
    theme: "dark",
    ...overrides,
  };
  const utils = renderWithProviders(
    <MemoryRouter initialEntries={["/inventory"]}>
      <Routes>
        <Route
          path="*"
          element={
            <table>
              <tbody>
                <InventoryItem {...props} />
              </tbody>
              <LocationProbe />
            </table>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
  return { ...utils, props };
};

describe("InventoryItem", () => {
  it("renders the item details", () => {
    setup();
    expect(screen.getByText("Silk Roll")).toBeInTheDocument();
    expect(screen.getByText("SI-777")).toBeInTheDocument();
    expect(screen.getByText("12.5")).toBeInTheDocument();
  });

  it("navigates to the item page when the row is clicked", () => {
    const { container } = setup();
    fireEvent.click(container.querySelector("tr"));
    expect(screen.getByTestId("path").textContent).toBe("/inventory/item/7");
  });

  it("calls onEdit without navigating", () => {
    const { props, container } = setup();
    fireEvent.click(container.querySelectorAll(".inventory-item__action-btn")[1]);
    expect(props.onEdit).toHaveBeenCalledWith(item);
    expect(screen.getByTestId("path").textContent).toBe("/inventory");
  });

  it("calls onDelete with the item id", () => {
    const { props, container } = setup();
    fireEvent.click(container.querySelector(".inventory-item__action-btn--delete"));
    expect(props.onDelete).toHaveBeenCalledWith(7);
  });

  it("calls onPrint with the item", () => {
    const { props, container } = setup();
    fireEvent.click(container.querySelectorAll(".inventory-item__action-btn")[0]);
    expect(props.onPrint).toHaveBeenCalledWith(item);
  });

  it("shows a negative profit in red", () => {
    const { container } = setup({ calculateProfit: () => "-0.500" });
    expect(container.querySelector(".inventory-item__profit--neg")).toBeInTheDocument();
  });

  it("shows a positive profit in green", () => {
    const { container } = setup();
    expect(container.querySelector(".inventory-item__profit--pos")).toBeInTheDocument();
  });
});
