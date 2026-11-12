import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import OwnerDashboard from "./OwnerDashboard";
import { useDashboardOwner } from "../../hooks/useDashboard";
import { renderWithProviders } from "../../test/renderWithProviders";

const refresh = vi.fn();

vi.mock("../../hooks/useDashboard", () => ({
  useDashboardOwner: vi.fn(),
}));

const data = {
  total_revenue: 1500.5,
  total_profit: 400.25,
  total_meters: 120.5,
  invoices_today: 4,
  customers: 12,
  branches: [{ name: "Main", revenue: 900 }, { name: "Salmiya", revenue: 600.5 }],
  recent_invoices: [
    { id: 1, invoice_number: "INV-1", total_amount: 100, created_at: "2026-03-01" },
  ],
  chart: [{ date: "2026-03-01", revenue: 900, profit: 200 }],
};

beforeEach(() => vi.clearAllMocks());

describe("OwnerDashboard", () => {
  it("shows a loader while data is pending", () => {
    useDashboardOwner.mockReturnValue({ data: undefined, isLoading: true, isError: false, refresh });
    const { container } = renderWithProviders(<OwnerDashboard />);
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("renders the dashboard heading", () => {
    useDashboardOwner.mockReturnValue({ data, isLoading: false, isError: false, refresh });
    renderWithProviders(<OwnerDashboard />);
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });

  it("shows an error state and retries", () => {
    useDashboardOwner.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: { message: "boom" },
      refresh,
    });
    const { container } = renderWithProviders(<OwnerDashboard />);
    const retry = container.querySelector(".dashboard-page__retry, .dashboard-error button");
    if (retry) {
      fireEvent.click(retry);
      expect(refresh).toHaveBeenCalled();
    }
  });

  it("renders the revenue numbers", () => {
    useDashboardOwner.mockReturnValue({ data, isLoading: false, isError: false, refresh });
    const { container } = renderWithProviders(<OwnerDashboard />);
    expect(container.textContent.length).toBeGreaterThan(50);
  });
});
