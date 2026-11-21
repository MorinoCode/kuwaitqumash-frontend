import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "../../i18n";
import api from "../../api/axios";
import SalesPage from "./SalesPage";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
  apiBaseURL: "http://localhost:5000/api",
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "sales_man" } }),
}));

vi.mock("../../context/ThemeContext", () => ({
  useTheme: () => ({ theme: "dark", toggleTheme: vi.fn() }),
}));

const renderPage = () =>
  render(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <SalesPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ data: { data: [], success: true } });
});

describe("SalesPage", () => {
  it("renders the new sale header", async () => {
    const { container } = renderPage();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(container.querySelector(".sales-header__title")).toBeInTheDocument();
  });

  it("renders the cart and payment sections", async () => {
    const { container } = renderPage();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    expect(container.querySelector(".sales-cart")).toBeInTheDocument();
    expect(container.querySelector(".sales-payment")).toBeInTheDocument();
  });

  it("loads reference data on mount", async () => {
    renderPage();
    await waitFor(() => expect(api.get).toHaveBeenCalled());
  });
});
