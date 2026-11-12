import { describe, it, expect, beforeEach } from "vitest";
import useSaleDraftStore from "./saleDraftStore";

const emptyDraft = () => ({
  selectedCustomer: null,
  cart: [],
  payments: [{ method: "K-Net", amount: "", reference: "" }],
});

beforeEach(() => {
  localStorage.clear();
  useSaleDraftStore.setState({ draftByBranch: {} });
});

describe("sale draft store", () => {
  it("returns an empty draft for an unknown branch", () => {
    expect(useSaleDraftStore.getState().getDraft(1)).toEqual(emptyDraft());
  });

  it("returns an empty draft without a branch id", () => {
    expect(useSaleDraftStore.getState().getDraft(null)).toEqual(emptyDraft());
  });

  it("keeps drafts separate per branch", () => {
    useSaleDraftStore.getState().setCart(1, [{ id: 10 }]);
    useSaleDraftStore.getState().setCart(2, [{ id: 20 }]);
    expect(useSaleDraftStore.getState().getDraft(1).cart).toEqual([{ id: 10 }]);
    expect(useSaleDraftStore.getState().getDraft(2).cart).toEqual([{ id: 20 }]);
  });

  it("stores the selected customer", () => {
    useSaleDraftStore.getState().setSelectedCustomer(1, { id: 7, full_name: "Ali" });
    expect(useSaleDraftStore.getState().getDraft(1).selectedCustomer).toEqual({
      id: 7,
      full_name: "Ali",
    });
  });

  it("falls back to the default payment when given an empty list", () => {
    useSaleDraftStore.getState().setPayments(1, []);
    expect(useSaleDraftStore.getState().getDraft(1).payments).toEqual(
      emptyDraft().payments,
    );
  });

  it("clears one branch draft", () => {
    useSaleDraftStore.getState().setCart(1, [{ id: 1 }]);
    useSaleDraftStore.getState().clearDraft(1);
    expect(useSaleDraftStore.getState().draftByBranch[1]).toBeUndefined();
  });

  it("clears every draft", () => {
    useSaleDraftStore.getState().setCart(1, [{ id: 1 }]);
    useSaleDraftStore.getState().setCart(2, [{ id: 2 }]);
    useSaleDraftStore.getState().clearAllDrafts();
    expect(useSaleDraftStore.getState().draftByBranch).toEqual({});
  });

  it("ignores writes without a branch id", () => {
    useSaleDraftStore.getState().setCart(null, [{ id: 1 }]);
    expect(useSaleDraftStore.getState().draftByBranch).toEqual({});
  });
});
