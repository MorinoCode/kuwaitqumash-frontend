import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders as render } from "../../test/renderWithProviders";
import DashboardPage from "./DashboardPage";

let role = "store_owner";

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role } }),
}));

vi.mock("./OwnerDashboard", () => ({ default: () => <div>owner dashboard</div> }));
vi.mock("./ManagerDashboard", () => ({ default: () => <div>manager dashboard</div> }));
vi.mock("./SalesmanDashboard", () => ({ default: () => <div>salesman dashboard</div> }));

describe("DashboardPage", () => {
  it("renders the owner dashboard for the store owner", () => {
    role = "store_owner";
    render(<DashboardPage />);
    expect(screen.getByText("owner dashboard")).toBeInTheDocument();
  });

  it("renders the manager dashboard for a branch manager", () => {
    role = "branch_manager";
    render(<DashboardPage />);
    expect(screen.getByText("manager dashboard")).toBeInTheDocument();
  });

  it("renders the salesman dashboard for sales staff", () => {
    role = "sales_man";
    render(<DashboardPage />);
    expect(screen.getByText("salesman dashboard")).toBeInTheDocument();
  });

  it("falls back to an error message for an unknown role", () => {
    role = "ghost";
    const { container } = render(<DashboardPage />);
    expect(container.querySelector(".dashboard-page__error")).toBeInTheDocument();
  });
});
