import React from "react";
import { TrendingUp, Scale, Coins, ShoppingBag } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./KPIStats.css";

const KPIStats = ({ data, changes, theme }) => {
  const { t } = useTranslation();

  if (!data) return null;

  const cards = [
    {
      title: t("total_revenue"),
      value: `${parseFloat(data.revenue).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`,
      unit: "KWD",
      icon: <Coins size={32} style={{ color: "#2dd4bf" }} />,
      color: "brand",
      change: changes?.revenue,
    },
    {
      title: t("gross_profit"),
      value: `${parseFloat(data.profit).toLocaleString("en-US", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`,
      unit: "KWD",
      icon: <TrendingUp size={32} style={{ color: "#4caf50" }} />,
      color: "green",
      change: changes?.profit,
    },
    {
      title: t("meters_sold") || "Meters sold",
      value: `${parseFloat(data.meters_sold ?? data.weight_sold ?? 0).toFixed(2)}`,
      unit: "m",
      icon: <Scale size={32} style={{ color: "#2196f3" }} />,
      color: "blue",
      change: changes?.meters_sold,
    },
    {
      title: t("transactions"),
      value: data.transactions?.toLocaleString("en-US") || "0",
      unit: "",
      icon: <ShoppingBag size={32} style={{ color: "#9c27b0" }} />,
      color: "purple",
      change: changes?.transactions,
    },
  ];

  const renderChange = (change) => {
    if (change === undefined || change === null) return null;
    const isPositive = change >= 0;
    return (
      <div
        className={`kpi-card__change ${isPositive ? "is-positive" : "is-negative"}`}
      >
        <span style={{ fontSize: "1.2rem", marginRight: "4px" }}>
          {isPositive ? "↑" : "↓"}
        </span>
        <span>{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="kpi-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`kpi-card kpi-card--${theme} kpi-card--${card.color}`}
        >
          <div className="kpi-card__icon-wrapper">
            {React.cloneElement(card.icon, { size: 32 })}
          </div>
          <div className="kpi-card__content">
            <span className="kpi-card__title">{card.title}</span>
            <div className="kpi-card__subtitle">
              {card.color === "brand" &&
                (t("total_revenue_desc") || "Total sales amount")}
              {card.color === "green" &&
                (t("gross_profit_desc") || "Profit after costs")}
              {card.color === "blue" &&
                (t("meters_sold_desc") || "Fabric meters sold")}
              {card.color === "purple" &&
                (t("transactions_desc") || "Number of invoices")}
            </div>
            <div className="kpi-card__value-wrapper">
              <h3 className="kpi-card__value">{card.value}</h3>
              {card.unit && <span className="kpi-card__unit">{card.unit}</span>}
            </div>
            {renderChange(card.change)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPIStats;
