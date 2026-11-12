import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import useBranchStore from "../store/branchStore";
import { BranchProvider, useBranch } from "./BranchContext";

const branches = [
  { id: 1, name: "Main", is_main: true },
  { id: 2, name: "Salmiya" },
];

vi.mock("../hooks/useBranches", () => ({
  useBranches: vi.fn(),
}));

vi.mock("./AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner" } }),
}));

import { useBranches } from "../hooks/useBranches";

const Consumer = () => {
  const { branches: list, activeBranchId, isLoading } = useBranch();
  return (
    <div>
      <span data-testid="count">{list.length}</span>
      <span data-testid="active">{String(activeBranchId)}</span>
      <span data-testid="loading">{String(isLoading)}</span>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  useBranchStore.setState({ branches: [], activeBranchId: null, activeBranchName: null });
  useBranches.mockReturnValue({ data: branches, isLoading: false });
});

describe("BranchProvider", () => {
  it("exposes the branches from the query", () => {
    render(
      <BranchProvider>
        <Consumer />
      </BranchProvider>,
    );

    expect(screen.getByTestId("count").textContent).toBe("2");
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("caches the branches in the store", () => {
    render(
      <BranchProvider>
        <Consumer />
      </BranchProvider>,
    );

    expect(useBranchStore.getState().branches).toHaveLength(2);
  });

  it("reports loading while branches are fetched", () => {
    useBranches.mockReturnValue({ data: [], isLoading: true });
    render(
      <BranchProvider>
        <Consumer />
      </BranchProvider>,
    );

    expect(screen.getByTestId("loading").textContent).toBe("true");
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("falls back to the store outside the provider", () => {
    useBranchStore.setState({ branches: [{ id: 9, name: "Fallback" }] });
    render(<Consumer />);
    expect(screen.getByTestId("count").textContent).toBe("1");
  });
});
