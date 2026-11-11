import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";

const RevenueChart = ({
  data,
  comparisonData,
  theme,
  metricType = "revenue",
  viewType = "value",
}) => {
  const { t } = useTranslation();
  const isDark = theme === "dark";

  if (!data || data.length === 0)
    return <div className="no-data">No Data Available</div>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);

    // Determine format based on data density
    // If we have many data points (>30), use weekly/monthly format
    const dataLength = data?.length || 0;

    if (dataLength > 30) {
      // Monthly format for long ranges
      return date.toLocaleDateString("en-GB", {
        month: "short",
        year: "2-digit",
      });
    } else if (dataLength > 14) {
      // Weekly format - show week start date
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    } else {
      // Daily format
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });
    }
  };

  // Determine which data key to use
  const dataKey = viewType === "quantity" ? "quantity" : metricType;

  // Get chart title
  const getChartTitle = () => {
    if (viewType === "quantity") {
      return t("quantity_items") + " - " + t("sales_trend");
    }
    return metricType === "profit"
      ? t("profit_analysis")
      : t("sales_performance");
  };

  // Get Y-axis label
  const getYAxisLabel = () => {
    return viewType === "quantity" ? t("items_sold") : "KWD";
  };

  // Get gradient color
  const gradientColor = metricType === "profit" ? "#10B981" : "#B8860B";

  const chartData = data.map((d, index) => {
    const item = {
      ...d,
      revenue: parseFloat(d.revenue) || 0,
      profit: parseFloat(d.profit) || 0,
      weight: parseFloat(d.meters ?? d.weight) || 0,
      quantity: parseInt(d.quantity) || 0,
    };

    if (comparisonData && comparisonData[index]) {
      item.compare_value = parseFloat(comparisonData[index][dataKey]) || 0;
    }

    return item;
  });

  return (
    <div className={`chart-container chart-container--${theme}`}>
      <h3 className="chart-title">{getChartTitle()}</h3>
      <div style={{ width: "100%", height: 300, minWidth: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient
                id={`color${metricType}${viewType}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={gradientColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#333" : "#eee"}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#888" : "#666"}
              tickFormatter={formatDate}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke={isDark ? "#888" : "#666"}
              label={{
                value: getYAxisLabel(),
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1a1a1a" : "#fff",
                borderRadius: "8px",
                border: "none",
              }}
              labelFormatter={formatDate}
              formatter={(value, name) => {
                const unit = viewType === "quantity" ? t("items") : "KWD";
                const formattedValue = `${parseFloat(value).toLocaleString()} ${unit}`;
                return [formattedValue, name];
              }}
            />
            {comparisonData && (
              <Area
                type="monotone"
                dataKey="compare_value"
                stroke={isDark ? "#444" : "#ccc"}
                fill="transparent"
                strokeDasharray="5 5"
                name={t("previous_period")}
                activeDot={{ r: 4 }}
              />
            )}
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColor}
              fillOpacity={1}
              fill={`url(#color${metricType}${viewType})`}
              name={
                viewType === "quantity"
                  ? t("quantity")
                  : metricType === "profit"
                    ? t("profit")
                    : t("revenue")
              }
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;
