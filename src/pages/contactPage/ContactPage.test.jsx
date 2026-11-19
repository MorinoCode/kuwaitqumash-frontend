import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import ContactPage from "./ContactPage";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const setup = () =>
  renderWithProviders(
    <MemoryRouter initialEntries={["/contact"]}>
      <ContactPage />
    </MemoryRouter>,
  );

const fillForm = (container, values = {}) => {
  const [name, , contact] = container.querySelectorAll("input");
  const message = container.querySelector("textarea");
  fireEvent.change(name, { target: { value: values.name ?? "Sara" } });
  fireEvent.change(contact, { target: { value: values.contact ?? "9651234567" } });
  fireEvent.change(message, {
    target: { value: values.message ?? "I would like a demo" },
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  api.post.mockResolvedValue({ data: { success: true } });
});

describe("ContactPage", () => {
  it("renders the form fields", () => {
    const { container } = setup();
    expect(container.querySelectorAll("input").length).toBe(3);
    expect(container.querySelector("textarea")).toBeInTheDocument();
  });

  it("keeps submit disabled until the form is valid", () => {
    const { container } = setup();
    const submit = container.querySelector('button[type="submit"]');
    expect(submit).toBeDisabled();
  });

  it("submits the message and shows the success state", async () => {
    const { container } = setup();
    fillForm(container);

    const submit = container.querySelector('button[type="submit"]');
    await waitFor(() => expect(submit).not.toBeDisabled());
    fireEvent.click(submit);

    await waitFor(() =>
      expect(api.post).toHaveBeenCalledWith("/platform/contact", {
        name: "Sara",
        contact: "9651234567",
        message: "I would like a demo",
      }),
    );

    await waitFor(() =>
      expect(container.querySelector(".contact-page__success")).toBeInTheDocument(),
    );
  });

  it("shows an error when sending fails", async () => {
    api.post.mockRejectedValue({ response: { data: { message: "server down" } } });
    const { container } = setup();
    fillForm(container);

    fireEvent.click(container.querySelector('button[type="submit"]'));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("server down"));
    expect(container.querySelector(".contact-page__success")).toBeNull();
  });

  it("rejects an invalid submit without calling the API", () => {
    const { container } = setup();
    fireEvent.submit(container.querySelector("form"));
    expect(api.post).not.toHaveBeenCalled();
  });
});
