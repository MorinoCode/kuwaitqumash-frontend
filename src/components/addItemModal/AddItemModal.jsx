import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useTheme } from "../../context/ThemeContext";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
} from "../../hooks/useInventory";
import {
  FABRIC_TYPES,
  PATTERNS,
  COMPOSITIONS,
  COLORS,
  UNITS,
} from "../../utils/inventoryCategories";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";
import { Plus, X, Loader2 } from "lucide-react";
import "./AddItemModal.css";
import "../../pages/inventoryPage/InventoryPage.css";

const GCC_COUNTRIES = [
  { value: "Kuwait", label: "Kuwait", labelAr: "الكويت" },
  { value: "Saudi Arabia", label: "Saudi Arabia", labelAr: "السعودية" },
  { value: "UAE", label: "UAE", labelAr: "الإمارات" },
  { value: "Bahrain", label: "Bahrain", labelAr: "البحرين" },
  { value: "Qatar", label: "Qatar", labelAr: "قطر" },
  { value: "Oman", label: "Oman", labelAr: "عمان" },
  { value: "China", label: "China", labelAr: "الصين" },
  { value: "India", label: "India", labelAr: "الهند" },
  { value: "Turkey", label: "Turkey", labelAr: "تركيا" },
  { value: "Italy", label: "Italy", labelAr: "إيطاليا" },
  { value: "Korea", label: "South Korea", labelAr: "كوريا الجنوبية" },
  { value: "Other", label: "Other", labelAr: "أخرى" },
];

const EMPTY_ITEM = {
  item_name: "",
  fabric_type: "",
  composition: "",
  pattern: "",
  color: "",
  unit: "meter",
  length_m: "",
  roll_length_m: "",
  width_cm: "",
  quantity: 1,
  min_stock_level: 5,
  cost_per_meter: "",
  price_per_meter: "",
  supplier_name: "",
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
  const fileInputRef = useRef(null);

  const createItemMutation = useCreateInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();

  const isEditMode = !!itemToEdit;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [selectedImages, setSelectedImages] = useState([]);

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      return image.startsWith("/") ? `${API_URL}${image}` : `${API_URL}/${image}`;
    }
    return URL.createObjectURL(image);
  };

  const update = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (!isOpen) return;
    if (itemToEdit) {
      setForm({
        ...EMPTY_ITEM,
        item_name: itemToEdit.item_name || "",
        fabric_type: itemToEdit.fabric_type || "",
        composition: itemToEdit.composition || "",
        pattern: itemToEdit.pattern || "",
        color: itemToEdit.color || "",
        unit: itemToEdit.unit || "meter",
        length_m: itemToEdit.length_m ?? "",
        roll_length_m: itemToEdit.roll_length_m ?? "",
        width_cm: itemToEdit.width_cm ?? "",
        quantity: itemToEdit.quantity ?? 1,
        min_stock_level: itemToEdit.min_stock_level ?? 5,
        cost_per_meter: itemToEdit.cost_per_meter ?? "",
        price_per_meter: itemToEdit.price_per_meter ?? "",
        supplier_name: itemToEdit.supplier_name || "",
        country_of_origin: itemToEdit.country_of_origin || "Kuwait",
        barcode: itemToEdit.barcode || "",
        description: itemToEdit.description || "",
        description_ar: itemToEdit.description_ar || "",
      });
      const existing = itemToEdit.images || itemToEdit.image_urls || [];
      setSelectedImages(Array.isArray(existing) ? existing : []);
    } else {
      setForm(EMPTY_ITEM);
      setSelectedImages([]);
    }
  }, [isOpen, itemToEdit]);

  const handleImageSelect = (event) => {
    const files = Array.from(event.target.files || []);
    if (selectedImages.length + files.length > 5) {
      toast.warning(t("max_images_alert") || "Maximum 5 images allowed");
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const buildPayload = () => {
    const fabricType = (form.fabric_type || "").trim();
    const fallbackName = [fabricType, form.pattern, form.color]
      .filter(Boolean)
      .join(" ");

    return {
      fabric_type: fabricType,
      item_name: (form.item_name || fallbackName || "").trim() || undefined,
      composition: form.composition || undefined,
      pattern: form.pattern || undefined,
      color: form.color || undefined,
      width_cm: num(form.width_cm),
      unit: form.unit || "meter",
      length_m: num(form.length_m) ?? 0,
      roll_length_m: num(form.roll_length_m),
      quantity: num(form.quantity) ?? 1,
      min_stock_level: num(form.min_stock_level) ?? 5,
      cost_per_meter: num(form.cost_per_meter) ?? 0,
      price_per_meter: num(form.price_per_meter) ?? 0,
      supplier_name: form.supplier_name || undefined,
      country_of_origin: form.country_of_origin || undefined,
      barcode: form.barcode || undefined,
      description: form.description || undefined,
      description_ar: form.description_ar || undefined,
      branch_id: activeBranchId || itemToEdit?.branch_id || undefined,
      images: selectedImages.filter((img) => img instanceof File),
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!form.fabric_type.trim()) {
      toast.error(t("fabric_type_required") || "Fabric type is required");
      return;
    }
    if (!(num(form.price_per_meter) > 0)) {
      toast.error(t("price_per_meter_required") || "Price per meter is required");
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
    } catch {
      // mutation hooks already surface the error toast
    } finally {
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
              <input
                className="inventory-form__input"
                list="fabric-type-options"
                value={form.fabric_type}
                onChange={update("fabric_type")}
                placeholder={t("fabric_type_placeholder") || "Cotton, Silk, Crepe..."}
                required
              />
              <datalist id="fabric-type-options">
                {FABRIC_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {i18n.language === "ar" ? type.labelAr : type.label}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("pattern") || "Pattern"}
              </label>
              <input
                className="inventory-form__input"
                list="pattern-options"
                value={form.pattern}
                onChange={update("pattern")}
              />
              <datalist id="pattern-options">
                {PATTERNS.map((pattern) => (
                  <option key={pattern.value} value={pattern.value}>
                    {i18n.language === "ar" ? pattern.labelAr : pattern.label}
                  </option>
                ))}
              </datalist>
            </div>
          </div>

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("color") || "Color"}
              </label>
              <input
                className="inventory-form__input"
                list="color-options"
                value={form.color}
                onChange={update("color")}
              />
              <datalist id="color-options">
                {COLORS.map((color) => (
                  <option key={color.value} value={color.value}>
                    {i18n.language === "ar" ? color.labelAr : color.label}
                  </option>
                ))}
              </datalist>
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("composition") || "Composition"}
              </label>
              <input
                className="inventory-form__input"
                list="composition-options"
                value={form.composition}
                onChange={update("composition")}
                placeholder="100% Cotton"
              />
              <datalist id="composition-options">
                {COMPOSITIONS.map((item) => (
                  <option key={item.value} value={item.value} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("width_cm") || "Width (cm)"}
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="inventory-form__input"
                value={form.width_cm}
                onChange={update("width_cm")}
              />
            </div>

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
                    {i18n.language === "ar" ? unit.labelAr : unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("length_m") || "Length (m)"} *
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
                {t("roll_length_m") || "Roll length (m)"}
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

          <div className="inventory-form__row">
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("quantity") || "Quantity"} *
              </label>
              <input
                type="number"
                min="1"
                className="inventory-form__input"
                value={form.quantity}
                onChange={update("quantity")}
                required
              />
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
                {t("price_per_meter") || "Price per meter"} *
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
                {t("supplier_name") || "Supplier"}
              </label>
              <input
                className="inventory-form__input"
                value={form.supplier_name}
                onChange={update("supplier_name")}
              />
            </div>

            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("country_of_origin") || "Country of origin"}
              </label>
              <select
                className="inventory-form__input"
                value={form.country_of_origin}
                onChange={update("country_of_origin")}
              >
                {GCC_COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {i18n.language === "ar" ? country.labelAr : country.label}
                  </option>
                ))}
              </select>
            </div>
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

          <div className="inventory-form__section">
            <label className="inventory-form__section-label">
              {t("images")} ({t("optional")})
            </label>
            <div className="inventory-form__upload-section">
              <div className="inventory-form__thumbnails">
                {selectedImages.map((image, index) => (
                  <div key={index} className="inventory-form__thumb">
                    <img src={getImageUrl(image)} alt="preview" loading="lazy" />
                    <button
                      type="button"
                      className="inventory-form__remove-thumb"
                      onClick={() => removeSelectedImage(index)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {selectedImages.length < 5 && (
                  <button
                    type="button"
                    className="inventory-form__add-thumb"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                multiple
                onChange={handleImageSelect}
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
