import { describe, it, expect, vi } from "vitest";
import { fireEvent } from "@testing-library/react";
import PaymentForm from "./PaymentForm";
import { renderWithProviders } from "../../test/renderWithProviders";

const formatPrice = (value) => Number(value || 0).toFixed(3);

const setup = (props = {}) => {
  const handlers = {
    onUpdatePayment: vi.fn(),
    onAddPayment: vi.fn(),
    onRemovePayment: vi.fn(),
  };
  const utils = renderWithProviders(
    <PaymentForm
      grandTotal={100}
      totalPaid={60}
      remaining={40}
      payments={[{ method: "Cash", amount: "60" }]}
      formatPrice={formatPrice}
      {...handlers}
      {...props}
    />,
  );
  return { ...utils, handlers };
};

describe("PaymentForm", () => {
  it("shows the grand total and the paid amount", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-payment__amount").textContent).toContain("100.000");
    expect(container.textContent).toContain("60.000");
  });

  it("marks the remaining balance as due", () => {
    const { container } = setup();
    expect(container.querySelector(".sales-summary-row--remaining")).toHaveClass("due");
  });

  it("marks a settled invoice", () => {
    const { container } = setup({ remaining: 0 });
    expect(container.querySelector(".sales-summary-row--remaining")).toHaveClass("settled");
  });

  it("updates the payment method", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-payment__select"), {
      target: { value: "K-Net" },
    });
    expect(handlers.onUpdatePayment).toHaveBeenCalledWith(0, "method", "K-Net");
  });

  it("updates the payment amount", () => {
    const { container, handlers } = setup();
    fireEvent.change(container.querySelector(".sales-payment__input"), {
      target: { value: "10" },
    });
    expect(handlers.onUpdatePayment).toHaveBeenCalledWith(0, "amount", "10");
  });

  it("adds another payment method", () => {
    const { container, handlers } = setup();
    fireEvent.click(container.querySelector(".sales-btn--dashed"));
    expect(handlers.onAddPayment).toHaveBeenCalled();
  });

  it("only offers remove when more than one payment exists", () => {
    const single = setup();
    expect(single.container.querySelector(".sales-btn-icon")).toBeNull();

    const multi = setup({
      payments: [
        { method: "Cash", amount: "10" },
        { method: "K-Net", amount: "20" },
      ],
    });
    fireEvent.click(multi.container.querySelectorAll(".sales-btn-icon")[1]);
    expect(multi.handlers.onRemovePayment).toHaveBeenCalledWith(1);
  });
});
