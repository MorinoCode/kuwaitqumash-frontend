import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { RefreshCw, AlertCircle, DollarSign, TrendingUp, Scale, FileText, BarChart3 } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDashboardManager } from "../../hooks/useDashboard";
import DateRangePicker from "../../components/dashboard/DateRangePicker";
import "./DashboardPage.css";

// Better color palette with high contrast and distinct colors
const COLORS_DARK = [
  "#D4AF37", // Gold
  "#10B981", // Green
  "#3B82F6", // Blue
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#6366F1", // Indigo
];

const COLORS_LIGHT = [
  "#D4AF37", // Gold
  "#059669", // Green
  "#2563EB", // Blue
  "#D97706", // Amber
  "#DC2626", // Red
  "#7C3AED", // Purple
  "#DB2777", // Pink
  "#0891B2", // Cyan
  "#EA580C", // Orange
  "#4F46E5", // Indigo
];

const ManagerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [staffPerformanceRange, setStaffPerformanceRange] = useState("today"); // 'today', 'week', 'month'
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
    range: "today",
  });

  // Use React Query hook with refresh
  const {
    data,
    isLoading: loading,
    refresh,
    isRefetching,
  } = useDashboardManager(dateRange.start && dateRange.end ? dateRange : null);

  // Format helper
  const formatPrice = (price) => {
    if (!price && price !== 0) return "--";
    return parseFloat(price).toFixed(3);
  };

  const formatLastUpdated = (dateStr) => {
    if (!dateStr) return t("just_now");
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return t("just_now");
      if (diffMins < 60) return `${diffMins} ${t("mins")} ago`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24)
        return `${diffHours} ${t("hour")}${diffHours > 1 ? "s" : ""} ago`;

      return date.toLocaleDateString(
        i18n.language === "ar" ? "ar-KW" : "en-US",
        {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        },
      );
    } catch {
      return t("just_now");
    }
  };

  // Handle date range change
  const handleDateRangeChange = (start, end, range) => {
    setDateRange({ start, end, range });
  };

  // Get staff performance data based on selected range
  const staffPerformanceData = useMemo(() => {
    if (!data?.charts) return [];

    switch (staffPerformanceRange) {
      case "today":
        return data.charts.staffPerformanceToday || [];
      case "week":
        return data.charts.staffPerformanceWeek || [];
      case "month":
        return data.charts.staffPerformanceMonth || [];
      default:
        return data.charts.staffPerformanceToday || [];
    }
  }, [data, staffPerformanceRange]);

  // Low Stock Count
  const lowStockCount = useMemo(() => {
    return data?.alerts?.low_stock_items?.length || 0;
  }, [data]);

  if (loading)
    return (
      <div
        className={`dashboard-loader dashboard-loader--${theme}`}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="dashboard-loader__spinner"></div>
        <span className="dashboard-loader__text">{t("loading")}...</span>
      </div>
    );

  // Show error state if API failed or data is empty
  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return (
      <div
        className={`dashboard-loader dashboard-loader--${theme}`}
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="dashboard-loader__error">
          <AlertCircle size={48} />
          <h3>{t("error_loading_dashboard") || "Error loading dashboard"}</h3>
          <p>
            {t("please_refresh") ||
              "Please refresh the page or try again later"}
          </p>
          <button
            className={`dashboard-header__refresh-btn dashboard-header__refresh-btn--${theme}`}
            onClick={refresh}
            disabled={isRefetching}
          >
            <RefreshCw size={18} className={isRefetching ? "spinning" : ""} />
            {t("refresh")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`manager-dashboard manager-dashboard--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header with Refresh and Last Updated */}
      <div className="dashboard-header">
        <div className="dashboard-header__title">
          <h1>{t("dashboard")}</h1>
          {data?.last_updated && (
            <span className="dashboard-header__last-updated">
              {t("last_updated")}: {formatLastUpdated(data.last_updated)}
            </span>
          )}
        </div>
        <button
          className={`dashboard-header__refresh-btn dashboard-header__refresh-btn--${theme}`}
          onClick={refresh}
          disabled={isRefetching}
          title={t("refresh")}
        >
          <RefreshCw size={18} className={isRefetching ? "spinning" : ""} />
          {t("refresh")}
        </button>
      </div>

      {/* Date Range Picker */}
      <DateRangePicker
        onRangeChange={handleDateRangeChange}
        defaultRange="today"
      />

      {/* Low Stock Alert Badge */}
      {lowStockCount > 0 && (
        <div className={`low-stock-badge low-stock-badge--${theme}`}>
          <AlertCircle size={20} />
          <span className="low-stock-badge__count">{lowStockCount}</span>
          <span className="low-stock-badge__text">{t("low_stock_alerts")}</span>
        </div>
      )}

      {/* Manager KPIs */}
      <div className="kpi-grid">
        <div className={`kpi-card kpi-card--${theme} kpi-card--primary`}>
          <div className="kpi-card__icon-wrapper">
            <div className="kpi-card__icon-bg kpi-card__icon-bg--gold">
              <DollarSign size={24} className="kpi-card__icon" />
            </div>
          </div>
          <div className="kpi-card__content">
            <div className="kpi-card__title">{t("todaysSales")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.branch_sales)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
            </div>
          </div>
        </div>
        <div className={`kpi-card kpi-card--${theme} kpi-card--success`}>
          <div className="kpi-card__icon-wrapper">
            <div className="kpi-card__icon-bg kpi-card__icon-bg--green">
              <TrendingUp size={24} className="kpi-card__icon" />
            </div>
          </div>
          <div className="kpi-card__content">
            <div className="kpi-card__title">{t("netProfit")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.net_profit)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
            </div>
          </div>
        </div>
        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <div className="kpi-card__icon-bg">
              <Scale size={24} className="kpi-card__icon" />
            </div>
          </div>
          <div className="kpi-card__content">
            <div className="kpi-card__title">{t("totalWeightSold")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.total_weight)}
              </span>
              <span className="kpi-card__unit">{t("g") || "g"}</span>
            </div>
          </div>
        </div>
        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <div className="kpi-card__icon-bg">
              <FileText size={24} className="kpi-card__icon" />
            </div>
          </div>
          <div className="kpi-card__content">
            <div className="kpi-card__title">{t("invoices")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {data?.kpi?.invoice_count || 0}
              </span>
            </div>
          </div>
        </div>
        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <div className="kpi-card__icon-bg">
              <BarChart3 size={24} className="kpi-card__icon" />
            </div>
          </div>
          <div className="kpi-card__content">
            <div className="kpi-card__title">{t("avg_sale_value")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.avg_sale_value)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
            </div>
          </div>
        </div>
        <div className={`kpi-card kpi-card--${theme} kpi-card--alert`}>
          <div className="kpi-card__icon-wrapper">
            <div className="kpi-card__icon-bg kpi-card__icon-bg--alert">
              <AlertCircle size={24} className="kpi-card__icon" />
            </div>
          </div>
          <div className="kpi-card__content">
            <div className="kpi-card__title kpi-card__title--alert">
              {t("low_stock_alerts")}
            </div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value kpi-card__value--alert">
                {data?.kpi?.low_stock_count || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="content-grid">
        {/* Low Stock Table */}
        <div
          className={`content-panel content-panel--${theme} ${lowStockCount > 0 ? "content-panel--alert" : ""}`}
        >
          <h3
            className={`content-panel__title ${lowStockCount > 0 ? "content-panel__title--alert" : ""}`}
          >
            {lowStockCount > 0 && <AlertCircle size={20} />}
            {t("lowStockItems")}
          </h3>
          {data?.alerts?.low_stock_items &&
          data.alerts.low_stock_items.length > 0 ? (
            <div className="stock-table-wrapper">
              <table className={`stock-table stock-table--${theme}`}>
                <thead className="stock-table__head">
                  <tr className="stock-table__row">
                    <th className="stock-table__header">{t("item_name")}</th>
                    <th className="stock-table__header">{t("category")}</th>
                    <th className="stock-table__header">{t("current")}</th>
                    <th className="stock-table__header">{t("min_limit")}</th>
                  </tr>
                </thead>
                <tbody className="stock-table__body">
                  {data.alerts.low_stock_items.map((item, i) => (
                    <tr
                      key={i}
                      className={`stock-table__row stock-table__row--${theme} ${lowStockCount > 0 ? "stock-table__row--critical" : ""}`}
                    >
                      <td className="stock-table__cell">
                        {item.name || item.item_name || "-"}
                      </td>
                      <td className="stock-table__cell">
                        {item.category || "-"}
                      </td>
                      <td className="stock-table__cell stock-table__cell--alert">
                        {item.qty || item.quantity || 0}
                      </td>
                      <td className="stock-table__cell stock-table__cell--faded">
                        {item.min || item.min_stock_level || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="content-panel__empty content-panel__empty--positive">
              <div className="content-panel__empty-icon">✨</div>
              <div className="content-panel__empty-text">
                {t("everythingLooksGreat")}
              </div>
            </div>
          )}
        </div>

        {/* Staff Leaderboard with Toggle */}
        <div className={`content-panel content-panel--${theme}`}>
          <div className="chart-box__header">
            <h3 className="content-panel__title">{t("staff_performance")}</h3>
            <div className="chart-box__toggle">
              <button
                className={`chart-box__toggle-btn ${staffPerformanceRange === "today" ? "chart-box__toggle-btn--active" : ""}`}
                onClick={() => setStaffPerformanceRange("today")}
              >
                {t("today")}
              </button>
              <button
                className={`chart-box__toggle-btn ${staffPerformanceRange === "week" ? "chart-box__toggle-btn--active" : ""}`}
                onClick={() => setStaffPerformanceRange("week")}
              >
                {t("week")}
              </button>
              <button
                className={`chart-box__toggle-btn ${staffPerformanceRange === "month" ? "chart-box__toggle-btn--active" : ""}`}
                onClick={() => setStaffPerformanceRange("month")}
              >
                {t("month")}
              </button>
            </div>
          </div>
          <div className="content-panel__chart">
            {staffPerformanceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={staffPerformanceData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    style={{ fontSize: 12 }}
                    tick={{ fill: theme === "dark" ? "#fff" : "#000" }}
                  />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Bar
                    dataKey="sales"
                    fill="#D4AF37"
                    radius={[0, 5, 5, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="content-panel__empty">{t("no_sales_data")}</div>
            )}
          </div>
        </div>

        {/* Sales by Category + Karat */}
        {data?.charts?.salesByCategoryKarat &&
          data.charts.salesByCategoryKarat.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">
                {t("sales_by_category_karat")}
              </h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.charts.salesByCategoryKarat}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="revenue"
                      label={false}
                    >
                      {data.charts.salesByCategoryKarat.map(
                        (entry, index) => {
                          const colors = theme === "dark" ? COLORS_DARK : COLORS_LIGHT;
                          return (
                            <Cell
                              key={`cell-${index}`}
                              fill={colors[index % colors.length]}
                              stroke={theme === "dark" ? "#1a1a1a" : "#ffffff"}
                              strokeWidth={2}
                            />
                          );
                        },
                      )}
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
                        const item = data.charts.salesByCategoryKarat.find(d => d.name === value);
                        return item ? `${value} (${formatPrice(item.revenue)})` : value;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {/* Sales by Karat */}
        {data?.charts?.salesByKarat &&
          data.charts.salesByKarat.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">{t("sales_by_karat")}</h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.charts.salesByKarat}>
                    <XAxis dataKey="karat" style={{ fontSize: 10 }} />
                    <YAxis style={{ fontSize: 10 }} />
                    <Tooltip formatter={(value) => formatPrice(value)} />
                    <Bar
                      dataKey="revenue"
                      fill="#D4AF37"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {/* Top 5 Items */}
        {data?.charts?.top5ItemsRevenue &&
          data.charts.top5ItemsRevenue.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">{t("top_5_items")}</h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={data.charts.top5ItemsRevenue}
                    layout="vertical"
                  >
                    <XAxis type="number" style={{ fontSize: 10 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      style={{ fontSize: 10 }}
                    />
                    <Tooltip formatter={(value) => formatPrice(value)} />
                    <Bar
                      dataKey="revenue"
                      fill="#D4AF37"
                      radius={[0, 5, 5, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {/* Top 5 Customers */}
        {data?.charts?.top5Customers &&
          data.charts.top5Customers.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">{t("top_5_customers")}</h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={data.charts.top5Customers}
                    layout="vertical"
                  >
                    <XAxis type="number" style={{ fontSize: 10 }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={120}
                      style={{ fontSize: 10 }}
                    />
                    <Tooltip formatter={(value) => formatPrice(value)} />
                    <Bar dataKey="value" fill="#D4AF37" radius={[0, 5, 5, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
