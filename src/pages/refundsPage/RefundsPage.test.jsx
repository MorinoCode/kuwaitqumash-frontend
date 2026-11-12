import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import RefundsPage from "./RefundsPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../hooks/useBranches", () => ({
  useBranches: () => ({
    data: [{ id: 1, name: "Main" }, { id: 2, name: "Salmiya" }],
    isLoading: false,
  }),
}));

let role = "store_owner";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role } }),
}));

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
};

const refunds = [
  {
    id: 5,
    credit_note_number: "CN-5",
    invoice: { invoice_number: "INV-9" },
    createdAt: "2026-03-01T10:00:00Z",
    total_amount: "12.5",
    creator: { full_name: "Ali" },
  },
];

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/refunds"]}>
      <RefundsPage />
      <LocationProbe />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  role = "store_owner";
  global.URL.createObjectURL = vi.fn(() => "blob:refund");
  global.URL.revokeObjectURL = vi.fn();
});

describe("RefundsPage", () => {
  it("requests the refund list on mount", async () => {
    api.get.mockResolvedValue({ data: { data: refunds, pagination: { page: 1, totalItems: 1, limit: 20 } } });
    setup();
    await waitFor(() => expect(api.get).toHaveBeenCalledWith("/refunds", expect.anything()));
  });

  it("renders a refund row", async () => {
    api.get.mockResolvedValue({ data: { data: refunds, pagination: { page: 1, totalItems: 1 } } });
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelectorAll(".refunds-row").length).toBe(1),
    );
    expect(container.textContent).toContain("CN-5");
    expect(container.textContent).toContain("INV-9");
    expect(container.textContent).toContain("12.500");
  });

  it("shows the empty state", async () => {
    api.get.mockResolvedValue({ data: { data: [], pagination: {} } });
    const { container } = setup();
    await waitFor(() =>
      expect(container.querySelector(".refunds-empty")).toBeInTheDocument(),
    );
  });

  it("shows a toast when loading fails", async () => {
    api.get.mockRejectedValue({ response: { data: { message: "nope" } } });
    setup();
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("nope"));
  });

  it("navigates to the refund form", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    setup();
    await waitFor(() => expect(screen.getByTestId("path")).toBeInTheDocument());
    fireEvent.click(screen.getByText(/\+/));
    expect(screen.getByTestId("path").textContent).toBe("/refund");
  });

  it("applies a search filter", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { container } = setup();
    await waitFor(() => expect(api.get).toHaveBeenCalled());

    fireEvent.change(container.querySelector(".refunds-search__input"), {
      target: { value: "CN-5" },
    });
    fireEvent.click(container.querySelector(".refunds-btn--filter"));

    await waitFor(() =>
      expect(api.get.mock.calls.at(-1)[1].params.search).toBe("CN-5"),
    );
  });

  it("clears the filters", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { container } = setup();
    await waitFor(() => expect(api.get).toHaveBeenCalled());

    fireEvent.change(container.querySelector(".refunds-search__input"), {
      target: { value: "x" },
    });
    fireEvent.click(container.querySelector(".refunds-filter__clear"));

    await waitFor(() =>
      expect(api.get.mock.calls.at(-1)[1].params.search).toBeUndefined(),
    );
  });

  it("downloads a credit note PDF", async () => {
    api.get
      .mockResolvedValueOnce({ data: { data: refunds, pagination: {} } })
      .mockResolvedValueOnce({ data: new Blob(["pdf"]) });
    const { container } = setup();
    await waitFor(() => expect(container.querySelectorAll(".refunds-row").length).toBe(1));

    fireEvent.click(container.querySelector(".refunds-btn--download"));
    await waitFor(() =>
      expect(api.get).toHaveBeenCalledWith("/refunds/5/pdf", { responseType: "blob" }),
    );
    expect(toast.success).toHaveBeenCalled();
  });
});
