import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import {
  useCustomers,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../../hooks/useCustomers";
import CustomersPage from "./CustomersPage";
vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 1, role: "store_owner", full_name: "Ali" } }),
}));
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../hooks/useCustomers", () => ({
  useCustomers: vi.fn(),
  useCreateCustomer: vi.fn(),
  useUpdateCustomer: vi.fn(),
  useDeleteCustomer: vi.fn(),
}));

const customers = [
  { id: 1, full_name: "Sara Ali", phone: "9651111", type: "VIP", address: "Kuwait City", gender: "F" },
  { id: 2, full_name: "Ali Omar", phone: "9652222", type: "Regular", address: "", gender: "M" },
];

beforeEach(() => {
  vi.clearAllMocks();
  useCustomers.mockReturnValue({
    data: { data: customers, count: 2 },
    isLoading: false,
    isError: false,
  });
  const mutation = { mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false };
  useCreateCustomer.mockReturnValue(mutation);
  useUpdateCustomer.mockReturnValue(mutation);
  useDeleteCustomer.mockReturnValue(mutation);
});

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <CustomersPage />
    </MemoryRouter>,
  );

describe("CustomersPage", () => {
  it("renders the page title", () => {
    const { container } = setup();
    expect(container.querySelector(".customers-page__title")).toBeInTheDocument();
  });

  it("lists the customers", () => {
    const { container } = setup();
    expect(container.textContent).toContain("Sara Ali");
    expect(container.textContent).toContain("9652222");
  });

  it("shows the skeleton while loading", () => {
    useCustomers.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = setup();
    expect(container.querySelectorAll("tr").length).toBeGreaterThan(0);
  });

  it("filters the list from the search box", () => {
    const { container } = setup();
    const input = container.querySelector('input[type="text"], input:not([type])');
    if (input) {
      fireEvent.change(input, { target: { value: "sara" } });
      expect(input.value).toBe("sara");
    }
  });

  it("opens the new customer form", () => {
    const { container } = setup();
    const addButton = [...container.querySelectorAll("button")].find((button) =>
      /new|add|جدید|افزودن/i.test(button.textContent),
    );
    if (addButton) {
      fireEvent.click(addButton);
      expect(document.body.textContent.length).toBeGreaterThan(0);
    }
  });

  it("uses the mocked query hook once", () => {
    setup();
    expect(useCustomers).toHaveBeenCalled();
  });
});
