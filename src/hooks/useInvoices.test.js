import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useInvoices, useInvoice, useCreateSale, useSendInvoiceWhatsApp } from "./useInvoices";
import { renderHookWithQuery } from "../test/renderHookWithQuery";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("useInvoices", () => {
  it("requests all invoices by default", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() => useInvoices());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/sales/invoices");
  });

  it("serialises filters in a stable order", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() =>
      useInvoices({
        search: "INV",
        start_date: "2026-01-01",
        end_date: "2026-01-31",
        page: 2,
        limit: 50,
      }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get.mock.calls[0][0]).toBe(
      "/sales/invoices?search=INV&start_date=2026-01-01&end_date=2026-01-31&page=2&limit=50",
    );
  });

  it("does not load an invoice without an id", () => {
    renderHookWithQuery(() => useInvoice(undefined));
    expect(api.get).not.toHaveBeenCalled();
  });

  it("loads a single invoice from /sales/:id", async () => {
    api.get.mockResolvedValue({ data: { data: { id: 42, invoice_number: "INV-42" } } });
    const { result } = renderHookWithQuery(() => useInvoice(42));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/sales/42");
    expect(result.current.data).toEqual({ id: 42, invoice_number: "INV-42" });
  });
});

describe("sale mutations", () => {
  it("prepends the created invoice to cached lists", async () => {
    api.post.mockResolvedValue({ data: { data: { id: 11, invoice_number: "INV-11" } } });
    const { result, client } = renderHookWithQuery(() => useCreateSale());

    client.setQueryData(["invoices", {}], {
      data: [{ id: 10 }],
      count: 1,
      pagination: { totalItems: 1 },
    });

    await act(async () => {
      await result.current.mutateAsync({ total_amount: 5 });
    });

    expect(api.post).toHaveBeenCalledWith("/sales/create", { total_amount: 5 });
    const cached = client.getQueryData(["invoices", {}]);
    expect(cached.data.map((i) => i.id)).toEqual([11, 10]);
    expect(cached.pagination.totalItems).toBe(2);
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows the API error when the sale fails", async () => {
    api.post.mockRejectedValue({ response: { data: { message: "Stock is low" } } });
    const { result } = renderHookWithQuery(() => useCreateSale());

    await act(async () => {
      await result.current.mutateAsync({}).catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Stock is low");
  });

  it("sends the invoice over WhatsApp", async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useSendInvoiceWhatsApp());

    await act(async () => {
      await result.current.mutateAsync({ id: 11, phone: "965555" });
    });

    expect(api.post).toHaveBeenCalledWith("/sales/invoices/11/send-whatsapp", {
      phone: "965555",
    });
    expect(toast.success).toHaveBeenCalled();
  });
});
