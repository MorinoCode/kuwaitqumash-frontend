import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import useTenantStore from "../../store/tenantStore";
import {
  useInventoryItem,
  useDeleteInventoryItem,
} from "../../hooks/useInventory";
import { BarcodeLabel } from "../../components/barcode/BarcodeLabel";
import AddItemModal from "../../components/addItemModal/AddItemModal";
import useBranchStore from "../../store/branchStore";
import {
  METAL_CATEGORIES,
  DIAMOND_CUTS,
  DIAMOND_COLORS,
  DIAMOND_CLARITY,
  DIAMOND_SHAPES,
  DIAMOND_SETTINGS,
  STONE_TYPES,
} from "../../utils/inventoryCategories";
import "./ItemDetailsPage.css";
import {
  ArrowLeft,
  Trash2,
  Printer,
  Edit3,
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Gem,
} from "lucide-react";

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const currency = "KWD";

  // Use React Query hooks
  const {
    data: item,
    isLoading: loading,
    refetch: refetchItem,
  } = useInventoryItem(id);
  const deleteItemMutation = useDeleteInventoryItem();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Print Logic
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const printRef = useRef(null);
  const imagePrintRef = useRef(null);

  // Confirm Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Get active branch ID
  const { activeBranchId } = useBranchStore();

  const handlePrintConfirm = useReactToPrint({
    contentRef: printRef,
    onBeforeGetContent: () => {
      if (!item) {
        toast.error(t("print_error") || "Print failed. Please try again.");
        return Promise.resolve();
      }
      if (!printRef.current) {
        toast.error(t("print_error") || "Print failed. Please try again.");
        return Promise.resolve();
      }
      return Promise.resolve();
    },
    onAfterPrint: () => {
      setIsPrintModalOpen(false);
    },
    onPrintError: () => {
      toast.error(t("print_error") || "Print failed. Please try again.");
    },
    pageStyle: `
            @page { 
                size: 55mm 18mm; 
                margin: 0; 
            }
            body { 
                margin: 0; 
                padding: 0;
            }
            @media print {
                body * {
                    visibility: hidden;
                }
                .barcode-label-container,
                .barcode-label-container * {
                    visibility: visible;
                }
                .barcode-label-container {
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
        `,
  });

  const handlePrintImage = useReactToPrint({
    contentRef: imagePrintRef,
    onBeforeGetContent: () => {
      return new Promise((resolve) => {
        const doPrepare = async () => {
          const el = imagePrintRef.current;
          if (!el) {
            resolve();
            return;
          }

          const img = el.querySelector("img");
          if (!img || !img.src) {
            resolve();
            return;
          }

          if (img.src.startsWith("data:")) {
            resolve();
            return;
          }

          const loadingToast = toast.loading(
            t("preparing_print") || "Preparing image...",
          );

          try {
            const separator = img.src.includes("?") ? "&" : "?";
            const freshUrl = `${img.src}${separator}t=${new Date().getTime()}`;

            const response = await fetch(freshUrl, {
              mode: "cors",
              cache: "no-store",
            });

            if (!response.ok) throw new Error("Network error");

            const blob = await response.blob();
            const reader = new FileReader();

            reader.onloadend = () => {
              img.src = reader.result;
              toast.dismiss(loadingToast);
              setTimeout(() => resolve(), 500);
            };
            reader.onerror = () => {
              toast.dismiss(loadingToast);
              resolve();
            };
            reader.readAsDataURL(blob);
          } catch {
            toast.dismiss(loadingToast);
            resolve();
          }
        };
        doPrepare();
      });
    },
    onPrintError: () => {
      toast.error(t("print_error"));
    },
    pageStyle: `
            @page { size: A4; margin: 0; }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            .print-image-container {
                display: flex !important;
                justify-content: center !important;
                align-items: center !important;
                width: 100vw !important;
                height: 100vh !important;
                background: white !important;
            }
            .print-image-container img {
                max-width: 95% !important;
                max-height: 95% !important;
                object-fit: contain !important;
                display: block !important;
            }
        `,
  });

  // Swipe logic state
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // No need for formData and stones state - AddItemModal handles it

  // Navigate if item not found
  useEffect(() => {
    if (!loading && !item && id) {
      navigate("/inventory");
    }
  }, [loading, item, id, navigate]);

  const handleEditSuccess = () => {
    refetchItem();
    setIsEditModalOpen(false);
  };

  // Image deletion is now handled in AddItemModal

  const handleDeleteItem = async () => {
    setConfirmMessage(t("confirm_delete_item_permanent"));
    setConfirmAction(() => async () => {
      try {
        await deleteItemMutation.mutateAsync(id);
        navigate("/inventory");
      } catch {
        // Error is handled by mutation's onError
        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${API_URL}${cleanUrl}`;
  };

  const handleNextImage = () => {
    const totalImages = item?.images?.length || 0;
    if (totalImages <= 1) return;
    setSelectedImageIndex((prev) => (prev + 1) % totalImages);
  };

  const handlePrevImage = () => {
    const totalImages = item?.images?.length || 0;
    if (totalImages <= 1) return;
    setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const onTouchStart = (e) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNextImage();
    if (isRightSwipe) handlePrevImage();
  };

  if (loading || !item)
    return (
      <div
        className={`item-details item-details--${theme} item-details--loading`}
      >
        {t("loading")}
      </div>
    );

  const currentImages = item.images || [];
  const allImages = currentImages;

  const mainImageSrc =
    allImages.length > 0
      ? getImageUrl(currentImages[selectedImageIndex])
      : null;

  return (
    <div className={`item-details item-details--${theme}`}>
      <header className="item-details__header">
        <button
          className="item-details__back-btn"
          onClick={() => navigate("/inventory")}
        >
          <ArrowLeft size={20} /> {t("back")}
        </button>
        <div className="item-details__actions">
          <button
            className="item-action-btn"
            onClick={() => setIsPrintModalOpen(true)}
          >
            <Printer size={18} /> {t("print")}
          </button>
          <button
            className="item-action-btn item-action-btn--primary"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit3 size={18} /> {t("edit")}
          </button>
          <button
            className="item-action-btn item-action-btn--danger"
            onClick={handleDeleteItem}
          >
            <Trash2 size={18} /> {t("delete")}
          </button>
        </div>
      </header>

      <div className="item-details__content">
        <div className="item-gallery">
          <div
            className="item-gallery__main"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {allImages.length > 0 ? (
              <>
                <img
                  src={mainImageSrc}
                  alt="Main Item"
                  loading="lazy"
                  onError={(e) => {
                    const placeholder =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXJyb3I8L3RleHQ+PC9zdmc+";
                    e.target.src = placeholder;
                  }}
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      className="item-gallery__arrow item-gallery__arrow--prev"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="item-gallery__arrow item-gallery__arrow--next"
                      onClick={handleNextImage}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="item-gallery__placeholder">
                <ImageIcon size={48} /> {t("no_images")}
              </div>
            )}
          </div>

          <div className="item-gallery__thumbnails">
            {currentImages.map((img, idx) => (
              <div
                key={idx}
                className={`item-gallery__thumb ${selectedImageIndex === idx ? "item-gallery__thumb--active" : ""}`}
                onClick={() => setSelectedImageIndex(idx)}
              >
                <img
                  src={getImageUrl(img)}
                  alt={`thumb-${idx}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {allImages.length > 0 && mainImageSrc && (
            <>
              <div
                style={{
                  position: "fixed",
                  left: "-10000px",
                  top: 0,
                  width: "210mm",
                  height: "297mm",
                  zIndex: -9999,
                  overflow: "hidden",
                }}
              >
                <div
                  ref={imagePrintRef}
                  className="print-image-container"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={mainImageSrc}
                    alt="Print View"
                    crossOrigin="anonymous"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>

              <div className="item-gallery__print-image-wrap">
                <button
                  type="button"
                  className="item-action-btn item-action-btn--secondary"
                  onClick={() => handlePrintImage()}
                >
                  <Printer size={16} />{" "}
                  {t("print_this_image") || "Print this image"}
                </button>
              </div>
            </>
          )}

          <div className="item-details__barcode">
            <p>
              {t("barcode")}: <strong>{item.barcode}</strong>
            </p>
          </div>
        </div>

        <div className="item-info">
          <h1 className="item-info__title">{item.item_name}</h1>

          {/* Item Name AR */}
          {item.item_name_ar && (
            <p className="item-info__title-ar" dir="rtl">
              {item.item_name_ar}
            </p>
          )}

          <div className="item-info__grid">
            {/* Metal Type */}
            <div className="item-info__group">
              <label>{t("metal_type")}</label>
              <p className="item-info__value">{item.metal_type}</p>
            </div>

            {/* Category - Dynamic based on Metal Type */}
            <div className="item-info__group">
              <label>{t("category")}</label>
              <p className="item-info__value">{item.category}</p>
            </div>

            {/* Country */}
            <div className="item-info__group">
              <label>{t("country")}</label>
              <p className="item-info__value">
                {item.country_of_origin || t("na")}
              </p>
            </div>

            {/* Karat - Only for Gold/Silver/Platinum */}
            {item.metal_type !== "Diamond" && (
              <div className="item-info__group">
                <label>{t("karat")}</label>
                <p className="item-info__value">
                  {item.karat ? `${item.karat}K` : "-"}
                </p>
              </div>
            )}

            {/* Weight */}
            <div className="item-info__group">
              <label>{t("weight")}</label>
              <p className="item-info__value">
                {item.weight} {t("g")}
              </p>
            </div>

            {/* Quantity */}
            <div className="item-info__group">
              <label>{t("quantity")}</label>
              <p className="item-info__value">{item.quantity || 1}</p>
            </div>

            {/* Min Stock Level */}
            <div className="item-info__group">
              <label>{t("min_stock")}</label>
              <p className="item-info__value">{item.min_stock_level || 2}</p>
            </div>

            {/* Buy Price */}
            <div className="item-info__group">
              <label>{t("buy_price_per_gram")}</label>
              <p className="item-info__value">
                {item.buy_price_per_gram} {currency}
              </p>
            </div>

            {/* Status */}
            <div className="item-info__group">
              <label>{t("status")}</label>
              <p className="item-info__value">
                {t(item.status?.toLowerCase().replace(" ", "_") || "in_stock")}
              </p>
            </div>
          </div>

          {/* Diamond Specifications */}
          {item.metal_type === "Diamond" && (
            <div className="item-info__section">
              <h3 className="item-info__section-title">
                {t("diamond_specifications")}
              </h3>
              <div className="item-info__grid">
                <div className="item-info__group">
                  <label>{t("carat")}</label>
                  <p className="item-info__value">
                    {item.diamond_carat ? `${item.diamond_carat}ct` : "-"}
                  </p>
                </div>
                <div className="item-info__group">
                  <label>{t("cut")}</label>
                  <p className="item-info__value">{item.diamond_cut || "-"}</p>
                </div>
                <div className="item-info__group">
                  <label>{t("color")}</label>
                  <p className="item-info__value">
                    {item.diamond_color || "-"}
                  </p>
                </div>
                <div className="item-info__group">
                  <label>{t("clarity")}</label>
                  <p className="item-info__value">
                    {item.diamond_clarity || "-"}
                  </p>
                </div>
                <div className="item-info__group">
                  <label>{t("shape")}</label>
                  <p className="item-info__value">
                    {item.diamond_shape || "-"}
                  </p>
                </div>
                <div className="item-info__group">
                  <label>{t("setting")}</label>
                  <p className="item-info__value">
                    {item.diamond_setting || "-"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stones Section - For Gold, Silver, Platinum */}
          {["Gold", "Silver", "Platinum"].includes(item.metal_type) && (
            <div className="item-info__section">
              <h3 className="item-info__section-title">{t("stones")}</h3>
              {item.stones &&
              Array.isArray(item.stones) &&
              item.stones.length > 0 ? (
                <div className="item-info__stones-list">
                  {item.stones.map((stone, index) => (
                    <div key={index} className="item-info__stone-item">
                      <Gem size={16} />
                      <span>
                        <strong>{stone.type}</strong> - {stone.weight}
                        {stone.unit === "ct" ? "ct" : "g"}
                      </span>
                      {stone.has_value && (
                        <span className="item-info__badge">
                          {t("has_value")}{" "}
                          {stone.value ? `(${stone.value} KD)` : ""}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="item-info__empty-state">{t("no_stones")}</p>
              )}
            </div>
          )}

          {/* Descriptions */}
          <div className="item-info__desc">
            <label>{t("description_en")}</label>
            <p className="item-info__text-box">
              {item.description && item.description.trim() !== ""
                ? item.description
                : "-"}
            </p>
          </div>
          <div className="item-info__desc">
            <label>{t("description_ar")}</label>
            <p
              className="item-info__text-box item-info__text-box--rtl"
              dir="rtl"
            >
              {item.description_ar && item.description_ar.trim() !== ""
                ? item.description_ar
                : "-"}
            </p>
          </div>
        </div>
      </div>

      {/* PRINT MODAL */}
      {isPrintModalOpen && item && (
        <div className="details-modal-overlay">
          <div className={`details-modal details-modal--${theme}`}>
            <div className="details-modal__header">
              <h2>{t("preview") || "Preview"}</h2>
              <button
                className="details-modal__close"
                onClick={() => setIsPrintModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="details-modal__body">
              {/* Visual Preview */}
              <div className="print-preview-area">
                <BarcodeLabel
                  item={item}
                  shopName={useTenantStore.getState().tenantName || ""}
                  showShopName={false}
                />
              </div>

              {/* Hidden Component for ReactToPrint */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  visibility: "hidden",
                  width: "55mm",
                  height: "12mm",
                }}
              >
                <BarcodeLabel
                  ref={printRef}
                  item={item}
                  shopName={useTenantStore.getState().tenantName || ""}
                  showShopName={false}
                />
              </div>

              <button
                className="item-action-btn item-action-btn--primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (!item) {
                    toast.error(t("item_not_loaded") || "Item not loaded");
                    return;
                  }
                  if (!printRef.current) {
                    toast.error(
                      t("print_ref_error") ||
                        "Print preview not ready. Please try again.",
                    );
                    return;
                  }
                  handlePrintConfirm();
                }}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <Printer size={18} /> {t("print")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {isConfirmModalOpen && (
        <div className="details-modal-overlay">
          <div className={`details-modal details-modal--${theme}`}>
            <div className="details-modal__header">
              <h2>{t("confirm") || "Confirm"}</h2>
              <button
                className="details-modal__close"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <div className="details-modal__body">
              <p>{confirmMessage}</p>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button
                  className="item-action-btn item-action-btn--secondary"
                  onClick={() => setIsConfirmModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  {t("cancel")}
                </button>
                <button
                  className="item-action-btn item-action-btn--danger"
                  onClick={() => confirmAction && confirmAction()}
                  style={{ flex: 1 }}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <AddItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        activeBranchId={activeBranchId}
        itemToEdit={item}
      />
    </div>
  );
};

export default ItemDetailsPage;
