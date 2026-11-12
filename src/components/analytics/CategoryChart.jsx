import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const COLORS = [
  "#B8860B",
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
];

const CategoryChart = ({
  data,
  comparisonData,
  theme,
  metricType = "revenue",
  viewType = "value",
}) => {
  const { t } = useTranslation();
  const isDark = theme === "dark";

  const chartData =
    data?.map((d) => {
      const dataKey = viewType === "quantity" ? "quantity" : metricType;
      const item = {
        name: d.name,
        value: parseFloat(d[dataKey]) || 0,
      };

      if (comparisonData) {
        const compItem = comparisonData.find((c) => c.name === d.name);
        item.compare_value = compItem ? parseFloat(compItem[dataKey]) : 0;
      }

      return item;
    }) || [];

  const getChartTitle = () => {
    if (viewType === "quantity") {
      return t("quantity_items") + " - " + t("category_distribution");
    }
    return (
      (metricType === "profit" ? t("profit") : t("revenue")) +
      " - " +
      t("category_distribution")
    );
  };

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,

  }) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;

    const radius = (innerRadius + outerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: "13px", fontWeight: "bold", pointerEvents: "none" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className={`chart-container chart-container--${theme}`}>
      <h3 className="chart-title">{getChartTitle()}</h3>
      <div style={{ width: "100%", height: 350, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              dataKey="value"
              label={renderCustomLabel}
              labelLine={false}
              isAnimationActive={false}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1a1a1a" : "#fff",
                borderRadius: "8px",
                border: "none",
                color: isDark ? "#ffffff" : "#1f2937",
              }}
              itemStyle={{ color: isDark ? "#ffffff" : "#1f2937" }}
              labelStyle={{ color: isDark ? "#ffffff" : "#1f2937" }}
              formatter={(value, name, props) => {
                const unit = viewType === "quantity" ? t("items") : "KWD";
                const currentVal = `${parseFloat(value).toLocaleString()} ${unit}`;

                if (
                  comparisonData &&
                  props.payload.compare_value !== undefined
                ) {
                  const compVal = `${parseFloat(props.payload.compare_value).toLocaleString()} ${unit}`;
                  const label =
                    metricType === "profit" ? t("profit") : t("revenue");
                  const displayText =
                    viewType === "quantity" ? t("quantity") : label;
                  return [
                    `${currentVal} (${t("previous")}: ${compVal})`,
                    displayText,
                  ];
                }

                const label =
                  metricType === "profit" ? t("profit") : t("revenue");
                const displayText =
                  viewType === "quantity" ? t("quantity") : label;
                return [currentVal, displayText];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryChart;
