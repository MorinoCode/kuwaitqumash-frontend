import { describe, it, expect } from "vitest";
import { queryClient, queryKeys } from "./queryClient";

describe("query client", () => {
  it("uses a five minute stale time", () => {
    expect(queryClient.getDefaultOptions().queries.staleTime).toBe(300000);
  });

  it("retries a failed query once", () => {
    expect(queryClient.getDefaultOptions().queries.retry).toBe(1);
  });

  it("does not refetch on window focus", () => {
    expect(queryClient.getDefaultOptions().queries.refetchOnWindowFocus).toBe(false);
  });
});

describe("query keys", () => {
  it("builds inventory keys with filters", () => {
    expect(queryKeys.inventory({ page: 2 })).toEqual(["inventory", { page: 2 }]);
    expect(queryKeys.inventory()).toEqual(["inventory", {}]);
  });

  it("builds item, customer and invoice keys", () => {
    expect(queryKeys.inventoryItem(5)).toEqual(["inventory", 5]);
    expect(queryKeys.customer(3)).toEqual(["customer", 3]);
    expect(queryKeys.invoice(9)).toEqual(["invoice", 9]);
  });

  it("builds dashboard and whatsapp keys", () => {
    expect(queryKeys.dashboard("store_owner")).toEqual(["dashboard", "store_owner"]);
    expect(queryKeys.whatsappStatus(2)).toEqual(["whatsapp", "status", 2]);
  });
});
