import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useInvoices, useSendInvoiceWhatsApp } from "../../hooks/useInvoices";
import { useBranches } from "../../hooks/useBranches";
import InvoicesPage from "./InvoicesPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../hooks/useInvoices", () => ({
  useInvoices: vi.fn(),
  useSendInvoiceWhatsApp: vi.fn(),
  useInvoice: vi.fn(),
}));

vi.mock("../../hooks/useBranches", () => ({
  useBranches: vi.fn(),
}));

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner" } }),
}));

const invoices = [
  {
    id: 1,
    invoice_number: "INV-1",
    total_amount: "100.5",
    total_meters: "12",
    createdAt: "2026-03-01T10:00:00Z",
    customer: { full_name: "Sara", phone: "9651111" },
    branch: { name: "Main" },
    payments: [{ method: "Cash", amount: "100.5" }],
  },
];

beforeEach(() => {
  vi.clearAllMocks();
  useInvoices.mockReturnValue({
    data: { data: invoices, pagination: { page: 1, totalItems: 1, limit: 20 } },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  });
  useSendInvoiceWhatsApp.mockReturnValue({ mutate: vi.fn(), isPending: false });
  useBranches.mockReturnValue({ data: [{ id: 1, name: "Main" }], isLoading: false });
});

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <InvoicesPage />
    </MemoryRouter>,
  );

describe("InvoicesPage", () => {
  it("renders the page title", () => {
    const { container } = setup();
    expect(container.querySelector(".invoices-title")).toBeInTheDocument();
  });

  it("lists the invoices", () => {
    const { container } = setup();
    expect(container.textContent).toContain("INV-1");
    expect(container.textContent).toContain("100.500");
  });

  it("uses the invoices hook", () => {
    setup();
    expect(useInvoices).toHaveBeenCalled();
  });

  it("renders while loading", () => {
    useInvoices.mockReturnValue({ data: undefined, isLoading: true, refetch: vi.fn() });
    const { container } = setup();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("renders the empty state", async () => {
    useInvoices.mockReturnValue({
      data: { data: [], pagination: { page: 1, totalItems: 0 } },
      isLoading: false,
      refetch: vi.fn(),
    });
    const { container } = setup();
    await waitFor(() => expect(container.innerHTML.length).toBeGreaterThan(0));
  });
});
