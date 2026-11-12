import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import SalesmanDashboard from "./SalesmanDashboard";
import { useDashboardSalesman } from "../../hooks/useDashboard";
import { renderWithProviders } from "../../test/renderWithProviders";

const refresh = vi.fn();

vi.mock("../../hooks/useDashboard", () => ({
  useDashboardSalesman: vi.fn(),
}));

beforeEach(() => vi.clearAllMocks());

describe("SalesmanDashboard", () => {
  it("renders the heading with data", () => {
    useDashboardSalesman.mockReturnValue({
      data: { total_revenue: 120, invoices_count: 2, total_meters: 8 },
      isLoading: false,
      isError: false,
      refresh,
    });
    renderWithProviders(<SalesmanDashboard />);
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });

  it("renders while loading", () => {
    useDashboardSalesman.mockReturnValue({ data: undefined, isLoading: true, refresh });
    const { container } = renderWithProviders(<SalesmanDashboard />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
