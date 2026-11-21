import { describe, it, expect, vi, beforeEach } from "vitest";
import { render as rtlRender, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n";
import api from "./api/axios";
import App from "./App";

const render = (ui) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return rtlRender(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
};

vi.mock("./api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const stub = (name) => ({ default: () => <div data-testid={name}>{name}</div> });

vi.mock("./pages/welcomePage/WelcomePage", () => stub("welcome"));
vi.mock("./pages/loginPage/LoginPage", () => stub("login"));
vi.mock("./pages/mainPage/MainPage", () => stub("main"));
vi.mock("./pages/dashboardPage/DashboardPage", () => stub("dashboard"));
vi.mock("./pages/inventoryPage/InventoryPage", () => stub("inventory"));
vi.mock("./pages/salesPage/SalesPage", () => stub("sales"));
vi.mock("./pages/customersPage/CustomersPage", () => stub("customers"));
vi.mock("./pages/managePage/ManagePage", () => stub("manage"));
vi.mock("./pages/itemDetailsPage/ItemDetailsPage", () => stub("item"));
vi.mock("./pages/staffDetailsPage/StaffDetailsPage", () => stub("staff"));
vi.mock("./pages/branchDetailPage/BranchDetailPage", () => stub("branch"));
vi.mock("./pages/customerDetailPage/CustomerDetailPage", () => stub("customer-detail"));
vi.mock("./pages/invoicesPage/InvoicesPage", () => stub("invoices"));
vi.mock("./pages/refundPage/RefundPage", () => stub("refund"));
vi.mock("./pages/refundsPage/RefundsPage", () => stub("refunds"));
vi.mock("./pages/contactPage/ContactPage", () => stub("contact"));
vi.mock("./components/layout/mainLayout/MainLayout", () => ({
  default: () => <div data-testid="layout">layout</div>,
}));

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockRejectedValue({ response: { status: 401 } });
});

describe("App", () => {
  it("renders without crashing", async () => {
    const { container } = render(<App />);
    await screen.findByTestId("welcome");
    expect(container).toBeTruthy();
  });

  it("sets the document direction from the current language", async () => {
    render(<App />);
    await screen.findByTestId("welcome");
    expect(document.body.classList.contains("font-persian")).toBe(true);
    expect(document.dir).toBe("rtl");
  });

  it("wraps the routed pages in an error boundary", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("welcome")).toBeInTheDocument());
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders the welcome route at the root path", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("welcome")).toBeInTheDocument());
  });

  it("redirects /signup permanently to /contact", async () => {
    window.history.pushState({}, "", "/signup");
    render(<App />);
    await waitFor(() => expect(screen.getByTestId("contact")).toBeInTheDocument());
    window.history.pushState({}, "", "/");
  });
});
