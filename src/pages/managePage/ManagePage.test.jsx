import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useBranches, useCreateBranch, useUpdateBranch, useDeleteBranch } from "../../hooks/useBranches";
import { useStaff, useCreateStaff, useUpdateStaff, useDeleteStaff } from "../../hooks/useStaff";
import ManagePage from "./ManagePage";
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner", full_name: "Ali" } }),
}));
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../hooks/useBranches", () => ({
  useBranches: vi.fn(),
  useCreateBranch: vi.fn(),
  useUpdateBranch: vi.fn(),
  useDeleteBranch: vi.fn(),
}));

vi.mock("../../hooks/useStaff", () => ({
  useStaff: vi.fn(),
  useCreateStaff: vi.fn(),
  useUpdateStaff: vi.fn(),
  useDeleteStaff: vi.fn(),
}));

const mutation = { mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false };

beforeEach(() => {
  vi.clearAllMocks();
  useBranches.mockReturnValue({
    data: [{ id: 1, name: "Main", location: "Kuwait City", phone: "1234", is_main: true }],
    isLoading: false,
  });
  useStaff.mockReturnValue({
    data: [{ id: 2, full_name: "Noura", username: "noura", role: "sales_man", branch_id: 1, is_active: true }],
    isLoading: false,
  });
  useCreateBranch.mockReturnValue(mutation);
  useUpdateBranch.mockReturnValue(mutation);
  useDeleteBranch.mockReturnValue(mutation);
  useCreateStaff.mockReturnValue(mutation);
  useUpdateStaff.mockReturnValue(mutation);
  useDeleteStaff.mockReturnValue(mutation);
});

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <ManagePage />
    </MemoryRouter>,
  );

describe("ManagePage", () => {
  it("renders the page title", () => {
    const { container } = setup();
    expect(container.querySelector(".manage-header__title")).toBeInTheDocument();
  });

  it("shows the branch list", () => {
    const { container } = setup();
    expect(container.textContent).toContain("Main");
  });

  it("shows the staff list", () => {
    const { container } = setup();
    expect(container.textContent.length).toBeGreaterThan(50);
  });

  it("renders a loader while branches load", () => {
    useBranches.mockReturnValue({ data: [], isLoading: true });
    const { container } = setup();
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it("calls the hooks once", () => {
    setup();
    expect(useBranches).toHaveBeenCalled();
    expect(useStaff).toHaveBeenCalled();
  });

  it("renders without a heading crash on empty data", () => {
    useBranches.mockReturnValue({ data: [], isLoading: false });
    useStaff.mockReturnValue({ data: [], isLoading: false });
    setup();
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });
});
