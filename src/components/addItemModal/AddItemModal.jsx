import React, { useState, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useTheme } from "../../context/ThemeContext";
import {
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useCustomOptions,
  useSaveCustomOption,
} from "../../hooks/useInventory";
import {
  METAL_CATEGORIES,
  DIAMOND_CUTS,
  DIAMOND_COLORS,
  DIAMOND_CLARITY,
  DIAMOND_SHAPES,
  DIAMOND_SETTINGS,
  STONE_TYPES,
  getSubcategories,
  extractKaratFromSubcategory,
} from "../../utils/inventoryCategories";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";
import { Plus, X, Trash2, Loader2 } from "lucide-react";
import "./AddItemModal.css";
import "../../pages/inventoryPage/InventoryPage.css";

/**
 * The form still collects legacy gold fields; map them onto the fabric API
 * contract before sending (strict validation on the backend).
 */
const toFabricPayload = (data = {}) => {
  const num = (v) => {
    const n = parseFloat(String(v ?? "").replace(/[^0-9.\-]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  };
  return {
    fabric_type: data.fabric_type || data.category || data.metal_type || "Fabric",
    item_name: data.item_name || undefined,
    item_name_ar: data.item_name_ar || undefined,
    composition: data.composition || undefined,
    pattern: data.pattern || data.subcategory || undefined,
    color: data.color || undefined,
    width_cm: num(data.width_cm),
    unit: data.unit || "meter",
    length_m: num(data.length_m ?? data.weight) ?? 0,
    quantity: num(data.quantity) ?? 1,
    min_stock_level: num(data.min_stock_level) ?? 5,
    cost_per_meter: num(data.cost_per_meter ?? data.buy_price_per_gram) ?? 0,
    price_per_meter: num(data.price_per_meter ?? data.gold_price_per_gram) ?? 0,
    country_of_origin: data.country_of_origin || undefined,
    description: data.description || undefined,
    description_ar: data.description_ar || undefined,
    supplier_name: data.supplier_name || undefined,
    barcode: data.barcode || undefined,
    branch_id: data.branch_id || undefined,
  };
};


// GCC Countries (Gulf Cooperation Council)
const GCC_COUNTRIES = [
  { value: "Kuwait", label: "Kuwait", labelAr: "الكويت" },
  { value: "Saudi Arabia", label: "Saudi Arabia", labelAr: "السعودية" },
  { value: "UAE", label: "UAE", labelAr: "الإمارات" },
  { value: "Bahrain", label: "Bahrain", labelAr: "البحرين" },
  { value: "Qatar", label: "Qatar", labelAr: "قطر" },
  { value: "Oman", label: "Oman", labelAr: "عمان" },
  { value: "Italy", label: "Italy", labelAr: "إيطاليا" },
  { value: "India", label: "India", labelAr: "الهند" },
  { value: "Turkey", label: "Turkey", labelAr: "تركيا" },
  { value: "Singapore", label: "Singapore", labelAr: "سنغافورة" },
  { value: "Other", label: "Other", labelAr: "أخرى" },
];

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

  // Use React Query mutations
  const createItemMutation = useCreateInventoryItem();
  const updateItemMutation = useUpdateInventoryItem();
  const saveCustomOptionMutation = useSaveCustomOption();

  // Determine if we're in edit mode
  const isEditMode = !!itemToEdit;

  // Helper to get image URL (for both File objects and URL strings)
  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") {
      // It's a URL string
      if (image.startsWith("http")) return image;
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      return image.startsWith("/")
        ? `${API_URL}${image}`
        : `${API_URL}/${image}`;
    }
    // It's a File object
    return URL.createObjectURL(image);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newItem, setNewItem] = useState({
    metal_type: "",
    category: "",
    subcategory: "",
    country_of_origin: "Kuwait",
    description: "",
    description_ar: "",
    karat: "",
    weight: "",
    quantity: 1,
    min_stock_level: 2,
    buy_price_per_gram: "",
    diamond_carat: "",
    diamond_cut: "",
    diamond_color: "",
    diamond_clarity: "",
    diamond_shape: "",
    diamond_setting: "",
  });
  const [stones, setStones] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [customMetal, setCustomMetal] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [customSubcategory, setCustomSubcategory] = useState("");
  const [showCustomMetal, setShowCustomMetal] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [showCustomSubcategory, setShowCustomSubcategory] = useState(false);

  // Load custom options (after newItem is defined)
  const { data: customMetalsData, refetch: refetchCustomMetals } =
    useCustomOptions({ type: "metal" });
  const customMetals = Array.isArray(customMetalsData) ? customMetalsData : [];

  const { data: customCategoriesData } = useCustomOptions({
    type: "category",
    metal_type: newItem.metal_type,
  });
  const customCategories = Array.isArray(customCategoriesData)
    ? customCategoriesData
    : [];

  const { data: customSubcategoriesData } = useCustomOptions({
    type: "subcategory",
    metal_type: newItem.metal_type,
    category: newItem.category,
  });
  const customSubcategories = Array.isArray(customSubcategoriesData)
    ? customSubcategoriesData
    : [];

  // Removed debug console.log for production

  // Stone weight in grams: 1 ct = 0.2 g (supports Arabic/Persian digits)
  const stoneWeightToGrams = (stone) => {
    const w =
      parseFloat(normalizeToLatinDigits(String(stone.weight || ""))) || 0;
    if (stone.unit === "ct") return w * 0.2;
    return w;
  };

  // Net Gold Weight = Total Weight (Scale) - sum(stone weights in grams)
  const _calculateGoldWeight = useMemo(() => {
    const totalWeight =
      parseFloat(normalizeToLatinDigits(String(newItem.weight || ""))) || 0;
    const stonesWeightG = stones
      .filter((stone) => stone.weight)
      .reduce((sum, stone) => sum + stoneWeightToGrams(stone), 0);
    return Math.max(0, totalWeight - stonesWeightG);
  }, [newItem.weight, stones]);

  // Calculate stones value (stones with value)
  const _calculateStonesValue = useMemo(() => {
    return stones
      .filter((stone) => stone.has_value && stone.value)
      .reduce(
        (sum, stone) =>
          sum +
          (parseFloat(normalizeToLatinDigits(String(stone.value || ""))) || 0),
        0,
      );
  }, [stones]);

  const handleMetalChange = async (metal) => {
    const isCustom = metal === "__custom__";

    // If user selected a custom metal from dropdown (not "__custom__"), use it
    if (!isCustom && metal) {
      setShowCustomMetal(false);
      setNewItem((prev) => ({
        ...prev,
        metal_type: metal,
        category: "",
        subcategory: "",
        karat: "",
        diamond_carat: "",
        diamond_cut: "",
        diamond_color: "",
        diamond_clarity: "",
        diamond_shape: "",
        diamond_setting: "",
      }));
      setStones([]);
      return;
    }

    // If user clicked "__custom__", show custom input
    if (isCustom) {
      setShowCustomMetal(true);
      setNewItem((prev) => ({
        ...prev,
        metal_type: customMetal || "",
        category: "",
        subcategory: "",
        karat: "",
        diamond_carat: "",
        diamond_cut: "",
        diamond_color: "",
        diamond_clarity: "",
        diamond_shape: "",
        diamond_setting: "",
      }));
      setStones([]);
      return;
    }

    // Default case
    setShowCustomMetal(false);
    setNewItem((prev) => ({
      ...prev,
      metal_type: metal,
      category: "",
      subcategory: "",
      karat: "",
      diamond_carat: "",
      diamond_cut: "",
      diamond_color: "",
      diamond_clarity: "",
      diamond_shape: "",
      diamond_setting: "",
    }));
    setStones([]);
  };

  const handleCategoryChange = (category) => {
    const isCustom = category === "__custom__";
    setShowCustomCategory(isCustom);

    // Don't save custom category here - it will be saved when Add Item is clicked
    setNewItem((prev) => ({
      ...prev,
      category: isCustom ? customCategory : category,
      subcategory: "",
      karat: "",
    }));
  };

  const handleSubcategoryChange = (subcategory) => {
    const isCustom = subcategory === "__custom__";
    if (isCustom) {
      setShowCustomSubcategory(true);
      // Don't update newItem yet, wait for user to type in custom input
      return;
    }
    // If not custom, it's a selection from dropdown
    setShowCustomSubcategory(false);
    // Extract karat only for Gold, Silver, Platinum (not for Watch or Diamond)
    const extractedKarat =
      newItem.metal_type !== "Watch" && newItem.metal_type !== "Diamond"
        ? extractKaratFromSubcategory(subcategory)
        : null;
    setNewItem((prev) => ({
      ...prev,
      subcategory: subcategory,
      karat: extractedKarat || "",
    }));
  };

  const handleAddStone = () => {
    setStones([
      ...stones,
      { type: "", weight: "", unit: "g", has_value: false },
    ]);
  };

  const handleRemoveStone = (index) => {
    setStones(stones.filter((_, i) => i !== index));
  };

  const handleUpdateStone = (index, field, value) => {
    const updated = [...stones];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "has_value" && value && !updated[index].value) {
      updated[index].value = "";
    }
    setStones(updated);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (selectedImages.length + files.length > 5) {
      toast.warning(t("max_images_alert") || "Maximum 5 images allowed");
      return;
    }
    setSelectedImages((prev) => [...prev, ...files]);
  };

  const removeSelectedImage = (index) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Save custom options if they were entered
      if (showCustomMetal && customMetal.trim()) {
        try {
          await saveCustomOptionMutation.mutateAsync({
            type: "metal",
            name: customMetal.trim(),
          });
          await refetchCustomMetals();
        } catch {
          // Silently ignore custom option save errors
        }
      }

      if (showCustomCategory && customCategory.trim() && newItem.metal_type) {
        try {
          await saveCustomOptionMutation.mutateAsync({
            type: "category",
            metal_type: newItem.metal_type,
            name: customCategory.trim(),
          });
        } catch {
          // Silently ignore custom option save errors
        }
      }

      if (
        showCustomSubcategory &&
        customSubcategory.trim() &&
        newItem.metal_type &&
        newItem.category
      ) {
        try {
          await saveCustomOptionMutation.mutateAsync({
            type: "subcategory",
            metal_type: newItem.metal_type,
            category: newItem.category,
            name: customSubcategory.trim(),
          });
        } catch {
          // Silently ignore custom option save errors
        }
      }
      // Extract karat from subcategory if not already set (not for Watch or Diamond)
      let finalKarat = newItem.karat;
      if (newItem.metal_type !== "Watch" && newItem.metal_type !== "Diamond") {
        if (!finalKarat && newItem.subcategory) {
          finalKarat = extractKaratFromSubcategory(newItem.subcategory);
        }
      } else {
        finalKarat = null; // Watch and Diamond don't have karat
      }

      // Generate item_name from subcategory (or category if no subcategory)
      const itemName =
        newItem.subcategory || newItem.category || `${newItem.metal_type} Item`;

      // Filter images: only send File objects (new images), not URL strings (existing images)
      const newImageFiles = selectedImages.filter((img) => img instanceof File);

      // Prepare item data object for mutation (mutation will convert to FormData)
      // Keep subcategory as it's required by backend for Gold, Silver, and Platinum items
      const itemData = {
        ...newItem,
        weight: normalizeToLatinDigits(String(newItem.weight || "")),
        quantity:
          parseInt(
            normalizeToLatinDigits(String(newItem.quantity ?? "1")),
            10,
          ) || 1,
        buy_price_per_gram: normalizeToLatinDigits(
          String(newItem.buy_price_per_gram || ""),
        ),
        karat: finalKarat || "",
        item_name: itemName, // Automatically set from subcategory
        images: newImageFiles, // Only send new File objects
        stones:
          stones.length > 0
            ? stones.map((stone) => ({
                type: stone.type,
                weight:
                  parseFloat(
                    normalizeToLatinDigits(String(stone.weight || "")),
                  ) || 0,
                unit: stone.unit === "ct" ? "ct" : "g",
                has_value: !!stone.has_value,
                value: stone.has_value
                  ? parseFloat(
                      normalizeToLatinDigits(String(stone.value || "")),
                    ) || 0
                  : 0,
              }))
            : [],
        branch_id: activeBranchId,
      };

      // Remove empty fields, but keep subcategory for Gold, Silver, Platinum (required by backend)
      Object.keys(itemData).forEach((key) => {
        const value = itemData[key];
        // Don't delete subcategory if metal_type is Gold, Silver, or Platinum
        if (
          key === "subcategory" &&
          ["Gold", "Silver", "Platinum"].includes(itemData.metal_type)
        ) {
          return; // Keep subcategory even if empty - backend will validate
        }
        // For Watch and Diamond, remove karat and gold_price_per_gram
        if (
          itemData.metal_type === "Watch" ||
          itemData.metal_type === "Diamond"
        ) {
          if (key === "karat" || key === "gold_price_per_gram") {
            delete itemData[key];
            return;
          }
        }
        // For custom metals, subcategory is optional, so we can remove it if empty
        if (value === null || value === undefined || value === "") {
          delete itemData[key];
        }
      });

      // Use update mutation if editing, otherwise create
      if (isEditMode && itemToEdit?.id) {
        await updateItemMutation.mutateAsync({
          id: itemToEdit.id,
          data: toFabricPayload(itemData),
        });
      } else {
        await createItemMutation.mutateAsync(toFabricPayload(itemData));
      }

      // Reset form
      setNewItem({
        metal_type: "",
        category: "",
        subcategory: "",
        country_of_origin: "Kuwait",
        description: "",
        description_ar: "",
        karat: "",
        weight: "",
        quantity: 1,
        min_stock_level: 2,
        buy_price_per_gram: "",
        diamond_carat: "",
        diamond_cut: "",
        diamond_color: "",
        diamond_clarity: "",
        diamond_shape: "",
        diamond_setting: "",
      });
      setStones([]);
      setSelectedImages([]);
      setCustomMetal("");
      setCustomCategory("");
      setCustomSubcategory("");
      setShowCustomMetal(false);
      setShowCustomCategory(false);
      setShowCustomSubcategory(false);

      onSuccess?.();
      onClose();
    } catch {
      // Silently ignore form submission errors - error toasts are shown by mutations
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load item data when editing
  React.useEffect(() => {
    if (isOpen && itemToEdit) {
      // Populate form with item data
      setNewItem({
        metal_type: itemToEdit.metal_type || "",
        category: itemToEdit.category || "",
        subcategory: itemToEdit.subcategory || "",
        country_of_origin: itemToEdit.country_of_origin || "Kuwait",
        description: itemToEdit.description || "",
        description_ar: itemToEdit.description_ar || "",
        karat: itemToEdit.karat || "",
        weight: itemToEdit.weight || "",
        quantity: itemToEdit.quantity || 1,
        min_stock_level: itemToEdit.min_stock_level || 2,
        buy_price_per_gram: itemToEdit.buy_price_per_gram || "",
        diamond_carat: itemToEdit.diamond_carat || "",
        diamond_cut: itemToEdit.diamond_cut || "",
        diamond_color: itemToEdit.diamond_color || "",
        diamond_clarity: itemToEdit.diamond_clarity || "",
        diamond_shape: itemToEdit.diamond_shape || "",
        diamond_setting: itemToEdit.diamond_setting || "",
      });

      // Load stones if available
      if (itemToEdit.stones && Array.isArray(itemToEdit.stones)) {
        setStones(
          itemToEdit.stones.map((stone) => ({
            ...stone,
            unit: stone.unit === "ct" ? "ct" : "g",
            has_value: (stone.value ?? 0) > 0,
          })),
        );
      } else {
        setStones([]);
      }

      // Load existing images (as URLs, not files)
      // Images might be in itemToEdit.images array or itemToEdit.image_urls
      const existingImages = itemToEdit.images || itemToEdit.image_urls || [];
      if (Array.isArray(existingImages) && existingImages.length > 0) {
        setSelectedImages(existingImages);
      } else {
        setSelectedImages([]);
      }
    } else if (isOpen && !itemToEdit) {
      // Reset form for new item
      setNewItem({
        metal_type: "",
        category: "",
        subcategory: "",
        country_of_origin: "Kuwait",
        description: "",
        description_ar: "",
        karat: "",
        weight: "",
        quantity: 1,
        min_stock_level: 2,
        buy_price_per_gram: "",
        diamond_carat: "",
        diamond_cut: "",
        diamond_color: "",
        diamond_clarity: "",
        diamond_shape: "",
        diamond_setting: "",
      });
      setStones([]);
      setSelectedImages([]);
      setCustomMetal("");
      setCustomCategory("");
      setCustomSubcategory("");
      setShowCustomMetal(false);
      setShowCustomCategory(false);
      setShowCustomSubcategory(false);
    }
  }, [isOpen, itemToEdit]);

  if (!isOpen) return null;

  return (
    <div
      className="inventory-modal-overlay"
      onClick={(e) => {
        // Prevent closing modal when clicking overlay during submission
        if (isSubmitting) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        // Close modal when clicking overlay (only if not submitting)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        cursor: isSubmitting ? "wait" : "default",
        pointerEvents: isSubmitting ? "auto" : "auto",
      }}
    >
      <div className={`inventory-modal inventory-modal--${theme}`}>
        <div className="inventory-modal__header">
          <h2 className="inventory-modal__title">
            {isEditMode ? t("edit_item") || "Edit Item" : t("add_new_item")}
          </h2>
          <button
            className="inventory-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label={t("close") || "Close modal"}
            style={{
              opacity: isSubmitting ? 0.5 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
          >
            <X size={24} />
          </button>
        </div>

        <form className="inventory-form" onSubmit={handleAddItem}>
          {/* Step 1: Metal Type Selection (Required) */}
          <div className="inventory-form__section">
            <label className="inventory-form__section-label">
              {t("select_metal")} *
            </label>
            {!showCustomMetal ? (
              <select
                className="inventory-form__input"
                value={newItem.metal_type}
                onChange={(e) => handleMetalChange(e.target.value)}
                required
                aria-label={t("select_metal") || "Select metal type"}
                aria-required="true"
              >
                <option value="">{t("select_metal")}...</option>
                <option value="Gold">{t("gold")}</option>
                <option value="Silver">{t("silver")}</option>
                <option value="Platinum">{t("platinum")}</option>
                <option value="Diamond">{t("diamond")}</option>
                <option value="Watch">{t("watch") || "Watch"}</option>
                {/* Custom metals from database */}
                {customMetals.map((metal) => (
                  <option key={metal.id} value={metal.name}>
                    {i18n.language === "ar" && metal.name_ar
                      ? metal.name_ar
                      : metal.name}
                  </option>
                ))}
                <option value="__custom__">
                  + {t("add_custom") || "Add Custom"}
                </option>
              </select>
            ) : (
              <div className="inventory-form__section">
                <label className="inventory-form__section-label">
                  {t("enter_metal_name") || "Enter Metal Name"} *
                </label>
                <div className="inventory-form__row">
                  <input
                    className="inventory-form__input"
                    placeholder={t("enter_metal_name") || "Enter metal name"}
                    value={customMetal}
                    onChange={(e) => {
                      setCustomMetal(e.target.value);
                      setNewItem((prev) => ({
                        ...prev,
                        metal_type: e.target.value,
                      }));
                    }}
                    required
                    aria-label={t("enter_metal_name") || "Enter metal name"}
                    aria-required="true"
                  />
                  <button
                    type="button"
                    className="inventory-btn inventory-btn--secondary"
                    onClick={() => {
                      setShowCustomMetal(false);
                      setCustomMetal("");
                      setNewItem((prev) => ({ ...prev, metal_type: "" }));
                    }}
                    aria-label={t("cancel") || "Cancel custom metal"}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Category Selection (Required - Dynamic based on Metal) */}
          {newItem.metal_type && (
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("category")} *
              </label>
              {!showCustomCategory ? (
                <select
                  className="inventory-form__input"
                  value={newItem.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  required
                  aria-label={t("category") || "Select category"}
                  aria-required="true"
                >
                  <option value="">{t("select_category")}...</option>
                  {/* Default categories */}
                  {METAL_CATEGORIES[newItem.metal_type]?.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {i18n.language === "ar" ? cat.labelAr : cat.label}
                    </option>
                  ))}
                  {/* Custom categories from database */}
                  {customCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {i18n.language === "ar" && cat.name_ar
                        ? cat.name_ar
                        : cat.name}
                    </option>
                  ))}
                  {newItem.metal_type !== "Diamond" && (
                    <option value="__custom__">
                      + {t("add_custom") || "Add Custom"}
                    </option>
                  )}
                </select>
              ) : (
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {t("enter_category_name") || "Enter Category Name"} *
                  </label>
                  <div className="inventory-form__row">
                    <input
                      className="inventory-form__input"
                      placeholder={
                        t("enter_category_name") || "Enter category name"
                      }
                      value={customCategory}
                      onChange={(e) => {
                        setCustomCategory(e.target.value);
                        setNewItem((prev) => ({
                          ...prev,
                          category: e.target.value,
                        }));
                      }}
                      required
                    />
                    <button
                      type="button"
                      className="inventory-btn inventory-btn--secondary"
                      onClick={() => {
                        setShowCustomCategory(false);
                        setCustomCategory("");
                        setNewItem((prev) => ({ ...prev, category: "" }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2.5: Subcategory Selection (Required for Gold/Silver/Platinum, Optional for custom metals) */}
          {newItem.metal_type && newItem.category && (
            <div className="inventory-form__section">
              <label className="inventory-form__section-label">
                {t("subcategory") || "Subcategory"}
                {["Gold", "Silver", "Platinum"].includes(newItem.metal_type)
                  ? " *"
                  : ` (${t("optional")})`}
              </label>
              {!showCustomSubcategory ? (
                <select
                  className="inventory-form__input"
                  value={newItem.subcategory}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  required={["Gold", "Silver", "Platinum"].includes(
                    newItem.metal_type,
                  )}
                >
                  <option value="">{t("select_subcategory")}...</option>
                  {/* Default subcategories */}
                  {getSubcategories(newItem.metal_type, newItem.category)
                    .length > 0
                    ? getSubcategories(
                        newItem.metal_type,
                        newItem.category,
                      ).map((sub) => (
                        <option key={sub.value} value={sub.value}>
                          {sub.label}
                        </option>
                      ))
                    : null}
                  {/* Custom subcategories from database */}
                  {customSubcategories.map((sub) => (
                    <option key={sub.id} value={sub.name}>
                      {i18n.language === "ar" && sub.name_ar
                        ? sub.name_ar
                        : sub.name}
                    </option>
                  ))}
                  <option value="__custom__">
                    + {t("add_custom") || "Add Custom"}
                  </option>
                </select>
              ) : (
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {t("enter_subcategory_name") || "Enter Subcategory"}
                    {["Gold", "Silver", "Platinum"].includes(newItem.metal_type)
                      ? " *"
                      : ` (${t("optional")})`}
                  </label>
                  <div className="inventory-form__row">
                    <input
                      className="inventory-form__input"
                      placeholder={
                        t("enter_subcategory_name") ||
                        "Enter subcategory (e.g., Ring 18K)"
                      }
                      value={customSubcategory}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomSubcategory(value);
                        // Update newItem directly when typing in custom input
                        // Extract karat only for Gold, Silver, Platinum (not for Watch or Diamond)
                        const extractedKarat =
                          newItem.metal_type !== "Watch" &&
                          newItem.metal_type !== "Diamond"
                            ? extractKaratFromSubcategory(value)
                            : null;
                        setNewItem((prev) => ({
                          ...prev,
                          subcategory: value,
                          karat: extractedKarat || "",
                        }));
                      }}
                      required={["Gold", "Silver", "Platinum"].includes(
                        newItem.metal_type,
                      )}
                    />
                    <button
                      type="button"
                      className="inventory-btn inventory-btn--secondary"
                      onClick={() => {
                        setShowCustomSubcategory(false);
                        setCustomSubcategory("");
                        setNewItem((prev) => ({
                          ...prev,
                          subcategory: "",
                          karat: "",
                        }));
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Images (Optional) */}
          {newItem.metal_type &&
            newItem.category &&
            (newItem.metal_type === "Diamond" ||
              newItem.metal_type === "Watch" ||
              newItem.subcategory ||
              !["Gold", "Silver", "Platinum"].includes(newItem.metal_type)) && (
              <>
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {t("images")} ({t("optional")})
                  </label>
                  <div className="inventory-form__upload-section">
                    <div className="inventory-form__thumbnails">
                      {selectedImages.map((image, idx) => (
                        <div key={idx} className="inventory-form__thumb">
                          <img
                            src={getImageUrl(image)}
                            alt="preview"
                            loading="lazy"
                          />
                          <button
                            type="button"
                            className="inventory-form__remove-thumb"
                            onClick={() => removeSelectedImage(idx)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      {selectedImages.length < 5 && (
                        <button
                          type="button"
                          className="inventory-form__add-thumb"
                          onClick={() => fileInputRef.current.click()}
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

                {/* Step 4: Diamond Fields (if Diamond selected) */}
                {newItem.metal_type === "Diamond" && (
                  <div className="inventory-form__section">
                    <label className="inventory-form__section-label">
                      {t("diamond_specifications") || "Diamond Specifications"}
                    </label>
                    <div className="inventory-form__row">
                      <div className="inventory-form__section">
                        <label className="inventory-form__section-label">
                          {t("diamond_carat") || "Diamond Carat"}
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="inventory-form__input"
                          placeholder={t("diamond_carat") || "Diamond Carat"}
                          value={newItem.diamond_carat}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              diamond_carat: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="inventory-form__section">
                        <label className="inventory-form__section-label">
                          {t("diamond_cut") || "Diamond Cut"}
                        </label>
                        <select
                          className="inventory-form__input"
                          value={newItem.diamond_cut}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              diamond_cut: e.target.value,
                            })
                          }
                        >
                          <option value="">{t("select") || "Select"}...</option>
                          {DIAMOND_CUTS.map((cut) => (
                            <option key={cut} value={cut}>
                              {cut}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="inventory-form__row">
                      <div className="inventory-form__section">
                        <label className="inventory-form__section-label">
                          {t("diamond_color") || "Diamond Color"}
                        </label>
                        <select
                          className="inventory-form__input"
                          value={newItem.diamond_color}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              diamond_color: e.target.value,
                            })
                          }
                        >
                          <option value="">{t("select") || "Select"}...</option>
                          {DIAMOND_COLORS.map((color) => (
                            <option key={color} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="inventory-form__section">
                        <label className="inventory-form__section-label">
                          {t("diamond_clarity") || "Diamond Clarity"}
                        </label>
                        <select
                          className="inventory-form__input"
                          value={newItem.diamond_clarity}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              diamond_clarity: e.target.value,
                            })
                          }
                        >
                          <option value="">{t("select") || "Select"}...</option>
                          {DIAMOND_CLARITY.map((clarity) => (
                            <option key={clarity} value={clarity}>
                              {clarity}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="inventory-form__row">
                      <div className="inventory-form__section">
                        <label className="inventory-form__section-label">
                          {t("diamond_shape") || "Diamond Shape"}
                        </label>
                        <select
                          className="inventory-form__input"
                          value={newItem.diamond_shape}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              diamond_shape: e.target.value,
                            })
                          }
                        >
                          <option value="">{t("select") || "Select"}...</option>
                          {DIAMOND_SHAPES.map((shape) => (
                            <option key={shape} value={shape}>
                              {shape}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="inventory-form__section">
                        <label className="inventory-form__section-label">
                          {t("diamond_setting") || "Diamond Setting"}
                        </label>
                        <select
                          className="inventory-form__input"
                          value={newItem.diamond_setting}
                          onChange={(e) =>
                            setNewItem({
                              ...newItem,
                              diamond_setting: e.target.value,
                            })
                          }
                        >
                          <option value="">{t("select") || "Select"}...</option>
                          {DIAMOND_SETTINGS.map((setting) => (
                            <option key={setting} value={setting}>
                              {setting}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Stones (if Gold/Silver/Platinum or custom metal that's not Diamond) */}
                {newItem.metal_type && newItem.metal_type !== "Diamond" && (
                  <div className="inventory-form__section">
                    <div className="inventory-form__section-header">
                      <label className="inventory-form__section-label">
                        {t("stones") || "Stones"} ({t("optional")})
                      </label>
                      <button
                        type="button"
                        className="inventory-btn inventory-btn--secondary"
                        onClick={handleAddStone}
                      >
                        <Plus size={16} /> {t("add_stone") || "Add Stone"}
                      </button>
                    </div>
                    {stones.map((stone, idx) => (
                      <div key={idx} className="inventory-form__stone-row">
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <label
                            className="inventory-form__section-label"
                            style={{
                              fontSize: "0.85rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {t("stone_type") || "Stone Type"}
                          </label>
                          <select
                            className="inventory-form__input"
                            value={stone.type}
                            onChange={(e) =>
                              handleUpdateStone(idx, "type", e.target.value)
                            }
                          >
                            <option value="">
                              {t("select") || "Select"}...
                            </option>
                            {STONE_TYPES.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <label
                            className="inventory-form__section-label"
                            style={{
                              fontSize: "0.85rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {t("stone_weight") || "Stone Weight"} (
                            {stone.unit === "ct" ? "ct" : "g"})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="inventory-form__input"
                            placeholder={stone.unit === "ct" ? "ct" : "g"}
                            value={stone.weight}
                            onChange={(e) =>
                              handleUpdateStone(idx, "weight", e.target.value)
                            }
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flex: 1,
                          }}
                        >
                          <label
                            className="inventory-form__section-label"
                            style={{
                              fontSize: "0.85rem",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {t("stone_weight_unit") || "Weight Unit"}
                          </label>
                          <select
                            className="inventory-form__input"
                            value={stone.unit || "g"}
                            onChange={(e) =>
                              handleUpdateStone(idx, "unit", e.target.value)
                            }
                          >
                            <option value="g">
                              {t("unit_gram") || "Gram (g)"}
                            </option>
                            <option value="ct">
                              {t("unit_carat") || "Carat (ct)"}
                            </option>
                          </select>
                        </div>
                        <label
                          className="inventory-form__checkbox-label"
                          style={{ alignSelf: "center" }}
                        >
                          <input
                            type="checkbox"
                            checked={stone.has_value}
                            onChange={(e) =>
                              handleUpdateStone(
                                idx,
                                "has_value",
                                e.target.checked,
                              )
                            }
                          />
                          {t("has_value") || "Has Value"}
                        </label>
                        {stone.has_value && (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              flex: 1,
                            }}
                          >
                            <label
                              className="inventory-form__section-label"
                              style={{
                                fontSize: "0.85rem",
                                marginBottom: "0.25rem",
                              }}
                            >
                              {t("stone_value") || "Stone Value"} (KD)
                            </label>
                            <input
                              type="number"
                              step="0.001"
                              min="0"
                              className="inventory-form__input"
                              placeholder={t("stone_value") || "Value (KD)"}
                              value={stone.value || ""}
                              onChange={(e) =>
                                handleUpdateStone(idx, "value", e.target.value)
                              }
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          className="inventory-btn inventory-btn--danger"
                          onClick={() => handleRemoveStone(idx)}
                          style={{ alignSelf: "center" }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Step 6: Country of Origin */}
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {t("country_of_origin")}
                  </label>
                  <select
                    className="inventory-form__input"
                    value={newItem.country_of_origin}
                    onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        country_of_origin: e.target.value,
                      })
                    }
                  >
                    {GCC_COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {i18n.language === "ar"
                          ? country.labelAr
                          : country.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Step 7: Weight */}
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {t("total_weight_g")} (G) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="inventory-form__input"
                    placeholder={t("total_weight_g_placeholder")}
                    required
                    value={newItem.weight}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (!isNaN(val) && parseFloat(val) >= 0)) {
                        setNewItem({ ...newItem, weight: val });
                      }
                    }}
                  />
                </div>

                {/* Step 8: Quantity and Min Stock Level (side by side) */}
                <div className="inventory-form__row">
                  <div className="inventory-form__section">
                    <label className="inventory-form__section-label">
                      {t("quantity") || "Quantity"} *
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="inventory-form__input"
                      placeholder={t("quantity") || "Quantity"}
                      required
                      value={newItem.quantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (!isNaN(val) && parseInt(val) >= 1)) {
                          setNewItem({ ...newItem, quantity: val });
                        }
                      }}
                    />
                  </div>
                  <div className="inventory-form__section">
                    <label className="inventory-form__section-label">
                      {t("min_stock_level")} *
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="inventory-form__input"
                      placeholder={t("min_stock_level")}
                      required
                      value={newItem.min_stock_level}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || (!isNaN(val) && parseInt(val) >= 0)) {
                          setNewItem({ ...newItem, min_stock_level: val });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Step 9: Price */}
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {newItem.metal_type === "Diamond" ||
                    newItem.metal_type === "Watch"
                      ? t("buy_price_total") || "Buy Price Total"
                      : t("buy_price_per_gram") || "Buy Price per Gram"}{" "}
                    *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="inventory-form__input"
                    placeholder={
                      newItem.metal_type === "Diamond" ||
                      newItem.metal_type === "Watch"
                        ? t("buy_price_total") || "Buy Price Total"
                        : t("buy_price_per_gram") || "Buy Price per Gram"
                    }
                    required
                    value={newItem.buy_price_per_gram}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || (!isNaN(val) && parseFloat(val) >= 0)) {
                        setNewItem({ ...newItem, buy_price_per_gram: val });
                      }
                    }}
                  />
                </div>

                {/* Step 10: Description (moved to bottom) */}
                <div className="inventory-form__section">
                  <label className="inventory-form__section-label">
                    {t("description") || "Description"} ({t("optional")})
                  </label>
                  <textarea
                    className="inventory-form__input inventory-form__input--textarea"
                    placeholder={t("description") || "Description"}
                    rows="3"
                    value={newItem.description}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description: e.target.value })
                    }
                  />
                  <textarea
                    className="inventory-form__input inventory-form__input--textarea"
                    placeholder={t("description_ar") || "Description Arabic"}
                    rows="3"
                    value={newItem.description_ar}
                    onChange={(e) =>
                      setNewItem({ ...newItem, description_ar: e.target.value })
                    }
                    style={{ textAlign: "right", marginTop: "0.75rem" }}
                  />
                </div>

                {/* Submit Button */}
                <div className="inventory-form__actions">
                  <button
                    type="button"
                    className="inventory-btn inventory-btn--secondary"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="inventory-btn inventory-btn--primary"
                    disabled={isSubmitting}
                    style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />}
                    {isSubmitting
                      ? isEditMode
                        ? t("updating") || "Updating..."
                        : t("adding") || "Adding..."
                      : isEditMode
                        ? t("update_item") || "Update Item"
                        : t("add_item")}
                  </button>
                </div>
              </>
            )}
        </form>
      </div>
    </div>
  );
};

export default AddItemModal;
