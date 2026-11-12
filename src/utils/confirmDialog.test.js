import { describe, it, expect, vi, afterEach } from "vitest";
import { confirmDialog, confirmToast } from "./confirmDialog";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("confirmDialog", () => {
  it("calls onConfirm when the user accepts", () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    confirmDialog("Delete?", onConfirm, onCancel);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel when the user refuses", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    confirmDialog("Delete?", onConfirm, onCancel);
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does nothing on refusal without an onCancel handler", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    expect(() => confirmDialog("Delete?", vi.fn())).not.toThrow();
  });

  it("confirmToast behaves like confirmDialog", () => {
    const spy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const onConfirm = vi.fn();
    confirmToast("Sure?", onConfirm);
    expect(spy).toHaveBeenCalledWith("Sure?");
    expect(onConfirm).toHaveBeenCalled();
  });
});
