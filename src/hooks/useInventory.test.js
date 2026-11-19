import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  useInventory,
  useInventoryItem,
  useInventoryByBarcode,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useCustomOptions,
} from "./useInventory";
import { renderHookWithQuery } from "../test/renderHookWithQuery";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("useInventory", () => {
  it("requests the unfiltered list", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() => useInventory());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/inventory");
  });

  it("skips the All sentinel values", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() =>
      useInventory({ fabric_type: "All", pattern: "All", status: "Sold" }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get.mock.calls[0][0]).toBe("/inventory?status=Sold");
  });

  it("serialises every active filter", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() =>
      useInventory({ search: "silk", branch_id: 2, page: 2, limit: 10 }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get.mock.calls[0][0]).toBe(
      "/inventory?branch_id=2&search=silk&page=2&limit=10",
    );
  });

  it("skips the item query without an id", () => {
    renderHookWithQuery(() => useInventoryItem(null));
    expect(api.get).not.toHaveBeenCalled();
  });

  it("encodes the barcode search", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const { result } = renderHookWithQuery(() => useInventoryByBarcode("CH 12"));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/inventory?search=CH%2012");
  });

  it("loads custom options as an array", async () => {
    api.get.mockResolvedValue({ data: [] });
    const { result } = renderHookWithQuery(() => useCustomOptions({ type: "color" }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/inventory/custom-options?type=color");
    expect(result.current.data).toEqual([]);
  });
});

describe("inventory mutations", () => {
  it("posts JSON payload when creating an item", async () => {
    api.post.mockResolvedValue({ data: { data: { id: 3, item_name: "Silk" } } });
    const { result } = renderHookWithQuery(() => useCreateInventoryItem());

    await act(async () => {
      await result.current.mutateAsync({ item_name: "Silk", meta: { a: 1 } });
    });

    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe("/inventory");
    expect(body).toEqual({ item_name: "Silk", meta: { a: 1 } });
    expect(toast.success).toHaveBeenCalled();
  });

  it("reports creation errors from the server", async () => {
    api.post.mockRejectedValue({ response: { data: { message: "Duplicate barcode" } } });
    const { result } = renderHookWithQuery(() => useCreateInventoryItem());

    await act(async () => {
      await result.current.mutateAsync({ item_name: "Silk" }).catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Duplicate barcode");
  });

  it("puts updates and seeds the item cache", async () => {
    api.put.mockResolvedValue({ data: { data: { id: 3, item_name: "Updated" } } });
    const { result, client } = renderHookWithQuery(() => useUpdateInventoryItem());

    await act(async () => {
      await result.current.mutateAsync({ id: 3, data: { item_name: "Updated" } });
    });

    expect(api.put.mock.calls[0][0]).toBe("/inventory/3");
    expect(client.getQueryData(["inventory", 3])).toEqual({
      id: 3,
      item_name: "Updated",
    });
  });

  it("deletes an item", async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useDeleteInventoryItem());

    await act(async () => {
      await result.current.mutateAsync(3);
    });

    expect(api.delete).toHaveBeenCalledWith("/inventory/3");
    expect(toast.success).toHaveBeenCalled();
  });
});
