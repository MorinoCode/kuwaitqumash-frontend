import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api from "../../api/axios";
import "./LogoUpload.css";

const LogoUpload = ({
  branchId,
  currentLogoUrl,
  onLogoUpdated,
  theme = "light",
}) => {
  const { t } = useTranslation();
  const [localLogoUrl, setLocalLogoUrl] = useState(currentLogoUrl);
  const prevLogoUrlRef = React.useRef(currentLogoUrl);

  // Sync localLogoUrl with currentLogoUrl prop
  // Only update if currentLogoUrl is a real change (not undefined/null during refetch)
  // This prevents clearing the logo during refetch operations
  React.useEffect(() => {
    // Update if:
    // 1. currentLogoUrl is explicitly provided (not undefined) AND
    // 2. It's different from the previous value
    // This allows null values (when logo is deleted) but prevents clearing during refetch
    if (currentLogoUrl !== undefined) {
      if (currentLogoUrl !== prevLogoUrlRef.current) {
        setLocalLogoUrl(currentLogoUrl);
        prevLogoUrlRef.current = currentLogoUrl;
      }
    }
  }, [currentLogoUrl]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  // Convert cropped image to blob
  const getCroppedImg = useCallback((image, crop) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/webp",
        0.9,
      );
    });
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("invalid_file_type") || "Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("file_too_large") || "File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result);
      setShowCropModal(true);
      // Set initial crop to center square
      setCrop({
        unit: "px",
        width: 200,
        height: 200,
        x: 0,
        y: 0,
      });
    });
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async () => {
    if (!imgRef.current || !completedCrop) {
      toast.error(t("please_select_area") || "Please select an area to crop");
      return;
    }

    try {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop,
      );

      // Create FormData
      const formData = new FormData();
      formData.append("logo", croppedImageBlob, "logo.webp");

      setUploading(true);
      const res = await api.post(
        `/manage/branches/${branchId}/logo`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      // Update local state immediately with the new logo URL
      const newLogoUrl = res.data.data.logo_url;
      setLocalLogoUrl(newLogoUrl);

      // Close modal and reset form
      setShowCropModal(false);
      setImgSrc("");
      setCrop(null);
      setCompletedCrop(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Show success message
      toast.success(
        t("logo_uploaded_successfully") || "Logo uploaded successfully",
      );

      // Call onLogoUpdated callback, but don't let its errors affect this function
      if (onLogoUpdated) {
        try {
          await onLogoUpdated(newLogoUrl);
        } catch {
          // Silently ignore callback errors
        }
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        t("upload_failed") ||
        "Failed to upload logo";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteLogo = async () => {
    if (
      !window.confirm(
        t("confirm_delete_logo") || "Are you sure you want to delete the logo?",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/manage/branches/${branchId}/logo`);
      toast.success(
        t("logo_deleted_successfully") || "Logo deleted successfully",
      );

      // Update local state immediately
      setLocalLogoUrl(null);

      if (onLogoUpdated) {
        await onLogoUpdated(null);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        t("delete_failed") ||
        "Failed to delete logo";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Use localLogoUrl for display (updates immediately)
  const displayLogoUrl = localLogoUrl || currentLogoUrl;

  return (
    <div className={`logo-upload logo-upload--${theme}`}>
      <div className="logo-upload__preview">
        {displayLogoUrl ? (
          <div className="logo-upload__preview-wrapper">
            <img
              src={displayLogoUrl}
              alt="Branch logo"
              className="logo-upload__preview-img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <button
              type="button"
              className="logo-upload__delete-btn"
              onClick={handleDeleteLogo}
              disabled={deleting}
              aria-label={t("delete_logo") || "Delete logo"}
            >
              {deleting ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <X size={16} />
              )}
            </button>
          </div>
        ) : (
          <div className="logo-upload__placeholder">
            <ImageIcon size={48} />
            <p>{t("no_logo_uploaded") || "No logo uploaded"}</p>
          </div>
        )}
      </div>

      <div className="logo-upload__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="logo-upload__file-input"
          id={`logo-upload-${branchId}`}
        />
        <label
          htmlFor={`logo-upload-${branchId}`}
          className="logo-upload__upload-btn"
        >
          <Upload size={16} />
          {displayLogoUrl
            ? t("change_logo") || "Change Logo"
            : t("upload_logo") || "Upload Logo"}
        </label>
      </div>

      {/* Crop Modal */}
      {showCropModal && imgSrc && (
        <div className="logo-upload__modal">
          <div className="logo-upload__modal-content">
            <h3 className="logo-upload__modal-title">
              {t("crop_logo") || "Crop Logo"}
            </h3>
            <p className="logo-upload__modal-hint">
              {t("select_area_to_crop") ||
                "Select the area you want to use as logo"}
            </p>

            <div className="logo-upload__crop-container">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={null} // Free aspect ratio
                minWidth={100}
                minHeight={100}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop preview"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                  onLoad={() => {
                    // Set initial crop to center square
                    if (imgRef.current) {
                      const { width, height } = imgRef.current;
                      const size = Math.min(width, height, 300);
                      setCrop({
                        unit: "px",
                        width: size,
                        height: size,
                        x: (width - size) / 2,
                        y: (height - size) / 2,
                      });
                    }
                  }}
                />
              </ReactCrop>
            </div>

            <div className="logo-upload__modal-actions">
              <button
                type="button"
                className="logo-upload__btn logo-upload__btn--secondary"
                onClick={() => {
                  setShowCropModal(false);
                  setImgSrc("");
                  setCrop(null);
                  setCompletedCrop(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                type="button"
                className="logo-upload__btn logo-upload__btn--primary"
                onClick={handleCropComplete}
                disabled={uploading || !completedCrop}
              >
                {uploading ? (
                  <>
                    <Loader2 size={16} className="spin" />{" "}
                    {t("uploading") || "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload size={16} /> {t("upload") || "Upload"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoUpload;
