import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "../../api/axios";
import CustomerDetailPage from "./CustomerDetailPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const stableCustomer = {
  customer: {
    id: 3,
    full_name: "Sara Ali",
    phone: "9651111",
    address: "Kuwait City",
    gender: "F",
    type: "VIP",
    notes: "",
    createdAt: "2026-01-01T00:00:00Z",
  },
  invoices: [],
  stats: { total_spent: 0, invoice_count: 0 },
};

const stableResult = { data: stableCustomer, isLoading: false, refetch: () => {} };

vi.mock("../../hooks/useCustomers", () => ({
  useCustomer: () => stableResult,
  useUpdateCustomer: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useDeleteCustomer: () => ({ mutateAsync: vi.fn(), isPending: false }),
}));

const setup = () =>
  renderWithProviders(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={["/customers/3"]}>
        <Routes>
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ data: { success: true, data: { analysis: {} } } });
});

describe("CustomerDetailPage", () => {
  it("shows the customer name", () => {
    const { container } = setup();
    expect(container.textContent).toContain("Sara Ali");
  });

  it("shows the customer phone", () => {
    const { container } = setup();
    expect(container.textContent).toContain("9651111");
  });

  it("loads the customer analytics", async () => {
    setup();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining("/customers/3/analytics"),
      ),
    );
  });
});
