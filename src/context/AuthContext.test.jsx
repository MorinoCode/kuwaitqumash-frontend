import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import api from "../api/axios";
import { AuthProvider, useAuth } from "./AuthContext";

vi.mock("../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="path">{location.pathname}</div>;
};

const Consumer = () => {
  const { user, login, logout, loading } = useAuth();
  return (
    <div>
      <span data-testid="user">{user ? user.username || "logged-in" : "none"}</span>
      <span data-testid="loading">{String(loading)}</span>
      <button type="button" onClick={() => login({ username: "ali", token: "tok" })}>
        login
      </button>
      <button type="button" onClick={logout}>
        logout
      </button>
    </div>
  );
};

const renderApp = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/home"]}>
        <AuthProvider>
          <Consumer />
          <LocationProbe />
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("AuthProvider", () => {
  it("hides children while the session is checked", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderApp();
    expect(screen.queryByTestId("user")).toBeNull();
  });

  it("loads the current user from /auth/me", async () => {
    api.get.mockResolvedValue({ data: { data: { id: 1, username: "ali" } } });
    renderApp();

    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("ali"));
    expect(api.get).toHaveBeenCalledWith("/auth/me", expect.objectContaining({}));
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("shows an empty session when the request fails with 401", async () => {
    api.get.mockRejectedValue({ response: { status: 401 } });
    renderApp();

    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("user").textContent).toBe("none");
    await waitFor(() => expect(screen.getByTestId("path").textContent).toBe("/login"));
  });

  it("stays on a public page after a 401", async () => {
    api.get.mockRejectedValue({ response: { status: 401 } });
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter initialEntries={["/login"]}>
          <AuthProvider>
            <Consumer />
            <LocationProbe />
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("path").textContent).toBe("/login");
  });

  it("keeps the session on a network error", async () => {
    api.get.mockRejectedValue({ code: "ERR_NETWORK", message: "Network Error" });
    renderApp();

    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("path").textContent).toBe("/home");
  });

  it("logs in by storing the token and navigating home", async () => {
    api.get
      .mockRejectedValueOnce({ response: { status: 401 } })
      .mockResolvedValue({ data: { data: { id: 1, username: "ali" } } });
    renderApp();
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    await waitFor(() => expect(screen.getByTestId("path").textContent).toBe("/login"));

    fireEvent.click(screen.getByText("login"));

    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("ali"));
    expect(localStorage.getItem("token")).toBe("tok");
    await waitFor(() => expect(screen.getByTestId("path").textContent).toBe("/home"));
  });

  it("logs out by clearing local storage", async () => {
    api.get.mockResolvedValue({ data: { data: { id: 1, username: "ali" } } });
    api.post.mockResolvedValue({ data: { success: true } });
    localStorage.setItem("token", "tok");
    renderApp();

    await waitFor(() => expect(screen.getByTestId("user").textContent).toBe("ali"));

    await act(async () => {
      fireEvent.click(screen.getByText("logout"));
    });

    expect(api.post).toHaveBeenCalledWith("/auth/logout");
    await waitFor(() => expect(screen.getByTestId("path").textContent).toBe("/login"));
    expect(localStorage.getItem("token")).toBeNull();
  });
});

describe("useAuth", () => {
  it("throws outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const Orphan = () => {
      useAuth();
      return null;
    };
    expect(() => render(<Orphan />)).toThrow(/within an AuthProvider/);
    spy.mockRestore();
  });
});
