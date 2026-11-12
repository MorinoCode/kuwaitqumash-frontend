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
});
