import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";
import AnalyticsPage from "./AnalyticsPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner" } }),
}));

vi.mock("../../hooks/useBranches", () => ({
  useBranches: () => ({ data: [{ id: 1, name: "Main" }], isLoading: false }),
}));

vi.mock("../../context/BranchContext", () => ({
  useBranch: () => ({ activeBranchId: 1, branches: [{ id: 1, name: "Main" }] }),
}));

const payload = {
  success: true,
  data: {
    kpis: { revenue: 100, profit: 20, quantity: 5, invoices: 2 },
    revenue_chart: [{ date: "2026-03-01", revenue: 100, profit: 20, quantity: 5 }],
    category_chart: [{ name: "Cotton", revenue: 100, quantity: 5 }],
    branch_chart: [{ name: "Main", revenue: 100, quantity: 5 }],
    fabric_chart: [{ fabric_type: "Cotton", revenue: 100, quantity: 5 }],
    comparison: {},
  },
};

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ data: payload });
});

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <AnalyticsPage />
    </MemoryRouter>,
  );

describe("AnalyticsPage", () => {
  it("requests the analytics endpoint", async () => {
    setup();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/dashboard/analytics", expect.anything()),
    );
  });

  it("renders the analytics title", async () => {
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelector(".analytics-title")).toBeInTheDocument(),
    );
  });

  it("renders while loading", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    const { container } = setup();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("survives a failing request", async () => {
    api.get.mockRejectedValue(new Error("boom"));
    const { container } = setup();
    await waitFor(() => expect(container.innerHTML.length).toBeGreaterThan(0));
  });
});
