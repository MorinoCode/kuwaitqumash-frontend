import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { Eye, EyeOff, RefreshCw, AlertCircle, DollarSign, TrendingUp, Scale, ShoppingCart, Users, Store } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDashboardOwner } from "../../hooks/useDashboard";
import DateRangePicker from "../../components/dashboard/DateRangePicker";
import "./DashboardPage.css";

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

const OwnerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [showProfit, setShowProfit] = useState(false);
  const [topItemsMetric, setTopItemsMetric] = useState("revenue");
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
    range: "today",
  });

  const {
    data,
    isLoading: loading,
    refresh,
    isRefetching,
  } = useDashboardOwner(dateRange.start && dateRange.end ? dateRange : null);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "--";
    const num = parseFloat(price);
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    });
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "--";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(
        i18n.language === "ar" ? "ar-KW" : "en-US",
        {
          day: "2-digit",
          month: "2-digit",
        },
      );
    } catch {
      return dateStr;
    }
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

  const handleDateRangeChange = (start, end, range) => {
    setDateRange({ start, end, range });
  };

  const lowStockCount = useMemo(() => {
    return data?.alerts?.low_stock_items?.length || 0;
  }, [data]);

  const topItemsSorted = useMemo(() => {
    if (!data?.charts?.top_5_items_revenue) return [];
    const items = [...data.charts.top_5_items_revenue];
    return items
      .sort((a, b) => {
        if (topItemsMetric === "quantity") {
          return (b.quantity || 0) - (a.quantity || 0);
        }
        return (b.revenue || 0) - (a.revenue || 0);
      })
      .slice(0, 5);
  }, [data, topItemsMetric]);

  const showBranchComparison = useMemo(() => {
    return data?.charts?.sales_by_branch?.length > 1;
  }, [data]);

  if (loading)
    return (
      <div
        className={`dashboard-loader dashboard-loader--${theme}`}
        dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
      >
        <div className="dashboard-loader__spinner"></div>
        <span className="dashboard-loader__text">{t("loading")}...</span>
      </div>
    );

  if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
    return (
      <div
        className={`dashboard-loader dashboard-loader--${theme}`}
        dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
      >
        <div className="dashboard-loader__error">
          <AlertCircle size={48} />
          <h3>{t("error_loading_dashboard") || "Error loading dashboard"}</h3>
          <p>{t("please_refresh") || "Please refresh the page or try again later"}</p>
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
      className={`owner-dashboard owner-dashboard--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >

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

      <DateRangePicker
        onRangeChange={handleDateRangeChange}
        defaultRange="last_7_days"
      />

      {lowStockCount > 0 && (
        <div className={`low-stock-badge low-stock-badge--${theme}`}>
          <AlertCircle size={20} />
          <span className="low-stock-badge__count">{lowStockCount}</span>
          <span className="low-stock-badge__text">{t("low_stock_alerts")}</span>
        </div>
      )}

      <div className="kpi-grid">
        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <DollarSign className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">{t("kpi_period_sales")}</h3>
            <div className="kpi-card__subtitle">{t("kpi_period_sales_desc")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value" style={{ color: 'var(--brand)' }}>
                {formatPrice(data?.kpi?.total_sales)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <TrendingUp className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">{t("kpi_period_profit")}</h3>
            <div className="kpi-card__subtitle">{t("kpi_period_profit_desc")}</div>
            <div className="kpi-card__action-row">
              <div className="kpi-card__value-wrapper kpi-card__value-wrapper--profit">
                {showProfit ? (
                  <>
                    <span className="kpi-card__value" style={{ color: 'var(--green)' }}>
                      {formatPrice(data?.kpi?.net_profit)}
                    </span>
                    <span className="kpi-card__unit">{t("kwd")}</span>
                  </>
                ) : (
                  <span className="kpi-card__value" style={{ color: 'var(--text-muted-dark)' }}>•••••••</span>
                )}
              </div>
              <button
                onClick={() => setShowProfit(!showProfit)}
                className="kpi-card__toggle-btn"
                title={showProfit ? t("hide") : t("show")}
              >
                {showProfit ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <Scale className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">
              {t("kpi_period_meters")}
            </h3>
            <div className="kpi-card__subtitle">
              {t("kpi_period_meters_desc")}
            </div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.total_meters)}
              </span>
              <span className="kpi-card__unit">{t("m") || "m"}</span>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <ShoppingCart className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">
              {t("avg_sale_value")}
            </h3>
            <div className="kpi-card__subtitle">{t("avg_sale_value_desc")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.avg_sale_value)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <ShoppingCart className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">
              {t("kpi_period_invoices")}
            </h3>
            <div className="kpi-card__subtitle">
              {t("kpi_period_invoices_desc")}
            </div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {data?.kpi?.invoice_count || 0}
              </span>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <TrendingUp className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">
              {t("last_30_days") || "Last 30 days"}
            </h3>
            <div className="kpi-card__subtitle">
              {t("last_30_days_desc") || "Sales and meters in the last 30 days"}
            </div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.month_sales)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
              <span
                className="kpi-card__value"
                style={{ marginInlineStart: "0.75rem" }}
              >
                {formatPrice(data?.kpi?.month_meters)}
              </span>
              <span className="kpi-card__unit">{t("m") || "m"}</span>
            </div>
            <div className="kpi-card__subtitle">
              {data?.kpi?.month_invoices || 0} {t("invoices") || "invoices"}
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <Store className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">
              {t("total_inventory_value")}
            </h3>
            <div className="kpi-card__subtitle">{t("total_inventory_value_desc")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {formatPrice(data?.kpi?.total_inventory_value)}
              </span>
              <span className="kpi-card__unit">{t("kwd")}</span>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <div className="kpi-card__icon-wrapper">
            <Users className="kpi-card__icon" />
          </div>
          <div className="kpi-card__content">
            <h3 className="kpi-card__title">
              {t("active_branches")}
            </h3>
            <div className="kpi-card__subtitle">{t("active_branches_desc")}</div>
            <div className="kpi-card__value-wrapper">
              <span className="kpi-card__value">
                {data?.kpi?.active_branches || 0}
              </span>
            </div>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("whatsappStatus")}</h3>
          <div
            className={`kpi-card__status ${data?.kpi?.whatsapp_status === "CONNECTED" ? "kpi-card__status--connected" : "kpi-card__status--disconnected"}`}
          >
            {data?.kpi?.whatsapp_status === "CONNECTED"
              ? t("connected")
              : t("disconnected")}
          </div>
        </div>
      </div>

      {lowStockCount > 0 && (
        <div
          className={`content-panel content-panel--${theme} content-panel--alert`}
        >
          <h3 className="content-panel__title content-panel__title--alert">
            <AlertCircle size={20} />
            {t("critical_items")}
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
                      className={`stock-table__row stock-table__row--${theme} stock-table__row--critical`}
                    >
                      <td className="stock-table__cell">
                        {item.name || item.item_name || "-"}
                      </td>
                      <td className="stock-table__cell">
                        {item.category || "-"}
                      </td>
                      <td className="stock-table__cell stock-table__cell--alert">
                        {item.quantity || 0}
                      </td>
                      <td className="stock-table__cell stock-table__cell--faded">
                        {item.min_stock_level || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="content-panel__empty">
              {t("no_low_stock_items")}
            </div>
          )}
        </div>
      )}

      <div className="charts-grid">

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
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    style={{ fontSize: 10 }}
                    tickFormatter={formatDate}
                  />
                  <YAxis style={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2dd4bf"
                    strokeWidth={3}
                    dot={{ fill: "#2dd4bf", r: 4 }}
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
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="date"
                    style={{ fontSize: 10 }}
                    tickFormatter={formatDate}
                  />
                  <YAxis style={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2dd4bf"
                    strokeWidth={3}
                    dot={{ fill: "#2dd4bf", r: 4 }}
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
                      height={80}
                      iconType="circle"
                      wrapperStyle={{
                        paddingTop: "20px",
                        fontSize: "12px",
                      }}
                      formatter={(value) => {
                        const item = data.charts.sales_by_branch.find(d => d.name === value);
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
            {data?.charts?.sales_by_category_fabric &&
            data.charts.sales_by_category_fabric.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.sales_by_category_fabric}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="revenue"
                    label={false}
                  >
                    {data.charts.sales_by_category_fabric.map((entry, index) => {
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
                      const item = data.charts.sales_by_category_fabric.find(d => d.name === value);
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
                <BarChart data={data.charts.sales_by_category_fabric}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis
                    dataKey="name"
                    style={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis style={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Bar dataKey="revenue" fill="#2dd4bf" radius={[5, 5, 0, 0]} />
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
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis dataKey="fabric_type" style={{ fontSize: 10 }} />
                  <YAxis style={{ fontSize: 10 }} />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Bar dataKey="revenue" fill="#2dd4bf" radius={[5, 5, 0, 0]} />
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
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis type="number" style={{ fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    style={{ fontSize: 10 }}
                  />
                  <Tooltip formatter={(value) => `${value} m`} />
                  <Bar dataKey="meters" fill="#3B82F6" radius={[0, 5, 5, 0]} />
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
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis type="number" style={{ fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    style={{ fontSize: 10 }}
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
                    stroke={theme === "dark" ? "#444" : "#ddd"}
                    opacity={0.3}
                  />
                  <XAxis type="number" style={{ fontSize: 10 }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    style={{ fontSize: 10 }}
                  />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Bar dataKey="value" fill="#2dd4bf" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-box__empty">{t("no_data_available")}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
