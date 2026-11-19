import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import InvoicePreviewModal from "./InvoicePreviewModal";
import { renderWithProviders } from "../../test/renderWithProviders";
import * as thermalPrint from "../../utils/thermalPrint";

const lastInvoice = {
  invoice_number: "INV-10",
  customer: { phone: "9655555" },
};

const setup = (props = {}) => {
  const handlers = {
    onClose: vi.fn(),
    onOpenPDF: vi.fn(),
    onSendWa: vi.fn(),
    onEditPhone: vi.fn(),
    onCancelEditPhone: vi.fn(),
  };
  const utils = renderWithProviders(
    <InvoicePreviewModal
      isOpen
      lastInvoice={lastInvoice}
      waConnected={false}
      waStep={null}
      waCustomPhone=""
      waSending={false}
      printPdfLoading={false}
      {...handlers}
      {...props}
    />,
  );
  return { ...utils, handlers };
};

describe("InvoicePreviewModal", () => {
  it("renders nothing when closed", () => {
    const { container } = setup({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing without an invoice", () => {
    const { container } = setup({ lastInvoice: null });
    expect(container).toBeEmptyDOMElement();
  });

  it("shows the success message with the invoice number", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-modal__success").textContent).toContain(
      "INV-10",
    );
  });

  it("opens the PDF", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-btn--primary"));
    expect(handlers.onOpenPDF).toHaveBeenCalled();
  });

  it("disables printing while the PDF loads", () => {
    const { container } = setup({ printPdfLoading: true });
    expect(container.querySelector(".sales-btn--primary")).toBeDisabled();
  });

  it("closes the modal", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-modal__close"));
    expect(handlers.onClose).toHaveBeenCalled();
  });

  it("hides WhatsApp controls when not connected", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-btn--wa")).toBeNull();
  });

  it("sends to the customer phone when connected", () => {
    const { container, handlers } = setup({ waConnected: true });
    fireEvent.click(container.querySelector(".sales-btn--wa"));
    expect(handlers.onSendWa).toHaveBeenCalledWith("9655555");
  });

  it("asks for a phone when the customer has none", () => {
    const { container, handlers } = setup({
      waConnected: true,
      lastInvoice: { invoice_number: "INV-11", customer: { phone: "" } },
    });
    fireEvent.click(container.querySelector(".sales-btn--wa"));
    expect(handlers.onEditPhone).toHaveBeenCalledWith("");
  });

  it("edits the phone number from the display", () => {
    const { container, handlers } = setup({ waConnected: true });
    fireEvent.click(container.querySelector(".sales-modal__phone-edit-btn"));
    expect(handlers.onEditPhone).toHaveBeenCalledWith("9655555");
  });

  it("shows the phone input while editing", () => {
    const { container, handlers } = setup({
      waConnected: true,
      waStep: "input",
      waCustomPhone: "965999",
    });
    fireEvent.change(container.querySelector(".sales-modal__wa-input"), {
      target: { value: "965123" },
    });
    expect(handlers.onEditPhone).toHaveBeenCalledWith("965123");
  });

  it("sends to the typed number", () => {
    const { container, handlers } = setup({
      waConnected: true,
      waStep: "input",
      waCustomPhone: "965999",
    });
    const buttons = [...container.querySelectorAll(".sales-modal__wa-flow button")];
    fireEvent.click(buttons[1]);
    expect(handlers.onSendWa).toHaveBeenCalledWith("965999");
  });

  it("disables sending when the number is empty", () => {
    const { container } = setup({
      waConnected: true,
      waStep: "input",
      waCustomPhone: "",
    });
    const buttons = [...container.querySelectorAll(".sales-modal__wa-flow button")];
    expect(buttons[1]).toBeDisabled();
  });

  it("shows the sending state", () => {
    const { container } = setup({
      waConnected: true,
      waStep: "input",
      waCustomPhone: "965999",
      waSending: true,
    });
    const buttons = [...container.querySelectorAll(".sales-modal__wa-flow button")];
    expect(buttons[1]).toBeDisabled();
    expect(container.querySelector(".sales-spin")).toBeTruthy();
  });

  it("triggers 80mm thermal receipt printing", () => {
    const spy = vi.spyOn(thermalPrint, "printThermalReceipt").mockReturnValue(true);
    const { container } = setup();
    const btn = container.querySelector(".sales-btn--thermal");
    expect(btn).toBeTruthy();
    fireEvent.click(btn);
    expect(spy).toHaveBeenCalledWith(lastInvoice, { lang: expect.any(String) });
    spy.mockRestore();
  });

  it("uses custom onPrintThermal callback when provided", () => {
    const onPrintThermal = vi.fn();
    const { container } = setup({ onPrintThermal });
    fireEvent.click(container.querySelector(".sales-btn--thermal"));
    expect(onPrintThermal).toHaveBeenCalledWith(lastInvoice);
  });
});
