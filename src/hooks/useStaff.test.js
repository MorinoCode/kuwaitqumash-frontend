import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  useStaff,
  useStaffMember,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "./useStaff";
import { renderHookWithQuery } from "../test/renderHookWithQuery";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => vi.clearAllMocks());

describe("useStaff", () => {
  it("loads the staff list", async () => {
    api.get.mockResolvedValue({ data: { data: [{ id: 1, full_name: "Ali" }] } });
    const { result } = renderHookWithQuery(() => useStaff());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/manage/staff");
    expect(result.current.data).toHaveLength(1);
  });

  it("returns an empty list when the payload is missing", async () => {
    api.get.mockResolvedValue({ data: {} });
    const { result } = renderHookWithQuery(() => useStaff());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });

  it("skips a member request without an id", () => {
    renderHookWithQuery(() => useStaffMember(null));
    expect(api.get).not.toHaveBeenCalled();
  });
});

describe("staff mutations", () => {
  it("creates a staff member", async () => {
    api.post.mockResolvedValue({ data: { data: { id: 2 } } });
    const { result } = renderHookWithQuery(() => useCreateStaff());

    await act(async () => {
      await result.current.mutateAsync({ full_name: "Noura" });
    });

    expect(api.post).toHaveBeenCalledWith("/manage/staff", { full_name: "Noura" });
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows the API error on failure", async () => {
    api.post.mockRejectedValue({ response: { data: { message: "Username taken" } } });
    const { result } = renderHookWithQuery(() => useCreateStaff());

    await act(async () => {
      await result.current.mutateAsync({}).catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Username taken");
  });

  it("puts staff updates", async () => {
    api.put.mockResolvedValue({ data: { data: { id: 2 } } });
    const { result } = renderHookWithQuery(() => useUpdateStaff());

    await act(async () => {
      await result.current.mutateAsync({ id: 2, data: { is_active: false } });
    });

    expect(api.put).toHaveBeenCalledWith("/manage/staff/2", { is_active: false });
  });

  it("deletes a staff member", async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useDeleteStaff());

    await act(async () => {
      await result.current.mutateAsync(2);
    });

    expect(api.delete).toHaveBeenCalledWith("/manage/staff/2");
    expect(toast.success).toHaveBeenCalled();
  });
});
