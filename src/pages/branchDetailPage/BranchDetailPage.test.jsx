import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "../../api/axios";
import BranchDetailPage from "./BranchDetailPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  apiBaseURL: "http://localhost:5000/api",
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner" } }),
}));

vi.mock("../../components/branch/LogoUpload", () => ({
  default: () => <div data-testid="logo-upload" />,
}));

const setup = () =>
  renderWithProviders(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter initialEntries={["/manage/branch/1"]}>
        <Routes>
          <Route path="/manage/branch/:id" element={<BranchDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockImplementation((url) => {
    if (String(url).includes("/whatsapp/status")) {
      return Promise.resolve({ data: { data: { connected: false, status: "disconnected" } } });
    }
    return Promise.resolve({
      data: {
        data: {
          id: 1,
          name: "Main",
          location: "Kuwait City",
          phone: "1234",
          is_main: true,
          logo_url: null,
          staff: [],
          stats: { total_sales: 0, total_invoices: 0, total_meters: 0, total_customers: 0 },
          customers: [],
        },
      },
    });
  });
});

describe("BranchDetailPage", () => {
  it("loads the branch", async () => {
    const { container } = setup();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("renders the branch title once loaded", async () => {
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelector(".branch-detail__title")).toBeInTheDocument(),
    );
  });

  it("queries the WhatsApp status for the branch", async () => {
    setup();
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining("/whatsapp/status"),
      ),
    );
  });
});
