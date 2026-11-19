import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import api from "../../api/axios";
import StaffDetailsPage from "./StaffDetailsPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner" } }),
}));

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/manage/staff/2"]}>
      <Routes>
        <Route path="/manage/staff/:id" element={<StaffDetailsPage />} />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation((url) => {
    if (url.endsWith("/analytics")) {
      return Promise.resolve({ data: { success: true, data: { analysis: {} } } });
    }
    return Promise.resolve({
      data: {
        data: {
          staff: {
            id: 2,
            full_name: "Noura",
            username: "noura",
            role: "sales_man",
            is_active: true,
            branch_id: 1,
            branch: { name: "Main" },
            created_at: "2026-01-01T00:00:00Z",
          },
          history: [],
          stats: { total_sales: 0, total_invoices: 0, total_meters: 0, total_customers: 0 },
        },
      },
    });
  });
});

describe("StaffDetailsPage", () => {
  it("loads the staff member", async () => {
    setup();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/manage/staff/2"),
    );
  });

  it("shows the staff name", async () => {
    const { container } = setup();
    await waitFor(() => expect(container.textContent).toContain("Noura"));
  });

  it("requests the staff analytics", async () => {
    setup();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/manage/staff/2/analytics"),
    );
  });

  it("renders a loader first", () => {
    const { container } = setup();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });
});
