import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";

const Cart = ({ cart, onUpdateItem, onRemoveItem }) => {
  const { t, i18n } = useTranslation();

  const handleInputChange = (itemId, field, value) => {
    if (field === "cartQty") {
      const norm = normalizeToLatinDigits(value);
      const intVal = parseInt(norm, 10);
      if (value === "" || (!isNaN(intVal) && intVal >= 1)) {
        onUpdateItem(itemId, field, value === "" ? "" : intVal);
      }
      return;
    }
    const norm = normalizeToLatinDigits(value);
    if (value === "" || (!isNaN(parseFloat(norm)) && parseFloat(norm) >= 0)) {
      onUpdateItem(itemId, field, value);
    }
  };

  const unitLabel = (item) =>
    item.unit === "roll"
      ? t("roll") || "roll"
      : item.unit === "piece"
        ? t("piece") || "pc"
        : t("meter") || "m";

  const lineMeters = (item) => {
    const meters = parseFloat(item.meters) || 0;
    const qty = Math.max(1, parseInt(item.cartQty, 10) || 1);
    return meters * qty;
  };

  return (
    <div className="sales-card sales-cart">
      <h3 className="sales-card__title">
        {t("shopping_cart")} ({cart.length})
      </h3>

      {/* Desktop Table View */}
      <div className="sales-cart__table-wrapper">
        <table className="sales-cart__table">
          <thead>
            <tr>
              <th>{t("item")}</th>
              <th>{t("quantity")}</th>
              <th>{t("length_m") || "Length (m)"}</th>
              <th>{t("price_per_meter") || "Price/m"}</th>
              <th>{t("discount") || "Discount"}</th>
              <th>{t("total")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              const qty = Math.max(
                1,
                parseInt(
                  normalizeToLatinDigits(String(item.cartQty ?? "")),
                  10,
                ) || 1,
              );
              const stockQty = parseInt(
                normalizeToLatinDigits(String(item.quantity ?? "")),
                10,
              );
              const exceedsStock = stockQty > 0 && qty > stockQty;
              return (
                <tr
                  key={item.id}
                  className={exceedsStock ? "sales-cart__row--warning" : ""}
                >
                  <td>
                    <div className="sales-cart__item-name">
                      {i18n.language === "ar" && item.item_name_ar
                        ? item.item_name_ar
                        : item.item_name}
                    </div>
                    <div className="sales-cart__item-sub">{item.barcode}</div>
                    {exceedsStock && (
                      <div
                        className="sales-cart__stock-warning"
                        title={t("quantity_exceeds_stock")}
                      >
                        {t("quantity_exceeds_stock")}
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="sales-cart__input sales-cart__input--qty"
                      value={item.cartQty ?? 1}
                      onChange={(e) =>
                        handleInputChange(item.id, "cartQty", e.target.value)
                      }
                      aria-label={`${t("quantity")} for ${item.item_name}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.meters ?? 0}
                      onChange={(e) =>
                        handleInputChange(item.id, "meters", e.target.value)
                      }
                      aria-label={`${t("length_m")} for ${item.item_name}`}
                    />
                    <span
                      style={{ marginLeft: "0.5rem", fontSize: "0.85rem" }}
                    >
                      {unitLabel(item)}
                    </span>
                    <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                      {lineMeters(item).toFixed(3)} {unitLabel(item)}
                    </div>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.price_per_meter ?? 0}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "price_per_meter",
                          e.target.value,
                        )
                      }
                      aria-label={`${t("price_per_meter")} for ${item.item_name}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.discount ?? 0}
                      onChange={(e) =>
                        handleInputChange(item.id, "discount", e.target.value)
                      }
                      title={t("line_discount_hint") || "Line discount in KD"}
                      aria-label={`${t("discount")} for ${item.item_name}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.total_price ?? 0}
                      onChange={(e) =>
                        handleInputChange(item.id, "total_price", e.target.value)
                      }
                      aria-label={`${t("total")} for ${item.item_name}`}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="sales-btn-icon sales-btn-icon--danger"
                      title={t("remove")}
                      aria-label={`${t("remove")} ${item.item_name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
            {cart.length === 0 && (
              <tr>
                <td colSpan="7" className="sales-cart__empty">
                  {t("cart_is_empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="sales-cart__mobile-list">
        {cart.length === 0 ? (
          <div className="sales-cart__empty">{t("cart_is_empty")}</div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="sales-cart__mobile-item">
              <div className="sales-cart__mobile-header">
                <div style={{ flex: 1 }}>
                  <div className="sales-cart__mobile-name">
                    {i18n.language === "ar" && item.item_name_ar
                      ? item.item_name_ar
                      : item.item_name}
                  </div>
                  <div className="sales-cart__mobile-sub">
                    {item.barcode}
                    {item.fabric_type ? ` | ${item.fabric_type}` : ""}
                  </div>
                </div>
                <button
                  className="sales-cart__mobile-remove"
                  onClick={() => onRemoveItem(item.id)}
                  title={t("remove")}
                  aria-label={`${t("remove")} ${item.item_name}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="sales-cart__mobile-inputs">
                <div className="sales-cart__mobile-input-group">
                  <label>{t("quantity")}</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    className="sales-cart__input sales-cart__input--qty"
                    value={item.cartQty ?? 1}
                    onChange={(e) =>
                      handleInputChange(item.id, "cartQty", e.target.value)
                    }
                    aria-label={`${t("quantity")} for ${item.item_name}`}
                  />
                </div>
                <div className="sales-cart__mobile-input-group">
                  <label>
                    {t("length_m") || "Length"} ({unitLabel(item)})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.meters ?? 0}
                    onChange={(e) =>
                      handleInputChange(item.id, "meters", e.target.value)
                    }
                    aria-label={`${t("length_m")} for ${item.item_name}`}
                  />
                </div>
                <div className="sales-cart__mobile-input-group">
                  <label>
                    {t("price_per_meter") || "Price/m"} ({t("kwd")})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.price_per_meter ?? 0}
                    onChange={(e) =>
                      handleInputChange(
                        item.id,
                        "price_per_meter",
                        e.target.value,
                      )
                    }
                    aria-label={`${t("price_per_meter")} for ${item.item_name}`}
                  />
                </div>
                <div className="sales-cart__mobile-input-group">
                  <label>
                    {t("discount") || "Discount"} ({t("kwd")})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.discount ?? 0}
                    onChange={(e) =>
                      handleInputChange(item.id, "discount", e.target.value)
                    }
                    aria-label={`${t("discount")} for ${item.item_name}`}
                  />
                </div>
                <div className="sales-cart__mobile-input-group">
                  <label>
                    {t("total")} ({t("kwd")})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.total_price ?? 0}
                    onChange={(e) =>
                      handleInputChange(item.id, "total_price", e.target.value)
                    }
                    aria-label={`${t("total")} for ${item.item_name}`}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Cart;
