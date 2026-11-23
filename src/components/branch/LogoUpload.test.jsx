import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import LogoUpload from "./LogoUpload";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("../../api/axios", () => ({
  apiBaseURL: "http://localhost:5001/api",
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

vi.mock("react-toastify", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock("react-image-crop", () => ({
  default: ({ children }) => <div data-testid="crop">{children}</div>,
}));

const makeFile = (name, type, size) => {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

const selectFile = (container, file) => {
  const input = container.querySelector(".logo-upload__file-input");
  fireEvent.change(input, { target: { files: [file] } });
};

beforeEach(() => {
  vi.clearAllMocks();
  window.confirm = vi.fn(() => true);
});

describe("LogoUpload", () => {
  it("shows the placeholder without a logo", () => {
    const { container } = renderWithProviders(<LogoUpload branchId={1} />);
    expect(container.querySelector(".logo-upload__placeholder")).toBeInTheDocument();
  });

  it("shows the current logo", () => {
    const { container } = renderWithProviders(
      <LogoUpload branchId={1} currentLogoUrl="/logo.webp" />,
    );
    expect(container.querySelector(".logo-upload__preview-img")).toHaveAttribute(
      "src",
      "/logo.webp",
    );
  });

  it("prefixes backend origin for local /uploads logos", () => {
    const { container } = renderWithProviders(
      <LogoUpload branchId={1} currentLogoUrl="/uploads/store/logo.png" />,
    );
    expect(container.querySelector(".logo-upload__preview-img")).toHaveAttribute(
      "src",
      "http://localhost:5001/uploads/store/logo.png",
    );
  });

  it("rejects a non-image file", () => {
    const { container } = renderWithProviders(<LogoUpload branchId={1} />);
    selectFile(container, makeFile("a.pdf", "application/pdf", 10));
    expect(toast.error).toHaveBeenCalled();
    expect(container.querySelector(".logo-upload__modal")).toBeNull();
  });

  it("rejects a file larger than 5MB", () => {
    const { container } = renderWithProviders(<LogoUpload branchId={1} />);
    selectFile(container, makeFile("a.png", "image/png", 6 * 1024 * 1024));
    expect(toast.error).toHaveBeenCalled();
  });

  it("opens the crop modal for a valid image", async () => {
    const { container } = renderWithProviders(<LogoUpload branchId={1} />);
    selectFile(container, makeFile("a.png", "image/png", 1024));
    await waitFor(() =>
      expect(container.querySelector(".logo-upload__modal")).toBeInTheDocument(),
    );
  });

  it("deletes the logo after confirmation", async () => {
    api.delete.mockResolvedValue({ data: { success: true } });
    const onLogoUpdated = vi.fn().mockResolvedValue(undefined);
    const { container } = renderWithProviders(
      <LogoUpload branchId={1} currentLogoUrl="/logo.webp" onLogoUpdated={onLogoUpdated} />,
    );

    fireEvent.click(container.querySelector(".logo-upload__delete-btn"));

    await waitFor(() => expect(api.delete).toHaveBeenCalledWith("/manage/branches/1/logo"));
    expect(toast.success).toHaveBeenCalled();
    expect(onLogoUpdated).toHaveBeenCalledWith(null);
  });

  it("keeps the logo when deletion is cancelled", () => {
    window.confirm = vi.fn(() => false);
    const { container } = renderWithProviders(
      <LogoUpload branchId={1} currentLogoUrl="/logo.webp" />,
    );
    fireEvent.click(container.querySelector(".logo-upload__delete-btn"));
    expect(api.delete).not.toHaveBeenCalled();
  });

  it("reports a failed deletion", async () => {
    api.delete.mockRejectedValue({ response: { data: { message: "nope" } } });
    const { container } = renderWithProviders(
      <LogoUpload branchId={1} currentLogoUrl="/logo.webp" />,
    );
    fireEvent.click(container.querySelector(".logo-upload__delete-btn"));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("nope"));
  });

  it("offers change logo when a logo exists", () => {
    renderWithProviders(<LogoUpload branchId={1} currentLogoUrl="/logo.webp" />);
    expect(screen.getByText(/change logo|تغییر لوگو|لوگو/i)).toBeInTheDocument();
  });
});
