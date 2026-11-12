import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "../../test/renderWithProviders";

const login = vi.fn();

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ login, user: null }),
}));

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("LoginPage", () => {
  it("renders the login form", () => {
    const { container } = setup();
    expect(container.querySelector(".login-card")).toBeInTheDocument();
    expect(container.querySelector('button[type="submit"]')).toBeInTheDocument();
  });

  it("submits the credentials to the API", async () => {
    api.post.mockResolvedValue({ data: { data: { token: "tok", tenant_id: "store-1" } } });
    const { container } = setup();

    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0], { target: { value: "store-1" } });
    fireEvent.change(inputs[1], { target: { value: "admin" } });
    fireEvent.change(inputs[2], { target: { value: "123456" } });
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => expect(api.post).toHaveBeenCalled());
    const [url, , config] = api.post.mock.calls[0];
    expect(url).toContain("/auth/login");
    expect(config.headers["x-tenant-id"]).toBe("store-1");
  });

  it("logs the user in on success", async () => {
    api.post.mockResolvedValue({ data: { data: { token: "tok", tenant_id: "store-1" } } });
    const { container } = setup();

    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0], { target: { value: "store-1" } });
    fireEvent.change(inputs[1], { target: { value: "admin" } });
    fireEvent.change(inputs[2], { target: { value: "123456" } });
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => expect(login).toHaveBeenCalled());
  });

  it("shows an error toast when the API rejects", async () => {
    api.post.mockRejectedValue({ response: { data: { message: "bad credentials" } } });
    const { container } = setup();

    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0], { target: { value: "store-1" } });
    fireEvent.change(inputs[1], { target: { value: "admin" } });
    fireEvent.change(inputs[2], { target: { value: "wrong" } });
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
  });

  it("renders the store logo", () => {
    const { container } = setup();
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
  });
});
