import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import api from "../../api/axios";
import TopItemsTable from "./TopItemsTable";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn() },
}));

const items = [
  { id: 1, name: "Silk", category: "Fabric", fabric_type: "Silk", revenue: 500, profit: 100, quantity: 3, meters: 12.5 },
  { id: 2, name: "Cotton", category: "Fabric", fabric_type: "Cotton", revenue: 900, profit: 250, quantity: 8, meters: 40 },
];

const setup = () =>
  renderWithProviders(
    <TopItemsTable
      dateRange={{ start: "2026-01-01", end: "2026-01-31" }}
      selectedBranches={[1]}
      theme="dark"
      metricType="revenue"
    />,
  );

beforeEach(() => vi.clearAllMocks());

describe("TopItemsTable", () => {
  it("loads the top items from the dashboard endpoint", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: items } });
    setup();

    await waitFor(() =>
      expect(document.querySelectorAll("tbody tr")).toHaveLength(2),
    );
    expect(api.get).toHaveBeenCalledWith("/dashboard/top-items", {
      params: expect.objectContaining({ branchIds: "1", metric: "revenue", limit: 10 }),
    });
  });

  it("sorts by revenue descending by default", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: items } });
    const { container } = setup();

    await waitFor(() => expect(container.querySelectorAll("tbody tr")).toHaveLength(2));
    const firstRowCells = container.querySelectorAll("tbody tr")[0].querySelectorAll("td");
    expect(firstRowCells[0].textContent).toContain("Cotton");
  });

  it("flips the sort direction when a header is clicked twice", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: items } });
    const { container } = setup();
    await waitFor(() => expect(container.querySelectorAll("tbody tr")).toHaveLength(2));

    const revenueHeader = [...container.querySelectorAll("th")].find((th) =>
      th.textContent.includes("↑") || th.textContent.includes("↓"),
    );
    fireEvent.click(revenueHeader);

    const firstRow = container.querySelectorAll("tbody tr")[0];
    expect(firstRow.textContent).toContain("Silk");
  });

  it("shows the empty state when there is no data", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: [] } });
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelector(".no-data-state")).toBeInTheDocument(),
    );
  });

  it("keeps the table empty when the request fails", async () => {
    api.get.mockRejectedValue(new Error("boom"));
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelector(".no-data-state")).toBeInTheDocument(),
    );
  });

  it("refetches with a larger limit", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: items } });
    setup();
    await waitFor(() =>
      expect(document.querySelectorAll("tbody tr")).toHaveLength(2),
    );

    fireEvent.change(document.querySelector(".limit-select"), { target: { value: "50" } });
    await waitFor(() =>
      expect(api.get.mock.calls.at(-1)[1].params.limit).toBe(50),
    );
  });
});
