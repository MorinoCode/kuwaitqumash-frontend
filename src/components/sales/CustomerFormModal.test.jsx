import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import CustomerFormModal from "./CustomerFormModal";
import { renderWithProviders } from "../../test/renderWithProviders";

const formData = { full_name: "", phone: "", gender: "M", address: "", type: "Regular", notes: "" };

const setup = (props = {}) => {
  const handlers = { setFormData: vi.fn(), onClose: vi.fn(), onSubmit: vi.fn() };
  const utils = renderWithProviders(
    <CustomerFormModal
      isOpen
      formData={formData}
      isSaving={false}
      theme="dark"
      {...handlers}
      {...props}
    />,
  );
  return { ...utils, handlers };
};

describe("CustomerFormModal", () => {
  it("renders nothing when closed", () => {
    const { container } = setup({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the form when open", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-modal")).toBeInTheDocument();
    expect(container.querySelectorAll(".customer-form__input").length).toBeGreaterThan(4);
  });

  it("updates the name field", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".customer-form__input"), {
      target: { value: "Sara" },
    });
    expect(handlers.setFormData).toHaveBeenCalledWith({ ...formData, full_name: "Sara" });
  });

  it("updates the customer type", () => {
    const { container, handlers } = setup();
    const select = container.querySelectorAll("select")[1];
    fireEvent.change(select, { target: { value: "Wholesaler" } });
    expect(handlers.setFormData).toHaveBeenCalledWith({
      ...formData,
      type: "Wholesaler",
    });
  });

  it("submits the form", () => {
    const { container, handlers } = setup();
    fireEvent.submit(container.querySelector("form"));
    expect(handlers.onSubmit).toHaveBeenCalled();
  });

  it("closes from the header button", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-modal__close"));
    expect(handlers.onClose).toHaveBeenCalled();
  });

  it("disables saving while the request is running", () => {
    const { container } = setup({ isSaving: true });
    expect(container.querySelector("button[type=submit]")).toBeDisabled();
  });
});
