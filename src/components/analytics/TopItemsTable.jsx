import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import api from "../../api/axios";
import "./TopItemsTable.css";

const TopItemsTable = ({ dateRange, selectedBranches, theme, metricType }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(10);
  const [sortColumn, setSortColumn] = useState("revenue");
  const [sortDirection, setSortDirection] = useState("desc");

  const fetchTopItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...dateRange,
        branchIds: selectedBranches.join(","),
        metric: metricType,
        limit,
      };

      const response = await api.get("/dashboard/top-items", { params });

      if (response.data.success) {
        setItems(response.data.data);
      }
    } catch { void 0; } finally {
      setLoading(false);
    }
  }, [dateRange, selectedBranches, metricType, limit]);

  useEffect(() => {
    fetchTopItems();
  }, [fetchTopItems]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];
    if (sortColumn === "meters" || sortColumn === "weight") {
      aVal = a.meters ?? a.weight ?? 0;
      bVal = b.meters ?? b.weight ?? 0;
    }
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return (aVal > bVal ? 1 : -1) * multiplier;
  });

  const formatValue = (value, type) => {
    if (type === "currency") {
      return `${parseFloat(value || 0).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })} KWD`;
    }
    if (type === "number") {
      return parseInt(value || 0).toLocaleString();
    }
    if (type === "weight" || type === "meters") {
      return `${parseFloat(value || 0).toFixed(2)} m`;
    }
    return value;
  };

  return (
    <div className={`top-items-container top-items-container--${theme}`}>
      <div className="top-items-header">
        <h3 className="top-items-title">{t("top_performing_items")}</h3>

        <div className="top-items-controls">
          <div className="limit-selector">
            <label>{t("show")}:</label>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className={`limit-select limit-select--${theme}`}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">{t("loading")}...</div>
      ) : items.length === 0 ? (
        <div className="no-data-state">{t("no_data_available")}</div>
      ) : (
        <div className="table-wrapper">
          <table className="top-items-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className="sortable">
                  {t("item_name")}{" "}
                  {sortColumn === "name" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("category")} className="sortable">
                  {t("category")}{" "}
                  {sortColumn === "category" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("fabric_type")} className="sortable">
                  {t("fabric_type")}{" "}
                  {sortColumn === "fabric_type" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("revenue")}
                  className="sortable text-right"
                >
                  {t("revenue")}{" "}
                  {sortColumn === "revenue" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("profit")}
                  className="sortable text-right"
                >
                  {t("profit")}{" "}
                  {sortColumn === "profit" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("quantity")}
                  className="sortable text-right"
                >
                  {t("quantity")}{" "}
                  {sortColumn === "quantity" &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th
                  onClick={() => handleSort("meters")}
                  className="sortable text-right"
                >
                  {t("meters") || t("total_meters") || "Meters"}{" "}
                  {(sortColumn === "meters" || sortColumn === "weight") &&
                    (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item, index) => (
                <tr key={item.id} className={index < 3 ? "top-rank" : ""}>
                  <td className="item-name">
                    {index < 3 && (
                      <span className="rank-badge">#{index + 1}</span>
                    )}
                    {item.name}
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span className="fabric-badge">{item.fabric_type || "-"}</span>
                  </td>
                  <td className="currency">
                    {formatValue(item.revenue, "currency")}
                  </td>
                  <td className="currency profit">
                    {formatValue(item.profit, "currency")}
                  </td>
                  <td className="number">
                    {formatValue(item.quantity, "number")}
                  </td>
                  <td className="meters">
                    {formatValue(item.meters ?? item.weight, "meters")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopItemsTable;
