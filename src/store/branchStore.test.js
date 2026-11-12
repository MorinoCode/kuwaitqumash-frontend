import { describe, it, expect, beforeEach, vi } from "vitest";
import useBranchStore from "./branchStore";

beforeEach(() => {
  localStorage.clear();
  useBranchStore.setState({
    activeBranchId: null,
    activeBranchName: null,
    branches: [],
  });
});

describe("branch store", () => {
  it("sets the active branch and dispatches an event", () => {
    const listener = vi.fn();
    window.addEventListener("branchChanged", listener);
    useBranchStore.getState().setActiveBranch({ id: 2, name: "Salmiya" });
    window.removeEventListener("branchChanged", listener);

    expect(useBranchStore.getState().activeBranchId).toBe(2);
    expect(useBranchStore.getState().activeBranchName).toBe("Salmiya");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("clears the active branch", () => {
    useBranchStore.getState().setActiveBranch({ id: 2, name: "Salmiya" });
    useBranchStore.getState().clearBranch();
    expect(useBranchStore.getState().activeBranchId).toBeNull();
  });

  it("keeps the branch list in memory only", () => {
    useBranchStore.getState().setBranches([{ id: 1 }, { id: 2 }]);
    expect(useBranchStore.getState().branches).toHaveLength(2);
    expect(localStorage.getItem("branch-storage")).not.toContain("branches");
  });

  it("validates a stored branch against the cached list", async () => {
    useBranchStore.getState().setBranches([{ id: 1, name: "Main" }]);
    await expect(useBranchStore.getState().validateBranch(1, {})).resolves.toBe(true);
    await expect(useBranchStore.getState().validateBranch(9, {})).resolves.toBe(false);
  });

  it("fetches branches before validating when the cache is empty", async () => {
    const api = {
      get: vi.fn().mockResolvedValue({ data: { data: [{ id: 4, name: "Farwaniya" }] } }),
    };
    await expect(useBranchStore.getState().validateBranch(4, api)).resolves.toBe(true);
    expect(api.get).toHaveBeenCalledWith("/manage/branches");
  });

  it("returns false without a branch id", async () => {
    await expect(useBranchStore.getState().validateBranch(null, {})).resolves.toBe(false);
  });
});
