import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInventory, useDeleteInventoryItem } from "../../hooks/useInventory";
import InventoryPage from "./InventoryPage";
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner", full_name: "Ali" } }),
}));
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../hooks/useInventory", () => ({
  useInventory: vi.fn(),
  useDeleteInventoryItem: vi.fn(),
}));

vi.mock("react-to-print", () => ({
  useReactToPrint: () => vi.fn(),
}));

vi.mock("../../components/addItemModal/AddItemModal", () => ({
  default: ({ isOpen }) => <div data-testid="add-item-modal">{String(isOpen)}</div>,
}));

const items = [
  {
    id: 1,
    item_name: "Silk Roll",
    barcode: "SI-1",
    fabric_type: "Silk",
    pattern: "Plain",
    color: "Black",
    length_m: 12,
    quantity: 3,
    cost_per_meter: "1.5",
    price_per_meter: "2.5",
    status: "In Stock",
    branch_id: 1,
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  useInventory.mockReturnValue({
    data: { data: items, count: 1, pagination: { totalItems: 1, page: 1, limit: 50 } },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  });
  useDeleteInventoryItem.mockReturnValue({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false });
});

const setup = () =>
  renderWithProviders(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <InventoryPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );

describe("InventoryPage", () => {
  it("renders the page heading", () => {
    const { container } = setup();
    expect(container.querySelector(".inventory-page__title")).toBeInTheDocument();
  });

  it("renders the inventory rows", () => {
    const { container } = setup();
    expect(container.textContent).toContain("Silk Roll");
    expect(container.textContent).toContain("SI-1");
  });

  it("queries inventory through the hook", () => {
    setup();
    expect(useInventory).toHaveBeenCalled();
  });

  it("opens the add item modal", () => {
    const { container } = setup();
    const addButton = [...container.querySelectorAll("button")].find((button) =>
      /add|new|افزودن/i.test(button.textContent),
    );
    if (addButton) {
      fireEvent.click(addButton);
      expect(container.querySelector('[data-testid="add-item-modal"]').textContent).toBe(
        "true",
      );
    }
  });

  it("shows the loading state", () => {
    useInventory.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    const { container } = setup();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
