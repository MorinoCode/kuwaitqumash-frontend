import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const COLORS_DARK = [
  "#2dd4bf",
  "#10B981",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#F97316",
  "#6366F1",
];

const COLORS_LIGHT = [
  "#2dd4bf",
  "#059669",
  "#2563EB",
  "#D97706",
  "#DC2626",
  "#7C3AED",
  "#DB2777",
  "#0891B2",
  "#EA580C",
  "#4F46E5",
];

const OwnerChartsSection = ({
  theme,
  t,
  activeTab,
  data,
  showBranchComparison,
  categoryChartData,
  categoryBarData,
  topItemsMetric,
  setTopItemsMetric,
  topItemsSorted,
  formatPrice,
  formatDate,
  truncateLabel,
}) => {
  const axisColor = theme === "dark" ? "#e2e8f0" : "#334155";
  const axisLineColor = theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8";
  const gridColor = theme === "dark" ? "rgba(148, 163, 184, 0.22)" : "#e2e8f0";

  return (
    <div
      className="charts-grid"
      style={{
        display:
          activeTab === "all" || activeTab === "charts" || activeTab === "top_fabrics"
            ? undefined
            : "none",
      }}
    >
      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("sales_trend_7d")}
        </h3>
        <div className="chart-box__container">
          {data?.charts?.sales_trend_7d &&
          data.charts.sales_trend_7d.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.charts.sales_trend_7d}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  dataKey="date"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                  tickFormatter={formatDate}
                />
                <YAxis
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={{ fill: "#2dd4bf", r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("sales_trend_30d")}
        </h3>
        <div className="chart-box__container">
          {data?.charts?.sales_trend_30d &&
          data.charts.sales_trend_30d.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.charts.sales_trend_30d}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  dataKey="date"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                  tickFormatter={formatDate}
                />
                <YAxis
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2dd4bf"
                  strokeWidth={3}
                  dot={{ fill: "#2dd4bf", r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      {showBranchComparison && (
        <div className={`chart-box chart-box--${theme}`}>
          <h3 className="chart-box__title">{t("sales_by_branch")}</h3>
          <div className="chart-box__container">
            {data?.charts?.sales_by_branch &&
            data.charts.sales_by_branch.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.sales_by_branch}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="revenue"
                    label={false}
                    isAnimationActive={false}
                  >
                    {data.charts.sales_by_branch.map((entry, index) => {
                      const colors = theme === "dark" ? COLORS_DARK : COLORS_LIGHT;
                      return (
                        <Cell
                          key={`cell-${index}`}
                          fill={colors[index % colors.length]}
                          stroke={theme === "dark" ? "#1a1a1a" : "#ffffff"}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatPrice(value)}
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                      border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                      borderRadius: "8px",
                      color: theme === "dark" ? "#fff" : "#000",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    wrapperStyle={{
                      paddingTop: "20px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => {
                      const item = data.charts.sales_by_branch.find((d) => d.name === value);
                      return item ? `${value} (${formatPrice(item.revenue)})` : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-box__empty">{t("no_data_available")}</div>
            )}
          </div>
        </div>
      )}

      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("sales_by_category_fabric")}
        </h3>
        <div className="chart-box__container">
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="45%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="revenue"
                  label={false}
                  isAnimationActive={false}
                >
                  {categoryChartData.map((entry, index) => {
                    const colors = theme === "dark" ? COLORS_DARK : COLORS_LIGHT;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                        stroke={theme === "dark" ? "#1a1a1a" : "#ffffff"}
                        strokeWidth={2}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  formatter={(value) => formatPrice(value)}
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "#1a1a1a" : "#ffffff",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                    borderRadius: "8px",
                    color: theme === "dark" ? "#fff" : "#000",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={80}
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => {
                    const item = categoryChartData.find((d) => d.name === value);
                    return item ? `${value} (${formatPrice(item.revenue)})` : value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("sales_by_category_fabric") || "Sales by fabric category"}
        </h3>
        <div className="chart-box__container">
          {data?.charts?.sales_by_category_fabric &&
          data.charts.sales_by_category_fabric.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryBarData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  dataKey="name"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 11, fontWeight: 600 }}
                  angle={-30}
                  textAnchor="end"
                  height={90}
                  interval={0}
                  tickFormatter={(value) => truncateLabel(value, 14)}
                />
                <YAxis
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Bar
                  dataKey="revenue"
                  fill="#2dd4bf"
                  radius={[5, 5, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("sales_by_fabric") || "Sales by fabric type"}
        </h3>
        <div className="chart-box__container">
          {data?.charts?.sales_by_fabric &&
          data.charts.sales_by_fabric.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.charts.sales_by_fabric}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  dataKey="fabric_type"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Bar
                  dataKey="revenue"
                  fill="#2dd4bf"
                  radius={[5, 5, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("top_fabrics") || "Top fabrics"}
        </h3>
        <div className="chart-box__container">
          {data?.charts?.top_fabrics && data.charts.top_fabrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.charts.top_fabrics} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  type="number"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={170}
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => truncateLabel(value, 16)}
                />
                <Tooltip formatter={(value) => `${value} m`} />
                <Bar
                  dataKey="meters"
                  fill="#3B82F6"
                  radius={[0, 5, 5, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      <div className={`chart-box chart-box--${theme}`}>
        <div className="chart-box__header">
          <h3 className="chart-box__title">
            {t("top_5_items")}
          </h3>
          <div className="chart-box__toggle">
            <button
              className={`chart-box__toggle-btn ${topItemsMetric === "revenue" ? "chart-box__toggle-btn--active" : ""}`}
              onClick={() => setTopItemsMetric("revenue")}
            >
              {t("revenue")}
            </button>
            <button
              className={`chart-box__toggle-btn ${topItemsMetric === "quantity" ? "chart-box__toggle-btn--active" : ""}`}
              onClick={() => setTopItemsMetric("quantity")}
            >
              {t("quantity")}
            </button>
          </div>
        </div>
        <div className="chart-box__container">
          {topItemsSorted.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topItemsSorted} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  type="number"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={170}
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => truncateLabel(value, 16)}
                />
                <Tooltip
                  formatter={(value) =>
                    topItemsMetric === "revenue" ? formatPrice(value) : value
                  }
                />
                <Bar
                  dataKey={topItemsMetric}
                  fill="#2dd4bf"
                  radius={[0, 5, 5, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>

      <div className={`chart-box chart-box--${theme}`}>
        <h3 className="chart-box__title">
          {t("top_5_customers")}
        </h3>
        <div className="chart-box__container">
          {data?.charts?.top_5_customers &&
          data.charts.top_5_customers.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.charts.top_5_customers} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={gridColor}
                />
                <XAxis
                  type="number"
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={170}
                  stroke={axisLineColor}
                  tick={{ fill: axisColor, fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => truncateLabel(value, 16)}
                />
                <Tooltip formatter={(value) => formatPrice(value)} />
                <Bar
                  dataKey="value"
                  fill="#2dd4bf"
                  radius={[0, 5, 5, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-box__empty">{t("no_data_available")}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerChartsSection;
