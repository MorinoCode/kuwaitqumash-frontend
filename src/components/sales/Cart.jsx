import React from "react";
import { useTranslation } from "react-i18next";
import { Trash2 } from "lucide-react";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";

const Cart = ({ cart, onUpdateItem, onRemoveItem }) => {
  const { t, i18n } = useTranslation();

  const stoneWeightToGrams = (stone) => {
    const w =
      parseFloat(normalizeToLatinDigits(String(stone?.weight ?? ""))) || 0;
    return stone?.unit === "ct" ? w * 0.2 : w;
  };
  const getStonesWeightG = (stones) => {
    if (!stones || !Array.isArray(stones)) return 0;
    return stones.reduce((sum, s) => sum + stoneWeightToGrams(s), 0);
  };

  const handleInputChange = (itemId, field, value) => {
    if (field === "cartQty") {
      const norm = normalizeToLatinDigits(value);
      const intVal = parseInt(norm, 10);
      if (value === "" || (!isNaN(intVal) && intVal >= 1)) {
        onUpdateItem(itemId, field, value === "" ? "" : intVal);
      }
      return;
    }
    if (field === "stones_value") {
      onUpdateItem(itemId, field, value);
      return;
    }
    const norm = normalizeToLatinDigits(value);
    if (value === "" || (!isNaN(parseFloat(norm)) && parseFloat(norm) >= 0)) {
      onUpdateItem(itemId, field, value);
    }
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
              <th>{t("weight")}</th>
              <th>{t("stones")}</th>
              <th>{t("rate")}</th>
              <th>{t("making_charge")}</th>
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
                  10
                ) || 1
              );
              const stockQty =
                parseInt(
                  normalizeToLatinDigits(String(item.quantity ?? "")),
                  10
                ) ?? 1;
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
                      value={item.weight || 0}
                      onChange={(e) =>
                        handleInputChange(item.id, "weight", e.target.value)
                      }
                      aria-label={`${t("weight")} for ${item.item_name}`}
                    />
                    <span style={{ marginLeft: "0.5rem", fontSize: "0.85rem" }}>
                      {t("g")} {item.karat ? `(${item.karat}K)` : ""}
                    </span>
                  </td>
                  <td className="sales-cart__stone-cell">
                    {item.stones && item.stones.length > 0 ? (
                      <>
                        <span className="sales-cart__stone-weight">
                          {getStonesWeightG(item.stones).toFixed(3)} {t("g")}
                        </span>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          className="sales-cart__input sales-cart__input--stone-value"
                          value={item.stones_value ?? ""}
                          onChange={(e) =>
                            handleInputChange(
                              item.id,
                              "stones_value",
                              e.target.value
                            )
                          }
                          placeholder={t("stone_price")}
                          aria-label={`${t("stone_price")} for ${
                            item.item_name
                          }`}
                        />
                      </>
                    ) : (
                      <span className="sales-cart__stone-none">—</span>
                    )}
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.price_per_gram || 0}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "price_per_gram",
                          e.target.value
                        )
                      }
                      aria-label={`${t("rate")} for ${item.item_name}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.labor_cost || 0}
                      onChange={(e) =>
                        handleInputChange(item.id, "labor_cost", e.target.value)
                      }
                      title={
                        t("making_charge_per_gram") ||
                        "Making charge per gram (automatically calculated but editable)"
                      }
                      aria-label={`${t("making_charge")} for ${item.item_name}`}
                    />
                    <span
                      style={{
                        marginLeft: "0.25rem",
                        fontSize: "0.75rem",
                        opacity: 0.7,
                      }}
                    >
                      /{t("g")}
                    </span>
                  </td>
                  <td>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.total_price || 0}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "total_price",
                          e.target.value
                        )
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
                <td colSpan="8" className="sales-cart__empty">
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
                    {item.barcode} {item.karat ? `| ${item.karat}K` : ""}
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
                    {t("weight")} ({t("g")})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.weight || 0}
                    onChange={(e) =>
                      handleInputChange(item.id, "weight", e.target.value)
                    }
                    placeholder={t("weight")}
                    aria-label={`${t("weight")} for ${item.item_name}`}
                  />
                </div>
                {item.stones && item.stones.length > 0 && (
                  <div className="sales-cart__mobile-input-group">
                    <label>
                      {t("stones")} ({t("g")}) / {t("stone_price")}
                    </label>
                    <span style={{ marginRight: "0.5rem" }}>
                      {getStonesWeightG(item.stones).toFixed(3)} {t("g")}
                    </span>
                    <input
                      type="number"
                      step="0.001"
                      min="0"
                      className="sales-cart__input"
                      value={item.stones_value ?? ""}
                      onChange={(e) =>
                        handleInputChange(
                          item.id,
                          "stones_value",
                          e.target.value
                        )
                      }
                      placeholder={t("stone_price")}
                      aria-label={`${t("stone_price")} for ${item.item_name}`}
                    />
                  </div>
                )}
                <div className="sales-cart__mobile-input-group">
                  <label>
                    {t("rate")} ({t("per_gram")})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.price_per_gram || 0}
                    onChange={(e) =>
                      handleInputChange(
                        item.id,
                        "price_per_gram",
                        e.target.value
                      )
                    }
                    placeholder={t("rate")}
                    aria-label={`${t("rate")} for ${item.item_name}`}
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
                    value={item.total_price || 0}
                    onChange={(e) =>
                      handleInputChange(item.id, "total_price", e.target.value)
                    }
                    placeholder={t("total")}
                    aria-label={`${t("total")} for ${item.item_name}`}
                  />
                </div>
                <div className="sales-cart__mobile-input-group">
                  <label>
                    {t("making_charge")} ({t("per_gram")})
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    className="sales-cart__input"
                    value={item.labor_cost || 0}
                    onChange={(e) =>
                      handleInputChange(item.id, "labor_cost", e.target.value)
                    }
                    title={
                      t("making_charge_per_gram") ||
                      "Making charge per gram (automatically calculated but editable)"
                    }
                    aria-label={`${t("making_charge")} for ${item.item_name}`}
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
