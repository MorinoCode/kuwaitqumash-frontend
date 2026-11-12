import { describe, it, expect, beforeEach } from "vitest";
import useTenantStore from "./tenantStore";

beforeEach(() => {
  localStorage.clear();
  useTenantStore.setState({ tenantId: null, tenantName: null });
});

describe("tenant store", () => {
  it("starts empty", () => {
    const state = useTenantStore.getState();
    expect(state.tenantId).toBeNull();
    expect(state.tenantName).toBeNull();
  });

  it("stores the tenant id and name", () => {
    useTenantStore.getState().setTenant("kuwaitqumash-fabrics", "Kuwait Qumash");
    const state = useTenantStore.getState();
    expect(state.tenantId).toBe("kuwaitqumash-fabrics");
    expect(state.tenantName).toBe("Kuwait Qumash");
  });

  it("persists the tenant across rehydration", () => {
    useTenantStore.getState().setTenant("shop-a");
    const saved = JSON.parse(localStorage.getItem("tenant-storage"));
    expect(saved.state.tenantId).toBe("shop-a");
  });

  it("clears the tenant", () => {
    useTenantStore.getState().setTenant("shop-a");
    useTenantStore.getState().clearTenant();
    expect(useTenantStore.getState().tenantId).toBeNull();
  });

  it("resets persisted storage", () => {
    useTenantStore.getState().setTenant("shop-a");
    useTenantStore.getState().resetStorage();
    const saved = JSON.parse(localStorage.getItem("tenant-storage"));
    expect(saved.state.tenantId).toBeNull();
    expect(useTenantStore.getState().tenantId).toBeNull();
  });
});
