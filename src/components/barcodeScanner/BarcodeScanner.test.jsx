import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, waitFor, act } from "@testing-library/react";
import { __instances } from "html5-qrcode";
import BarcodeScanner from "./BarcodeScanner";
import { renderWithProviders } from "../../test/renderWithProviders";

vi.mock("html5-qrcode", () => {
  const instances = [];
  class FakeQr {
    constructor(id) {
      this.id = id;
      this.scanning = false;
      this.decodedCallback = null;
      this.start = vi.fn(async (_camera, _config, onDecoded) => {
        this.decodedCallback = onDecoded;
        this.scanning = true;
      });
      this.stop = vi.fn(async () => {
        this.scanning = false;
      });
      this.clear = vi.fn(async () => {});
      this.isScanning = () => this.scanning;
      instances.push(this);
    }
  }
  return {
    Html5Qrcode: FakeQr,
    Html5QrcodeScanType: { SCAN_TYPE_CAMERA: 0 },
    Html5QrcodeSupportedFormats: { CODE_128: 1, CODE_39: 2, EAN_13: 3, EAN_8: 4, UPC_A: 5, UPC_E: 6, UPC_EAN_EXTENSION: 7 },
    __instances: instances,
  };
});

const setup = (props = {}) => {
  const onClose = vi.fn();
  const onScanSuccess = vi.fn();
  const utils = renderWithProviders(
    <BarcodeScanner isOpen onClose={onClose} onScanSuccess={onScanSuccess} {...props} />,
  );
  return { ...utils, onClose, onScanSuccess };
};

beforeEach(() => {
  vi.clearAllMocks();
  __instances.length = 0;
  navigator.mediaDevices = {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
      getVideoTracks: () => [{ getSettings: () => ({ deviceId: "cam1" }) }],
    }),
    enumerateDevices: vi.fn().mockResolvedValue([
      { kind: "videoinput", deviceId: "cam1", label: "Back Camera" },
    ]),
  };
});

describe("BarcodeScanner", () => {
  it("renders nothing when closed", () => {
    const { container } = renderWithProviders(
      <BarcodeScanner isOpen={false} onClose={vi.fn()} onScanSuccess={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the camera and starts scanning", async () => {
    const { container } = setup();
    expect(container.querySelector("#barcode-scanner-container")).toBeInTheDocument();
    await waitFor(() => expect(__instances.length).toBeGreaterThan(0));
    await waitFor(() =>
      expect(container.querySelector(".barcode-scanner-instructions")).toBeInTheDocument(),
    );
  });

  it("reports a decoded barcode and closes", async () => {
    const { onScanSuccess, onClose } = setup();
    await waitFor(() => expect(__instances.length).toBeGreaterThan(0));

    const instance = __instances[0];
    await waitFor(() => expect(instance.start).toHaveBeenCalled());

    await act(async () => {
      await instance.decodedCallback("SI-123");
    });

    expect(onScanSuccess).toHaveBeenCalledWith("SI-123");
    expect(onClose).toHaveBeenCalled();
  });

  it("shows a permission error and a retry button", async () => {
    navigator.mediaDevices.getUserMedia.mockRejectedValue(new Error("denied"));
    const { container } = setup();

    await waitFor(() =>
      expect(container.querySelector(".barcode-scanner-error")).toBeInTheDocument(),
    );
    expect(container.querySelector(".barcode-scanner-retry")).toBeInTheDocument();
  });

  it("closes from the header button", async () => {
    const { container, onClose } = setup();
    await waitFor(() => expect(__instances.length).toBeGreaterThan(0));
    fireEvent.click(container.querySelector(".barcode-scanner-close"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
  });

  it("shows the scan title", async () => {
    const { container } = setup();
    await waitFor(() => expect(__instances.length).toBeGreaterThan(0));
    expect(container.querySelector(".barcode-scanner-title").textContent.length).toBeGreaterThan(0);
  });
});
