import React, { memo } from "react";
import { Printer, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./InventoryItem.css";

const InventoryItem = memo(
  ({
    item,
    calculateLivePrice,
    calculateProfit,
    onDelete,
    onPrint,
    onEdit,
    theme,
  }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleRowClick = () => {
      navigate(`/inventory/item/${item.id}`);
    };

    const handleEdit = (e) => {
      e.stopPropagation();
      if (onEdit) {
        onEdit(item);
      } else {
        navigate(`/inventory/item/${item.id}`);
      }
    };

    const handleDelete = (e) => {
      e.stopPropagation();
      onDelete(item.id);
    };

    const handlePrint = (e) => {
      e.stopPropagation();
      if (onPrint) onPrint(item);
    };

    const livePrice = calculateLivePrice(item);
    const profit = calculateProfit(item);
    const isProfitPositive = parseFloat(profit) >= 0;

    return (
      <tr
        className={`inventory-item inventory-item--${theme}`}
        onClick={handleRowClick}
      >
        <td className="inventory-item__cell inventory-item__cell--info">
          <div className="inventory-item__info">
            <span className="inventory-item__name">{item.item_name}</span>
            <div className="inventory-item__meta">
              <span className="inventory-item__barcode">{item.barcode}</span>
              <span className="inventory-item__separator">•</span>
              <span className="inventory-item__category">{item.category}</span>
            </div>
          </div>
        </td>
        <td className="inventory-item__cell" data-label={t("fabric_type")}>
          {item.fabric_type}
        </td>
        <td className="inventory-item__cell" data-label={t("fabric_type")}>
          {item.fabric_type ? (
            <span
              className={`inventory-item__badge inventory-item__badge--${item.fabric_type}k`}
            >
              {item.fabric_type}K
            </span>
          ) : (
            <span className="inventory-item__badge">-</span>
          )}
        </td>
        <td className="inventory-item__cell" data-label={t("meters")}>
          {item.length_m} <small>g</small>
        </td>
        <td className="inventory-item__cell" data-label={t("quantity")}>
          {item.quantity}
        </td>
        <td
          className="inventory-item__cell inventory-item__cell--mono"
          data-label={t("cost_price")}
        >
          {(parseFloat(item.cost_per_meter) || 0).toFixed(3)}
        </td>
        <td
          className="inventory-item__cell inventory-item__cell--bold"
          data-label={t("live_price")}
        >
          {livePrice || "0.000"}
        </td>
        <td className="inventory-item__cell" data-label={t("profit")}>
          <span
            className={`inventory-item__profit ${isProfitPositive ? "inventory-item__profit--pos" : "inventory-item__profit--neg"}`}
          >
            {profit || "0.000"}
          </span>
        </td>
        <td className="inventory-item__cell inventory-item__cell--actions">
          <div className="inventory-item__actions-group">
            <button
              className="inventory-item__action-btn"
              onClick={handlePrint}
              title={t("print_barcode")}
            >
              <Printer size={16} />
            </button>
            <button
              className="inventory-item__action-btn"
              onClick={handleEdit}
              title={t("edit")}
            >
              <Edit size={16} />
            </button>
            <button
              className="inventory-item__action-btn inventory-item__action-btn--delete"
              onClick={handleDelete}
              title={t("delete")}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </td>
      </tr>
    );
  },
);

InventoryItem.displayName = "InventoryItem";

export default InventoryItem;
