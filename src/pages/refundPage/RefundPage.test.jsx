import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "../../api/axios";
import { toast } from "react-toastify";
import RefundPage from "./RefundPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const invoicePayload = {
  success: true,
  data: {
    invoice: {
      id: 7,
      invoice_number: "INV-7",
      total_amount: "50",
      customer: { full_name: "Sara" },
    },
    items: [
      {
        id: 11,
        item_name: "Silk",
        quantity: 2,
        quantity_available: 2,
        total_price: "20",
        meters: 2,
        fabric_type: "Cotton",
      },
    ],
  },
};

const setup = () =>
  renderWithProviders(
    <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
      <MemoryRouter>
        <RefundPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );

const loadInvoice = async (container) => {
  fireEvent.change(container.querySelector(".refund-page__input"), {
    target: { value: "INV-7" },
  });
  fireEvent.click(container.querySelector(".refund-page__load-row button"));
  await waitFor(() =>
    expect(container.querySelector(".refund-page__form")).toBeInTheDocument(),
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ data: invoicePayload });
  api.post.mockResolvedValue({
    data: { data: { id: 3, credit_note_number: "CN-3" } },
  });
});

describe("RefundPage", () => {
  it("renders the page header", () => {
    const { container } = setup();
    expect(container.querySelector(".refund-page__header")).toBeInTheDocument();
  });

  it("looks an invoice up by number", async () => {
    const { container } = setup();
    await loadInvoice(container);
    expect(api.get).toHaveBeenCalledWith(
      "/refunds/invoices/INV-7/for-refund",
    );
    expect(container.textContent).toContain("INV-7");
    expect(container.textContent).toContain("Silk");
  });

  it("warns when the invoice id is empty", () => {
    const { container } = setup();
    fireEvent.click(container.querySelector(".refund-page__load-row button"));
    expect(toast.error).toHaveBeenCalled();
  });

  it("warns when the invoice does not exist", async () => {
    api.get.mockResolvedValue({ data: { success: false } });
    const { container } = setup();
    const input = container.querySelector(".refund-page__input");
    fireEvent.change(input, { target: { value: "INV-404" } });
    fireEvent.click(container.querySelector(".refund-page__load-row button"));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("survives a failed lookup", async () => {
    api.get.mockRejectedValue({ response: { data: { message: "not found" } } });
    const { container } = setup();
    fireEvent.change(container.querySelector(".refund-page__input"), {
      target: { value: "INV-404" },
    });
    fireEvent.click(container.querySelector(".refund-page__load-row button"));
    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("submits a refund and shows the credit note actions", async () => {
    const { container } = setup();
    await loadInvoice(container);

    fireEvent.change(container.querySelector(".refund-page__qty-input"), {
      target: { value: "1" },
    });
    const amountInput = container.querySelector(".refund-page__payment-row input");
    fireEvent.change(amountInput, { target: { value: "10" } });

    const submit = container.querySelector(".refund-page__btn--submit");
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);

    await waitFor(() => expect(api.post).toHaveBeenCalledWith("/refunds", expect.anything()));
    expect(api.post.mock.calls[0][1].items[0].invoice_item_id).toBe(11);
    expect(api.post.mock.calls[0][1].payments[0].amount).toBe(10);
    await waitFor(() =>
      expect(container.querySelector(".refund-page__credit-note-card")).toBeInTheDocument(),
    );
  });

  it("blocks submitting without a refund total", async () => {
    const { container } = setup();
    await loadInvoice(container);
    const submit = container.querySelector(".refund-page__btn--submit");
    expect(submit).toBeDisabled();
  });

  it("adds and removes payment rows", async () => {
    const { container } = setup();
    await loadInvoice(container);
    fireEvent.click(container.querySelector(".refund-page__add-payment"));
    await waitFor(() =>
      expect(container.querySelectorAll(".refund-page__payment-row").length).toBe(2),
    );
    const removeButtons = container.querySelectorAll(
      ".refund-page__payment-row .refund-page__btn--ghost",
    );
    fireEvent.click(removeButtons[1]);
    await waitFor(() =>
      expect(container.querySelectorAll(".refund-page__payment-row").length).toBe(1),
    );
  });

  it("goes back to the invoice search", async () => {
    const { container } = setup();
    await loadInvoice(container);
    fireEvent.click(container.querySelector(".refund-page__back-link"));
    await waitFor(() =>
      expect(container.querySelector(".refund-page__form")).not.toBeInTheDocument(),
    );
  });
});
