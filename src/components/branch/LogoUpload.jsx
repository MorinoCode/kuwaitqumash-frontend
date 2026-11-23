import React, { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import api, { apiBaseURL } from "../../api/axios";
import "./LogoUpload.css";

const resolveLogoSrc = (url) => {
  if (!url || typeof url !== "string") return null;
  if (url.startsWith("/uploads/")) {
    const origin =
      typeof apiBaseURL === "string"
        ? apiBaseURL.replace(/\/api\/?$/, "")
        : "";
    return origin ? `${origin}${url}` : url;
  }
  return url;
};

const LogoUpload = ({
  branchId,
  currentLogoUrl,
  onLogoUpdated,
  theme = "light",
}) => {
  const { t } = useTranslation();
  const [localLogoUrl, setLocalLogoUrl] = useState(currentLogoUrl);
  const prevLogoUrlRef = React.useRef(currentLogoUrl);

  React.useEffect(() => {

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

    if (!file.type.startsWith("image/")) {
      toast.error(t("invalid_file_type") || "Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("file_too_large") || "File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result);
      setShowCropModal(true);

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

      const newLogoUrl = res.data.data.logo_url;
      setLocalLogoUrl(newLogoUrl);

      setShowCropModal(false);
      setImgSrc("");
      setCrop(null);
      setCompletedCrop(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      toast.success(
        t("logo_uploaded_successfully") || "Logo uploaded successfully",
      );

      if (onLogoUpdated) {
        try {
          await onLogoUpdated(newLogoUrl);
        } catch { void 0; }
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

  const displayLogoUrl = localLogoUrl || currentLogoUrl;
  const resolvedLogoSrc = resolveLogoSrc(displayLogoUrl);

  return (
    <div className={`logo-upload logo-upload--${theme}`}>
      <div className="logo-upload__preview">
        {resolvedLogoSrc ? (
          <div className="logo-upload__preview-wrapper">
            <img
              src={resolvedLogoSrc}
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
                aspect={null}
                minWidth={100}
                minHeight={100}
              >
                <img
                  ref={imgRef}
                  src={imgSrc}
                  alt="Crop preview"
                  style={{ maxWidth: "100%", maxHeight: "400px" }}
                  onLoad={() => {

                    if (imgRef.current) {
                      const { width, height } = imgRef.current;
                      const size = Math.min(width, height, 300);
                      const initialCrop = {
                        unit: "px",
                        width: size,
                        height: size,
                        x: (width - size) / 2,
                        y: (height - size) / 2,
                      };
                      setCrop(initialCrop);
                      setCompletedCrop(initialCrop);
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
