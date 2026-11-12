import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent } from "@testing-library/react";
import AddItemModal from "./AddItemModal";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../hooks/useInventory", () => ({
  useCreateInventoryItem: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useUpdateInventoryItem: () => ({ mutateAsync: vi.fn(), isPending: false }),
  useSaveCustomOption: () => ({ mutate: vi.fn(), mutateAsync: vi.fn(), isPending: false }),
  useCustomOptions: () => ({ data: [] }),
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const setup = (props = {}) => {
  const onClose = vi.fn();
  const onSuccess = vi.fn();
  const utils = renderWithProviders(
    <AddItemModal isOpen onClose={onClose} onSuccess={onSuccess} activeBranchId={1} {...props} />,
  );
  return { ...utils, onClose, onSuccess };
};

beforeEach(() => vi.clearAllMocks());

describe("AddItemModal", () => {
  it("renders nothing when closed", () => {
    const { container } = setup({ isOpen: false });
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the form when open", () => {
    const { container } = setup();
    expect(container.querySelector(".inventory-modal")).toBeInTheDocument();
    expect(container.querySelector("form")).toBeInTheDocument();
    expect(container.querySelectorAll(".inventory-form__input").length).toBeGreaterThan(3);
  });

  it("closes from the header button", () => {
    const { container, onClose } = setup();
    fireEvent.click(container.querySelector(".inventory-modal__close"));
    expect(onClose).toHaveBeenCalled();
  });

  it("accepts typed values", () => {
    const { container } = setup();
    const input = container.querySelector(".inventory-form__input");
    fireEvent.change(input, { target: { value: "Cotton" } });
    expect(input.value).toBe("Cotton");
  });

  it("labels the length field by the selected sale unit", () => {
    const { container } = setup();
    const unitSelect = container.querySelector("select.inventory-form__input");
    fireEvent.change(unitSelect, { target: { value: "roll" } });
    expect(container.textContent).toMatch(/Length per roll|طول هر طاقه/);

    fireEvent.change(unitSelect, { target: { value: "piece" } });
    expect(container.textContent).toMatch(/Length per piece|طول هر عدد/);
  });

  it("requires the mandatory fields before saving", () => {
    const { container } = setup();
    const submit = container.querySelector('button[type="submit"]');
    expect(submit).toBeTruthy();
    fireEvent.submit(container.querySelector("form"));
    expect(container.querySelector(".inventory-modal")).toBeInTheDocument();
  });
});
