import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Html5Qrcode,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { X, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./BarcodeScanner.css";

const BarcodeScanner = ({ isOpen, onClose, onScanSuccess, theme = "dark" }) => {
  const { t } = useTranslation();
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const onScanSuccessRef = useRef(onScanSuccess);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onScanSuccessRef.current = onScanSuccess; }, [onScanSuccess]);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const stopScanning = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        if (
          html5QrCodeRef.current.isScanning &&
          html5QrCodeRef.current.isScanning()
        ) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch { void 0; }
      setIsScanning(false);
    }
  }, []);

  const handleScanSuccess = useCallback((barcode) => {
    stopScanning();
    if (onScanSuccessRef.current) {
      onScanSuccessRef.current(barcode);
    }
    if (onCloseRef.current) {
      onCloseRef.current();
    }
  }, [stopScanning]);

  const startScanning = useCallback(async () => {
    if (!scannerRef.current) return;

    try {
      setError(null);
      setIsScanning(true);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        stream.getTracks().forEach((track) => track.stop());
        setHasPermission(true);
      } catch {
        setHasPermission(false);
        setError(
          t("camera_permission_denied") ||
            "Camera permission denied. Please allow camera access.",
        );
        setIsScanning(false);
        return;
      }

      let cameraId = null;
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );

        for (const device of videoDevices) {

          const label = device.label.toLowerCase();
          if (
            label.includes("back") ||
            label.includes("rear") ||
            label.includes("environment")
          ) {
            cameraId = device.deviceId;
            break;
          }
        }

        if (!cameraId && videoDevices.length > 0) {

          try {
            const backStream = await navigator.mediaDevices.getUserMedia({
              video: { facingMode: { ideal: "environment" } },
            });
            const track = backStream.getVideoTracks()[0];
            const settings = track.getSettings();
            cameraId = settings.deviceId || null;
            backStream.getTracks().forEach((t) => t.stop());
          } catch { void 0; }
        }
      } catch { void 0; }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39,
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
        ],
      };

      const cameraConfig = cameraId
        ? { deviceId: { exact: cameraId } }
        : { facingMode: "environment" };

      await html5QrCodeRef.current.start(
        cameraConfig,
        config,
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {

        },
      );
    } catch (err) {

      if (err.message && err.message.includes("environment")) {
        try {
          const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.EAN_8,
              Html5QrcodeSupportedFormats.UPC_A,
              Html5QrcodeSupportedFormats.UPC_E,
              Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
            ],
          };

          await html5QrCodeRef.current.start(
            { facingMode: { ideal: "environment" } },
            config,
            (decodedText) => {
              handleScanSuccess(decodedText);
            },
            () => {},
          );
          return;
        } catch { void 0; }
      }

      setError(err.message || t("camera_error") || "Failed to start camera");
      setIsScanning(false);
    }
  }, [t, handleScanSuccess]);

  useEffect(() => {
    if (isOpen) {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("barcode-scanner-container");
      }
      startScanning(); // eslint-disable-line react-hooks/set-state-in-effect
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen, startScanning, stopScanning]);

  const handleClose = async () => {
    await stopScanning();
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current = null;
    }
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`barcode-scanner-overlay barcode-scanner-overlay--${theme}`}
    >
      <div className={`barcode-scanner-modal barcode-scanner-modal--${theme}`}>
        <div className="barcode-scanner-header">
          <h3 className="barcode-scanner-title">
            {t("scan_barcode") || "Scan Barcode"}
          </h3>
          <button
            className="barcode-scanner-close"
            onClick={handleClose}
            aria-label={t("close") || "Close"}
          >
            <X size={24} />
          </button>
        </div>

        <div className="barcode-scanner-content">
          {error && (
            <div className="barcode-scanner-error">
              <p>{error}</p>
              {hasPermission === false && (
                <button
                  className="barcode-scanner-retry"
                  onClick={startScanning}
                >
                  {t("try_again") || "Try Again"}
                </button>
              )}
            </div>
          )}

          {!error && (
            <div
              id="barcode-scanner-container"
              ref={scannerRef}
              className="barcode-scanner-container"
            />
          )}

          {isScanning && !error && (
            <div className="barcode-scanner-instructions">
              <Camera size={20} />
              <p>{t("point_camera_at_barcode") || "Point camera at barcode"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
