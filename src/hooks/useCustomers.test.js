import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  useCustomers,
  useCustomer,
  useCustomerHistory,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "./useCustomers";
import { renderHookWithQuery } from "../test/renderHookWithQuery";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("useCustomers", () => {
  it("requests the unfiltered list by default", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() => useCustomers());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/customers");
  });

  it("builds the query string from filters", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() =>
      useCustomers({ search: "sara", branch_id: 2, page: 3, limit: 10 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get.mock.calls[0][0]).toBe(
      "/customers?search=sara&branch_id=2&page=3&limit=10",
    );
  });
});

describe("useCustomer and useCustomerHistory", () => {
  it("skips both requests without an id", () => {
    renderHookWithQuery(() => useCustomer(undefined));
    renderHookWithQuery(() => useCustomerHistory(undefined));
    expect(api.get).not.toHaveBeenCalled();
  });

  it("loads a customer and their history", async () => {
    api.get.mockResolvedValue({ data: { data: { id: 1, full_name: "Sara" } } });
    const customer = renderHookWithQuery(() => useCustomer(1));
    await waitFor(() => expect(customer.result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/customers/1");

    api.get.mockResolvedValue({ data: { data: [{ id: 9 }] } });
    const history = renderHookWithQuery(() => useCustomerHistory(1));
    await waitFor(() => expect(history.result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/customers/1/history");
    expect(history.result.current.data).toEqual([{ id: 9 }]);
  });
});

describe("customer mutations", () => {
  it("posts a JSON body and skips empty values", async () => {
    api.post.mockResolvedValue({ data: { data: { id: 7, full_name: "Sara" } } });
    const { result } = renderHookWithQuery(() => useCreateCustomer());

    await act(async () => {
      await result.current.mutateAsync({
        full_name: "Sara",
        phone: null,
        notes: undefined,
      });
    });

    const [url, body, config] = api.post.mock.calls[0];
    expect(url).toBe("/customers");
    expect(body).toEqual({ full_name: "Sara" });
    expect("phone" in body).toBe(false);
    expect(config).toBeUndefined();
    expect(toast.success).toHaveBeenCalled();
  });

  it("puts updates to the customer endpoint", async () => {
    api.put.mockResolvedValue({ data: { data: { id: 7 } } });
    const { result } = renderHookWithQuery(() => useUpdateCustomer());

    await act(async () => {
      await result.current.mutateAsync({ id: 7, data: { full_name: "Noura" } });
    });

    expect(api.put.mock.calls[0][0]).toBe("/customers/7");
    expect(api.put.mock.calls[0][1]).toEqual({ full_name: "Noura" });
    expect(toast.success).toHaveBeenCalled();
  });

  it("deletes a customer and reports errors", async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useDeleteCustomer());

    await act(async () => {
      await result.current.mutateAsync(7);
    });

    expect(api.delete).toHaveBeenCalledWith("/customers/7");
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows the API error on a failed deletion", async () => {
    api.delete.mockRejectedValue({ response: { data: { message: "Has invoices" } } });
    const { result } = renderHookWithQuery(() => useDeleteCustomer());

    await act(async () => {
      await result.current.mutateAsync(8).catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Has invoices");
  });
});
