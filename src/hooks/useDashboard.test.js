import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import api from "../api/axios";
import {
  useDashboardOwner,
  useDashboardManager,
  useDashboardSalesman,
} from "./useDashboard";
import { renderHookWithQuery } from "../test/renderHookWithQuery";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("dashboard hooks", () => {
  it("calls the owner endpoint without a date range", async () => {
    api.get.mockResolvedValue({ data: { success: true, data: { revenue: 10 } } });
    const { result } = renderHookWithQuery(() => useDashboardOwner());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/dashboard/owner", { params: {} });
    expect(result.current.data).toEqual({ revenue: 10 });
  });

  it("passes the selected date range", async () => {
    api.get.mockResolvedValue({ data: { data: {} } });
    const { result } = renderHookWithQuery(() =>
      useDashboardOwner({ start: "2026-01-01", end: "2026-01-31" }),
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get.mock.calls[0][1]).toEqual({
      params: { startDate: "2026-01-01", endDate: "2026-01-31" },
    });
  });

  it("falls back to an empty object for an empty payload", async () => {
    api.get.mockResolvedValue({ data: {} });
    const { result } = renderHookWithQuery(() => useDashboardManager());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({});
  });

  it("calls the manager and salesman endpoints", async () => {
    api.get.mockResolvedValue({ data: { data: { revenue: 1 } } });
    const manager = renderHookWithQuery(() => useDashboardManager());
    await waitFor(() => expect(manager.result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/dashboard/manager", { params: {} });

    const salesman = renderHookWithQuery(() => useDashboardSalesman());
    await waitFor(() => expect(salesman.result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/dashboard/salesman", { params: {} });
  });

  it("refresh invalidates the dashboard query", async () => {
    api.get.mockResolvedValue({ data: { data: { revenue: 1 } } });
    const { result, client } = renderHookWithQuery(() => useDashboardOwner());
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const spy = vi.spyOn(client, "invalidateQueries");
    act(() => result.current.refresh());

    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls[0][0].queryKey[0]).toBe("dashboard");
  });
});
