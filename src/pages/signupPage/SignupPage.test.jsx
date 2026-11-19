import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";
import SignupPage from "./SignupPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const setup = () =>
  renderWithProviders(
    <MemoryRouter>
      <SignupPage />
    </MemoryRouter>,
  );

beforeEach(() => vi.clearAllMocks());

describe("SignupPage", () => {
  it("renders the signup form", () => {
    const { container } = setup();
    expect(container.querySelector("form")).toBeInTheDocument();
    expect(container.querySelectorAll("input").length).toBeGreaterThan(3);
  });

  it("keeps submit disabled until the form is valid", () => {
    const { container } = setup();
    const submit = [...container.querySelectorAll("button")].find((button) =>
      button.className.includes("submit"),
    );
    expect(submit).toBeTruthy();
    expect(submit).toBeDisabled();
  });

  it("never posts an incomplete form", async () => {
    const { container } = setup();
    fireEvent.submit(container.querySelector("form"));
    await waitFor(() => expect(api.post).not.toHaveBeenCalled());
  });

  it("shows the brand logo", () => {
    const { container } = setup();
    expect(container.querySelectorAll("img").length).toBeGreaterThan(0);
  });

  it("shows an error for non-ASCII store names without English characters", () => {
    const { container } = setup();
    const storeInput = container.querySelector('input[name="storeName"]');
    fireEvent.change(storeInput, { target: { value: "پارچه سرای کویت" } });
    expect(container.querySelector(".signup-card__error-msg")).toBeTruthy();
    const submit = [...container.querySelectorAll("button")].find((button) =>
      button.className.includes("submit"),
    );
    expect(submit).toBeDisabled();
  });

  it("shows a Store ID preview and submits valid registration data", async () => {
    api.post.mockResolvedValue({ data: { tenant_id: "al-baraka-fabrics" } });
    const { container } = setup();

    fireEvent.change(container.querySelector('input[name="storeName"]'), {
      target: { value: "Al-Baraka Fabrics" },
    });
    expect(container.querySelector(".signup-card__hint")?.textContent).toContain(
      "al-baraka-fabrics",
    );

    fireEvent.change(container.querySelector('input[name="fullName"]'), {
      target: { value: "Ali Reza" },
    });
    fireEvent.change(container.querySelector('input[name="username"]'), {
      target: { value: "owner_ali" },
    });
    fireEvent.change(container.querySelector('input[name="phone"]'), {
      target: { value: "96512345678" },
    });
    fireEvent.change(container.querySelector('input[name="password"]'), {
      target: { value: "Secret123!" },
    });
    fireEvent.change(container.querySelector('input[name="confirmPassword"]'), {
      target: { value: "Secret123!" },
    });

    const submit = [...container.querySelectorAll("button")].find((button) =>
      button.className.includes("submit"),
    );
    expect(submit).not.toBeDisabled();

    fireEvent.submit(container.querySelector("form"));
    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/platform/register", {
        store_name: "al-baraka fabrics",
        username: "owner_ali",
        owner_name: "Ali Reza",
        phone: "96512345678",
        password: "Secret123!",
      }),
    );
  });
});
