import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import ChangePasswordModal from "./ChangePasswordModal";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  default: { put: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

describe("ChangePasswordModal", () => {
  it("renders nothing when closed", () => {
    const { container } = renderWithProviders(
      <ChangePasswordModal isOpen={false} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("blocks submission when confirmation does not match", () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangePasswordModal isOpen onClose={onClose} />,
    );
    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0], { target: { value: "old123" } });
    fireEvent.change(inputs[1], { target: { value: "new1234" } });
    fireEvent.change(inputs[2], { target: { value: "different" } });
    fireEvent.submit(container.querySelector("form"));

    expect(api.put).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("submits password change, updates token and closes on success", async () => {
    api.put.mockResolvedValue({
      data: { success: true, data: { token: "fresh-jwt" } },
    });
    const onClose = vi.fn();
    const { container } = renderWithProviders(
      <ChangePasswordModal isOpen onClose={onClose} />,
    );
    const inputs = container.querySelectorAll("input");
    fireEvent.change(inputs[0], { target: { value: "old123" } });
    fireEvent.change(inputs[1], { target: { value: "newPass123" } });
    fireEvent.change(inputs[2], { target: { value: "newPass123" } });
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() =>
      expect(api.put).toHaveBeenCalledWith("/auth/change-password", {
        current_password: "old123",
        new_password: "newPass123",
      }),
    );
    expect(localStorage.getItem("token")).toBe("fresh-jwt");
    expect(toast.success).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).toBeInTheDocument();
  });
});
