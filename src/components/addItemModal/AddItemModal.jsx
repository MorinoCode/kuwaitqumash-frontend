import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useTheme } from "../../context/ThemeContext";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
} from "../../hooks/useInventory";
import {
  optionValue,
  optionLabel,
  getTotalStockMeters,
  COUNTRIES,
  FABRIC_TYPES,
  PATTERNS,
  COMPOSITIONS,
  COLORS,
  UNITS,
} from "../../utils/inventoryCategories";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";
import { Plus, X, Loader2 } from "lucide-react";
import SuggestionInput from "../suggestionInput/SuggestionInput";
import "./AddItemModal.css";
import "../../pages/inventoryPage/InventoryPage.css";

const round3 = (value) => Math.round((Number(value) || 0) * 1000) / 1000;

const EMPTY_ITEM = {
  item_name: "",
  fabric_type: "",
  composition: "",
  pattern: "",
  color: "",
  unit: "meter",
  length_m: "",
  roll_length_m: "",
  roll_count: 1,
  min_stock_level: 5,
  cost_per_meter: "",
  price_per_meter: "",
  country_of_origin: "Kuwait",
  barcode: "",
  description: "",
  description_ar: "",
};

const num = (value) => {
  const n = parseFloat(normalizeToLatinDigits(String(value ?? "")));
  return Number.isFinite(n) ? n : undefined;
};

const AddItemModal = ({
  isOpen,
  onClose,
  onSuccess,
  activeBranchId,
  itemToEdit = null,
}) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const createItemMutation = useCreateInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();

  const isEditMode = !!itemToEdit;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_ITEM);
  // True when editing a roll item that already has partial meters cut (e.g. 117m of 30m rolls)
  const [isPartialRollEdit, setIsPartialRollEdit] = useState(false);

  const update = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    if (key === "unit") {
      setIsPartialRollEdit(false);
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Suggestions keep the same label-based values the datalists produced.
  const suggestionOptions = (list) =>
    list.map((option) => {
      const label = optionLabel(option, i18n.language);
      return { value: label, label };
    });

  useEffect(() => {
    if (!isOpen) return;
    if (itemToEdit) {
      const normalizedUnit = itemToEdit.unit === "roll" ? "roll" : "meter";
      const totalMeters = getTotalStockMeters(itemToEdit);
      const savedRollLen = parseFloat(itemToEdit.roll_length_m) || 0;
      const legacyQty = parseInt(itemToEdit.quantity, 10) || 1;

      let rollLen = "";
      let rollCount = 1;
      let partialRoll = false;

      if (normalizedUnit === "roll") {
        if (savedRollLen > 0) {
          rollLen = savedRollLen;
          const exactRolls = totalMeters / savedRollLen;
          if (exactRolls > 0 && Math.abs(exactRolls - Math.round(exactRolls)) < 0.001) {
            rollCount = Math.max(1, Math.round(exactRolls));
          } else {
            partialRoll = true;
          }
        } else if (legacyQty > 1 && parseFloat(itemToEdit.length_m) > 0) {
          rollLen = parseFloat(itemToEdit.length_m);
          rollCount = legacyQty;
        } else {
          rollLen = totalMeters || "";
          rollCount = 1;
        }
      }

      setIsPartialRollEdit(partialRoll);
      setForm({
        ...EMPTY_ITEM,
        item_name: itemToEdit.item_name || "",
        fabric_type: itemToEdit.fabric_type || "",
        composition: itemToEdit.composition || "",
        pattern: itemToEdit.pattern || "",
        color: itemToEdit.color || "",
        unit: normalizedUnit,
        length_m: totalMeters || "",
        roll_length_m: rollLen,
        roll_count: rollCount,
        min_stock_level: itemToEdit.min_stock_level ?? 5,
        cost_per_meter: itemToEdit.cost_per_meter ?? "",
        price_per_meter: itemToEdit.price_per_meter ?? "",
        country_of_origin: itemToEdit.country_of_origin || "Kuwait",
        barcode: itemToEdit.barcode || "",
        description: itemToEdit.description || "",
        description_ar: itemToEdit.description_ar || "",
      });
    } else {
      setIsPartialRollEdit(false);
      setForm(EMPTY_ITEM);
    }
  }, [isOpen, itemToEdit]);

  const computedTotalMeters = (() => {
    if (form.unit === "roll" && !isPartialRollEdit) {
      const perRoll = num(form.roll_length_m) ?? 0;
      const count = Math.max(0, Math.floor(num(form.roll_count) ?? 0));
      return round3(perRoll * count);
    }
    return round3(num(form.length_m) ?? 0);
  })();

  const computedPurchaseValue = (() => {
    const cost = num(form.cost_per_meter) ?? 0;
    if (cost <= 0 || computedTotalMeters <= 0) return 0;
    return round3(computedTotalMeters * cost);
  })();

  const buildPayload = () => {
    const fabricType = optionValue(FABRIC_TYPES, form.fabric_type);
    const fallbackName = [
      fabricType,
      optionValue(PATTERNS, form.pattern),
      optionValue(COLORS, form.color),
    ]
      .filter(Boolean)
      .join(" ");

    const isRoll = form.unit === "roll";
    const parsedRollLen = isRoll ? (num(form.roll_length_m) ?? null) : null;

    return {
      fabric_type: fabricType,
      item_name: (form.item_name || fallbackName || "").trim() || undefined,
      composition: optionValue(COMPOSITIONS, form.composition) || undefined,
      pattern: optionValue(PATTERNS, form.pattern) || undefined,
      color: optionValue(COLORS, form.color) || undefined,
      unit: isRoll ? "roll" : "meter",
      length_m: computedTotalMeters,
      roll_length_m: parsedRollLen,
      quantity: 1,
      min_stock_level: num(form.min_stock_level) ?? 5,
      cost_per_meter: num(form.cost_per_meter) ?? 0,
      price_per_meter: num(form.price_per_meter) ?? 0,
      country_of_origin: form.country_of_origin || undefined,
      barcode: form.barcode || undefined,
      description: form.description || undefined,
      description_ar: form.description_ar || undefined,
      branch_id: activeBranchId || itemToEdit?.branch_id || undefined,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.fabric_type.trim()) {
      toast.error(t("fabric_type_required") || "Fabric type is required");
      return;
    }
    if (!(computedTotalMeters > 0)) {
      toast.error(t("invalid_item_length") || "Valid length (meters) is required");
      return;
    }
    if (!(num(form.price_per_meter) > 0)) {
      toast.error(
        t("price_per_meter_required") || "Selling price per meter is required",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildPayload();
      if (isEditMode && itemToEdit?.id) {
        await updateItemMutation.mutateAsync({ id: itemToEdit.id, data: payload });
      } else {
        await createItemMutation.mutateAsync(payload);
      }
      onSuccess?.();
      onClose();
    } catch { void 0; } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="inventory-modal-overlay"
      onClick={(event) => {
        if (isSubmitting) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={`inventory-modal inventory-modal--${theme}`}>
        <div className="inventory-modal__header">
          <h2 className="inventory-modal__title">
            {isEditMode
              ? t("edit_item") || "Edit fabric"
              : t("add_new_item") || "Add fabric"}
          </h2>
          <button
            className="inventory-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close") || "Close"}
          >
            <X size={24} />
          </button>
        </div>

        <form className="inventory-form" onSubmit={handleSubmit}>
          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("fabric_type") || "Fabric type"} *
              </label>
              <SuggestionInput
                value={form.fabric_type}
                onChange={update("fabric_type")}
                options={suggestionOptions(FABRIC_TYPES)}
                placeholder={t("fabric_type_placeholder") || "fabric_type"}
                required={true}
              />
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("pattern") || "Pattern"}
              </label>
              <SuggestionInput
                value={form.pattern}
                onChange={update("pattern")}
                options={suggestionOptions(PATTERNS)}
                placeholder={t("pattern_placeholder") || "pattern"}
                required={false}
              />
            </div>
          </div>

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("color") || "Color"}
              </label>
              <SuggestionInput
                value={form.color}
                onChange={update("color")}
                options={suggestionOptions(COLORS)}
                placeholder={t("color_placeholder") || "color"}
                required={false}
              />
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("composition") || "Composition"}
              </label>
              <SuggestionInput
                value={form.composition}
                onChange={update("composition")}
                options={suggestionOptions(COMPOSITIONS)}
                placeholder={t("composition_placeholder") || "composition"}
                required={false}
              />
            </div>
          </div>

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("unit") || "Sale unit"} *
              </label>
              <select
                className="inventory-form__input"
                value={form.unit}
                onChange={update("unit")}
              >
                {UNITS.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {optionLabel(unit, i18n.language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("min_stock_level") || "Minimum stock (m)"}
              </label>
              <input
                type="number"
                min="0"
                step="0.001"
                className="inventory-form__input"
                value={form.min_stock_level}
                onChange={update("min_stock_level")}
              />
            </div>
          </div>

          {form.unit === "meter" ? (
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("total_length_m") || "Total stock length (m)"} *
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                className="inventory-form__input"
                value={form.length_m}
                onChange={update("length_m")}
                required
              />
            </div>
          ) : isPartialRollEdit ? (
            <div className="inventory-form__row">
              <div className="inventory-form__section">
                <label className="inventory-form__section-label">
                  {t("remaining_length_m") || "Total remaining length (m)"} *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  className="inventory-form__input"
                  value={form.length_m}
                  onChange={update("length_m")}
                  required
                />
              </div>

              <div className="inventory-form__section">
                <label className="inventory-form__section-label">
                  {t("length_per_roll_m") || "Length per roll (m)"}
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  className="inventory-form__input"
                  value={form.roll_length_m}
                  onChange={update("roll_length_m")}
                />
              </div>
            </div>
          ) : (
            <div className="inventory-form__row">
              <div className="inventory-form__section">
                <label className="inventory-form__section-label">
                  {t("length_per_roll_m") || "Length per roll (m)"} *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  className="inventory-form__input"
                  value={form.roll_length_m}
                  onChange={update("roll_length_m")}
                  required
                />
              </div>

              <div className="inventory-form__section">
                <label className="inventory-form__section-label">
                  {t("roll_count") || "Number of rolls"} *
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  className="inventory-form__input"
                  value={form.roll_count}
                  onChange={update("roll_count")}
                  required
                />
              </div>
            </div>
          )}

          {computedTotalMeters > 0 && (
            <div className="inventory-form__stock-preview">
              <div className="inventory-form__stock-preview-item">
                <span>{t("total_stock_preview") || "Total stock"}:</span>
                <strong>
                  {computedTotalMeters} {t("m") || "m"}
                </strong>
                {form.unit === "roll" &&
                  !isPartialRollEdit &&
                  (num(form.roll_length_m) ?? 0) > 0 && (
                    <span className="inventory-form__stock-preview-note">
                      ({Math.floor(num(form.roll_count) ?? 0)} ×{" "}
                      {num(form.roll_length_m)} {t("m") || "m"})
                    </span>
                  )}
              </div>
              {computedPurchaseValue > 0 && (
                <div className="inventory-form__stock-preview-item">
                  <span>{t("total_purchase_value") || "Total purchase value"}:</span>
                  <strong>
                    {computedPurchaseValue.toFixed(3)} {t("kwd") || "KWD"}
                  </strong>
                </div>
              )}
            </div>
          )}

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("cost_per_meter") || "Cost per meter"}
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                className="inventory-form__input"
                value={form.cost_per_meter}
                onChange={update("cost_per_meter")}
              />
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("price_per_meter") || "Selling price per meter"} *
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                className="inventory-form__input"
                value={form.price_per_meter}
                onChange={update("price_per_meter")}
                required
              />
            </div>
          </div>

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("country_of_origin") || "Country of origin"}
              </label>
              <select
                className="inventory-form__input"
                value={form.country_of_origin}
                onChange={update("country_of_origin")}
              >
                {COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {optionLabel(country, i18n.language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("barcode") || "Barcode"}
              </label>
              <input
                className="inventory-form__input"
                value={form.barcode}
                onChange={update("barcode")}
                placeholder={t("barcode_optional_hint") || "Leave empty to generate"}
              />
            </div>
          </div>

          <div className="inventory-form__section">
            <label className="inventory-form__section-label">
              {t("description") || "Description"}
            </label>
            <textarea
              className="inventory-form__input"
              rows={2}
              value={form.description}
              onChange={update("description")}
            />
          </div>

          <div className="inventory-form__actions">
            <button
              type="button"
              className="inventory-btn inventory-btn--secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="inventory-btn inventory-btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 size={16} className="spin" />
              ) : (
                <Plus size={16} />
              )}
              {isEditMode ? t("save") || "Save" : t("add_item") || "Add fabric"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
