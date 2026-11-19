import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import api from "../../api/axios";
import useBranchStore from "../../store/branchStore";
import { useBranches } from "../../hooks/useBranches";
import Sidebar from "./Sidebar";
import { renderWithProviders } from "../../test/renderWithProviders";

let mockRole = "store_owner";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { full_name: "Ali Hassan", role: mockRole } }),
}));

vi.mock("../../hooks/useBranches", () => ({
  useBranches: vi.fn(),
}));

const branches = [
  { id: 1, name: "Main", is_main: true },
  { id: 2, name: "Salmiya" },
];

const LocationProbe = () => {
  const location = useLocation();
  return <span data-testid="path">{location.pathname}</span>;
};

const setup = ({ path = "/home", role = "store_owner", closeSidebar = vi.fn() } = {}) => {
  mockRole = role;
  api.get.mockResolvedValue({
    data: { data: { full_name: "Ali Hassan", role } },
  });
  useBranches.mockReturnValue({ data: branches, isLoading: false });

  return renderWithProviders(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar closeSidebar={closeSidebar} />
      <LocationProbe />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  document.documentElement.dir = "ltr";
  useBranchStore.setState({
    branches,
    activeBranchId: 1,
    activeBranchName: "Main",
  });
});

describe("Sidebar", () => {
  it("renders the navigation links", async () => {
    setup();
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());

    for (const href of ["/home", "/dashboard", "/inventory", "/sales"]) {
      expect(document.querySelector(`a[href="${href}"]`)).toBeTruthy();
    }
  });

  it("marks the current page", async () => {
    setup({ path: "/sales" });
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());
    expect(document.querySelector('a[href="/sales"]').getAttribute("aria-current")).toBe(
      "page",
    );
  });

  it("shows the user initials and role", async () => {
    setup();
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());
    expect(document.querySelector(".sidebar__user-avatar-circle").textContent).toBe("AH");
    expect(document.querySelector(".sidebar__user-role-badge").textContent).toContain(
      "STORE",
    );
  });

  it("hides the manage link from sales staff", async () => {
    setup({ role: "sales_man" });
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());
    expect(document.querySelector('a[href="/manage"]')).toBeNull();
  });

  it("shows the manage link to owners", async () => {
    setup();
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());
    expect(document.querySelector('a[href="/manage"]')).toBeTruthy();
  });

  it("switches the active branch from the dropdown", async () => {
    setup();
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());

    fireEvent.click(document.querySelector(".sidebar__branch-selector"));
    fireEvent.click(screen.getByText("Salmiya"));

    expect(useBranchStore.getState().activeBranchId).toBe(2);
  });

  it("closes the sidebar with the close button", async () => {
    const closeSidebar = vi.fn();
    setup({ closeSidebar });
    fireEvent.click(screen.getByLabelText(/close|بستن/i));
    expect(closeSidebar).toHaveBeenCalled();
  });

  it("does not open the branch menu for a manager", async () => {
    setup({ role: "branch_manager" });
    await waitFor(() => expect(screen.getByText("Ali Hassan")).toBeInTheDocument());

    fireEvent.click(document.querySelector(".sidebar__branch-selector"));
    expect(document.querySelector(".branch-dropdown")).toBeNull();
  });
});
