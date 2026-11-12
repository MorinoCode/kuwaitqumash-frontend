import { describe, it, expect, vi, beforeEach } from "vitest";
import { waitFor, act } from "@testing-library/react";
import api from "../api/axios";
import useBranchStore from "../store/branchStore";
import { toast } from "react-toastify";
import {
  useBranches,
  useBranch,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from "./useBranches";
import { renderHookWithQuery } from "../test/renderHookWithQuery";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  useBranchStore.setState({ branches: [], activeBranchId: null });
});

describe("useBranches", () => {
  it("loads branches and stores them", async () => {
    api.get.mockResolvedValue({ data: { data: [{ id: 1, name: "Salmiya" }] } });
    const { result } = renderHookWithQuery(() => useBranches());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/manage/branches");
    expect(useBranchStore.getState().branches).toHaveLength(1);
  });

  it("falls back to the cached branches when disabled", () => {
    useBranchStore.setState({ branches: [{ id: 2, name: "Hawally" }] });
    const { result } = renderHookWithQuery(() => useBranches(false));

    expect(result.current.data).toEqual([{ id: 2, name: "Hawally" }]);
    expect(result.current.isLoading).toBe(false);
    expect(api.get).not.toHaveBeenCalled();
  });

  it("defaults to an empty list when the API returns nothing", async () => {
    api.get.mockResolvedValue({ data: {} });
    const { result } = renderHookWithQuery(() => useBranches());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([]);
  });
});

describe("useBranch", () => {
  it("does not fetch without an id", () => {
    renderHookWithQuery(() => useBranch(null));
    expect(api.get).not.toHaveBeenCalled();
  });

  it("fetches a single branch", async () => {
    api.get.mockResolvedValue({ data: { data: { id: 4, name: "Farwaniya" } } });
    const { result } = renderHookWithQuery(() => useBranch(4));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(api.get).toHaveBeenCalledWith("/manage/branches/4");
    expect(result.current.data.name).toBe("Farwaniya");
  });
});

describe("branch mutations", () => {
  it("creates a branch and toasts", async () => {
    api.post.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useCreateBranch());

    await act(async () => {
      await result.current.mutateAsync({ name: "Jahra" });
    });

    expect(api.post).toHaveBeenCalledWith("/manage/branches", { name: "Jahra" });
    expect(toast.success).toHaveBeenCalled();
  });

  it("shows the server error message when creation fails", async () => {
    api.post.mockRejectedValue({ response: { data: { message: "Duplicate" } } });
    const { result } = renderHookWithQuery(() => useCreateBranch());

    await act(async () => {
      await result.current.mutateAsync({ name: "Jahra" }).catch(() => {});
    });

    expect(toast.error).toHaveBeenCalledWith("Duplicate");
  });

  it("updates a branch", async () => {
    api.put.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useUpdateBranch());

    await act(async () => {
      await result.current.mutateAsync({ id: 3, data: { name: "New" } });
    });

    expect(api.put).toHaveBeenCalledWith("/manage/branches/3", { name: "New" });
  });

  it("clears the active branch when it is deleted", async () => {
    useBranchStore.setState({ activeBranchId: 5 });
    api.delete.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useDeleteBranch());

    await act(async () => {
      await result.current.mutateAsync(5);
    });

    expect(api.delete).toHaveBeenCalledWith("/manage/branches/5");
    expect(useBranchStore.getState().activeBranchId).toBeNull();
  });

  it("keeps another active branch untouched", async () => {
    useBranchStore.setState({ activeBranchId: 9 });
    api.delete.mockResolvedValue({ data: { success: true } });
    const { result } = renderHookWithQuery(() => useDeleteBranch());

    await act(async () => {
      await result.current.mutateAsync(5);
    });

    expect(useBranchStore.getState().activeBranchId).toBe(9);
  });
});
