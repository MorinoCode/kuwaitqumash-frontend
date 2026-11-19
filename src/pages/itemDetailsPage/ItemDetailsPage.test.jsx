import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "../../api/axios";
import ItemDetailsPage from "./ItemDetailsPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  apiBaseURL: "http://localhost:5000/api",
}));

vi.mock("../../hooks/useInventory", () => ({
  useInventoryItem: () => ({
    data: {
      id: 1,
      item_name: "Silk Roll",
      barcode: "SI-1",
      fabric_type: "Silk",
      pattern: "Plain",
      color: "Black",
      length_m: 10,
      quantity: 2,
      cost_per_meter: "1.5",
      price_per_meter: "2.5",
      status: "In Stock",
    },
    isLoading: false,
    refetch: vi.fn(),
  }),
  useCustomOptions: () => ({ data: [] }),
  useDeleteInventoryItem: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdateInventoryItem: () => ({ mutate: vi.fn(), isPending: false }),
  useCreateInventoryItem: () => ({ mutate: vi.fn(), isPending: false }),
  useSaveCustomOption: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("react-to-print", () => ({ useReactToPrint: () => vi.fn() }));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner" } }),
}));

const setup = () =>
  renderWithProviders(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={["/inventory/item/1"]}>
        <Routes>
          <Route path="/inventory/item/:id" element={<ItemDetailsPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ data: { data: [], success: true } });
});

describe("ItemDetailsPage", () => {
  it("renders the item title", () => {
    const { container } = setup();
    expect(container.querySelector(".item-info__title")).toBeInTheDocument();
  });

  it("shows the item name", () => {
    const { container } = setup();
    expect(container.textContent).toContain("Silk Roll");
  });

  it("renders the item details without calling the API", () => {
    const { container } = setup();
    expect(container.textContent).toContain("SI-1");
    expect(api.get).not.toHaveBeenCalled();
  });
});
