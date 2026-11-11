import React from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshCw,
  AlertCircle,
} from "lucide-react";
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
} from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { useDashboardSalesman } from "../../hooks/useDashboard";
import DateRangePicker from "../../components/dashboard/DateRangePicker";
import "./DashboardPage.css";

const COLORS = ["#D4AF37", "#000000", "#FFBB28", "#FF8042", "#8884d8"];

const SalesmanDashboard = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [dateRange, setDateRange] = React.useState({
    start: null,
    end: null,
    range: "today",
  });

  const {
    data,
    isLoading: loading,
    refresh,
    isRefetching,
  } = useDashboardSalesman(dateRange.start && dateRange.end ? dateRange : null);

  const formatPrice = (price) => {
    if (!price && price !== 0) return "--";
    return parseFloat(price).toFixed(3);
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
      className={`sales-dashboard sales-dashboard--${theme}`}
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

      {/* My KPIs */}
      <div className="kpi-grid">
        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("my_sales_today")}</h3>
          <div className="kpi-card__value-wrapper">
            <span className="kpi-card__value">
              {formatPrice(data?.kpi?.my_sales_today)}
            </span>
            <span className="kpi-card__unit">{t("kwd")}</span>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("items_sold_count")}</h3>
          <div className="kpi-card__value-wrapper">
            <span className="kpi-card__value">
              {data?.kpi?.items_sold_count || 0}
            </span>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("avg_sale_value")}</h3>
          <div className="kpi-card__value-wrapper">
            <span className="kpi-card__value">
              {formatPrice(data?.kpi?.avg_sale_value)}
            </span>
            <span className="kpi-card__unit">{t("kwd")}</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        {data?.charts?.sales_trend_7d &&
          data.charts.sales_trend_7d.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">
                {t("my_sales_trend")} ({t("last_7_days")})
              </h3>
              <div className="chart-box__container">
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
                      stroke="#D4AF37"
                      strokeWidth={3}
                      dot={{ fill: "#D4AF37", r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {/* Sales by Category + Karat */}
        {data?.charts?.sales_by_category_karat &&
          data.charts.sales_by_category_karat.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">
                {t("sales_by_category_karat")}
              </h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.charts.sales_by_category_karat}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="revenue"
                      label={({ name, value }) =>
                        `${name}: ${formatPrice(value)}`
                      }
                    >
                      {data.charts.sales_by_category_karat.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ),
                      )}
                    </Pie>
                    <Tooltip formatter={(value) => formatPrice(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        {/* Sales by Karat */}
        {data?.charts?.sales_by_karat &&
          data.charts.sales_by_karat.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">{t("sales_by_karat")}</h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.charts.sales_by_karat}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "#444" : "#ddd"}
                      opacity={0.3}
                    />
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

        {/* Top 5 Items I Sold */}
        {data?.charts?.top_5_items && data.charts.top_5_items.length > 0 && (
          <div className={`chart-box chart-box--${theme}`}>
            <h3 className="chart-box__title">{t("top_items_i_sold")}</h3>
            <div className="chart-box__container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.charts.top_5_items} layout="vertical">
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
                  <Bar dataKey="revenue" fill="#D4AF37" radius={[0, 5, 5, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* My Stats Footer */}
      <div className={`stats-footer stats-footer--${theme}`}>
        <div className="stats-footer__label">{t("my_sales_today")}:</div>
        <div className="stats-footer__value">
          {formatPrice(data?.kpi?.my_sales_today)} {t("kwd")}
        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;
