import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import ManagerDashboard from "./ManagerDashboard";
import { useDashboardManager } from "../../hooks/useDashboard";
import { renderWithProviders } from "../../test/renderWithProviders";

const refresh = vi.fn();

vi.mock("../../hooks/useDashboard", () => ({
  useDashboardManager: vi.fn(),
}));

const data = {
  total_revenue: 800,
  total_profit: 200,
  total_meters: 60,
  invoices_count: 3,
  top_items: [{ id: 1, name: "Silk", revenue: 300 }],
};

beforeEach(() => vi.clearAllMocks());

describe("ManagerDashboard", () => {
  it("renders the heading", () => {
    useDashboardManager.mockReturnValue({ data, isLoading: false, isError: false, refresh });
    renderWithProviders(<ManagerDashboard />);
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });

  it("renders while loading", () => {
    useDashboardManager.mockReturnValue({ data: undefined, isLoading: true, isError: false, refresh });
    const { container } = renderWithProviders(<ManagerDashboard />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("renders the error state", () => {
    useDashboardManager.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      refresh,
    });
    const { container } = renderWithProviders(<ManagerDashboard />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
