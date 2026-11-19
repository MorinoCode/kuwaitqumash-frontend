import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FABRIC_TYPES,
  PATTERNS,
  COLORS,
  UNITS,
  COUNTRIES,
  localizedOption,
  localizeWords,
  localizeItemName,
  getRollBreakdown,
} from "../../utils/inventoryCategories";

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

import "./ItemDetailsPage.css";
import {
  ArrowLeft,
  Trash2,
  Printer,
  Edit3,
  X,
} from "lucide-react";

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const currency = t("kwd") || "KWD";

  const {
    data: item,
    isLoading: loading,
    refetch: refetchItem,
  } = useInventoryItem(id);
  const deleteItemMutation = useDeleteInventoryItem();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const printRef = useRef(null);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

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

  useEffect(() => {
    if (!loading && !item && id) {
      navigate("/inventory");
    }
  }, [loading, item, id, navigate]);

  const handleEditSuccess = () => {
    refetchItem();
    setIsEditModalOpen(false);
  };

  const handleDeleteItem = async () => {
    setConfirmMessage(t("confirm_delete_item_permanent"));
    setConfirmAction(() => async () => {
      try {
        await deleteItemMutation.mutateAsync(id);
        navigate("/inventory");
      } catch {

        setIsConfirmModalOpen(false);
      }
    });
    setIsConfirmModalOpen(true);
  };

  if (loading || !item)
    return (
      <div
        className={`item-details item-details--${theme} item-details--loading`}
      >
        {t("loading")}
      </div>
    );

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
        <div className="item-info">
          <h1 className="item-info__title">
            {localizeItemName(item.item_name, i18n.language)}
          </h1>

          {item.item_name_ar && (
            <p className="item-info__title-ar" dir="rtl">
              {item.item_name_ar}
            </p>
          )}

          <div className="item-info__grid">
            <div className="item-info__group">
              <label>{t("fabric_type")}</label>
              <p className="item-info__value">
                {item.fabric_type ? localizedOption(FABRIC_TYPES, item.fabric_type, i18n.language) : "-"}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("pattern") || "Pattern"}</label>
              <p className="item-info__value">
                {item.pattern ? localizedOption(PATTERNS, item.pattern, i18n.language) : "-"}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("color") || "Color"}</label>
              <p className="item-info__value">
                {item.color ? localizedOption(COLORS, item.color, i18n.language) : "-"}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("composition") || "Composition"}</label>
              <p className="item-info__value">
                {item.composition ? localizeWords(item.composition, i18n.language) : "-"}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("unit") || "Sale unit"}</label>
              <p className="item-info__value">
                {localizedOption(UNITS, item.unit === "roll" ? "roll" : "meter", i18n.language)}
              </p>
            </div>
            {(() => {
              const { totalMeters, rollLength, fullRolls, remainderMeters } =
                getRollBreakdown(item);
              return (
                <>
                  <div className="item-info__group">
                    <label>{t("stock_meters") || "Stock (m)"}</label>
                    <p className="item-info__value">
                      {totalMeters} {t("m") || "m"}
                    </p>
                    {rollLength > 0 && (
                      <small style={{ opacity: 0.7 }}>
                        {remainderMeters > 0
                          ? `${fullRolls} ${t("full_rolls") || "full roll(s)"} + ${remainderMeters} ${t("m") || "m"}`
                          : `${fullRolls} ${t("roll") || "roll"} × ${rollLength} ${t("m") || "m"}`}
                      </small>
                    )}
                  </div>
                  {rollLength > 0 && (
                    <div className="item-info__group">
                      <label>{t("length_per_roll_m") || "Length per roll (m)"}</label>
                      <p className="item-info__value">
                        {rollLength} {t("m") || "m"}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
            <div className="item-info__group">
              <label>{t("min_stock")}</label>
              <p className="item-info__value">
                {item.min_stock_level || 0} {t("m") || "m"}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("cost_per_meter")}</label>
              <p className="item-info__value">
                {(parseFloat(item.cost_per_meter) || 0).toFixed(3)} {currency}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("price_per_meter") || "Selling price per meter"}</label>
              <p className="item-info__value">
                {(parseFloat(item.price_per_meter) || 0).toFixed(3)} {currency}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("country")}</label>
              <p className="item-info__value">
                {item.country_of_origin
                  ? localizedOption(COUNTRIES, item.country_of_origin, i18n.language)
                  : t("na")}
              </p>
            </div>
            <div className="item-info__group">
              <label>{t("barcode")}</label>
              <p className="item-info__value">{item.barcode || "-"}</p>
            </div>
            <div className="item-info__group">
              <label>{t("status")}</label>
              <p className="item-info__value">
                {t(item.status?.toLowerCase().replace(" ", "_") || "in_stock")}
              </p>
            </div>

          </div>
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

              <div className="print-preview-area">
                <BarcodeLabel
                  item={item}
                  shopName={useTenantStore.getState().tenantName || ""}
                  showShopName={false}
                />
              </div>

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
