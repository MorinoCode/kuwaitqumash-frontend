import React from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshCw,
  AlertCircle,
  Sparkles,
  ShoppingCart,
  Package,
  FileText,
  Scissors,
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

const COLORS = ["#2dd4bf", "#000000", "#FFBB28", "#FF8042", "#8884d8"];

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
        dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
      >
        <div className="dashboard-loader__spinner"></div>
        <span className="dashboard-loader__text">{t("loading")}...</span>
      </div>
    );

  if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
    return (
      <div
        className={`dashboard-loader dashboard-loader--${theme}`}
        dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
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
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href="/sales"
            className="dash-csv-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
          >
            <ShoppingCart size={16} />
            <span>{t("create_invoice") || "+ صدور فاکتور جدید"}</span>
          </a>
          <a
            href="/inventory"
            className="dash-csv-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none" }}
          >
            <Package size={16} />
            <span>{t("inventory") || "موجودی انبار"}</span>
          </a>
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
      </div>

      <DateRangePicker
        onRangeChange={handleDateRangeChange}
        defaultRange="last_7_days"
      />

      {data?.kpi && (
        <div className={`dash-story-box dash-story-box--${theme}`}>
          <div className="dash-story__header">
            <Sparkles size={20} />
            <h3>
              {i18n.language === "fa"
                ? "خلاصه عملکرد شما به زبان ساده"
                : i18n.language === "ar"
                  ? "ملخص أدائك بلغة بسيطة"
                  : "Your Personal Sales Summary"}
            </h3>
          </div>
          <ul className="dash-story__list">
            <li>
              {i18n.language === "fa" ? (
                <>
                  خسته نباشید! شما در این بازه زمانی{" "}
                  <strong>{data.kpi.invoice_count ?? 0} فاکتور</strong> صادر
                  کرده‌اید و در مجموع{" "}
                  <strong>{data.kpi.my_meters_today ?? "0.00"} متر پارچه</strong>{" "}
                  به ارزش خالص{" "}
                  <strong className="dash-hl-teal">
                    {formatPrice(data.kpi.my_sales_today)} دینار
                  </strong>{" "}
                  فروخته‌اید.
                </>
              ) : i18n.language === "ar" ? (
                <>
                  يعطيك العافية! أصدرت{" "}
                  <strong>{data.kpi.invoice_count ?? 0} فاتورة</strong> وبعت{" "}
                  <strong>{data.kpi.my_meters_today ?? "0.00"} متر</strong> من
                  القماش بقيمة صافية{" "}
                  <strong className="dash-hl-teal">
                    {formatPrice(data.kpi.my_sales_today)} د.ك
                  </strong>
                  .
                </>
              ) : (
                <>
                  Great job! You issued{" "}
                  <strong>{data.kpi.invoice_count ?? 0} invoices</strong> and sold{" "}
                  <strong>{data.kpi.my_meters_today ?? "0.00"} meters</strong> of
                  fabric for{" "}
                  <strong className="dash-hl-teal">
                    {formatPrice(data.kpi.my_sales_today)} KWD
                  </strong>
                  .
                </>
              )}
            </li>
          </ul>
        </div>
      )}

      <div className="kpi-grid">
        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("my_sales_today")}</h3>
          <div className="kpi-card__value-wrapper">
            <span className="kpi-card__value" style={{ color: "var(--brand)" }}>
              {formatPrice(data?.kpi?.my_sales_today)}
            </span>
            <span className="kpi-card__unit">{t("kwd")}</span>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("meters_sold") || "متراژ فروخته‌شده"}</h3>
          <div className="kpi-card__value-wrapper">
            <span className="kpi-card__value">
              {data?.kpi?.my_meters_today ?? "0.00"}
            </span>
            <span className="kpi-card__unit">{t("m") || "m"}</span>
          </div>
        </div>

        <div className={`kpi-card kpi-card--${theme}`}>
          <h3 className="kpi-card__title">{t("invoices") || "تعداد فاکتورها"}</h3>
          <div className="kpi-card__value-wrapper">
            <span className="kpi-card__value">
              {data?.kpi?.invoice_count ?? data?.kpi?.items_sold_count ?? 0}
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

      {(data?.charts?.recent_invoices?.length > 0 ||
        data?.charts?.branch_remnants?.length > 0) && (
        <div className="charts-grid" style={{ marginBottom: "24px" }}>
          {data?.charts?.recent_invoices?.length > 0 && (
            <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
              <h3 className="chart-box__title dash-icon-title">
                <FileText size={20} />
                <span>{t("my_recent_invoices_title")}</span>
              </h3>
              <p className="dash-guide-text">{t("my_recent_invoices_guide")}</p>
              <div className="stock-table-wrapper">
                <table className={`stock-table stock-table--${theme}`}>
                  <thead className="stock-table__head">
                    <tr className="stock-table__row">
                      <th className="stock-table__header">{t("invoice_number") || "شماره فاکتور"}</th>
                      <th className="stock-table__header">{t("customer") || "مشتری"}</th>
                      <th className="stock-table__header">{t("meters") || "متراژ"}</th>
                      <th className="stock-table__header">{t("total") || "مبلغ"}</th>
                    </tr>
                  </thead>
                  <tbody className="stock-table__body">
                    {data.charts.recent_invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className={`stock-table__row stock-table__row--${theme}`}
                      >
                        <td className="stock-table__cell" style={{ fontWeight: 700 }}>
                          {inv.invoice_number}
                        </td>
                        <td className="stock-table__cell">{inv.customer_name}</td>
                        <td className="stock-table__cell">
                          {parseFloat(inv.total_meters || 0).toFixed(2)} m
                        </td>
                        <td className="stock-table__cell" style={{ color: "var(--brand)", fontWeight: 700 }}>
                          {formatPrice(inv.total_amount)} {t("kwd")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {data?.charts?.branch_remnants?.length > 0 && (
            <div className={`chart-box chart-box--${theme}`} style={{ minHeight: "auto" }}>
              <h3 className="chart-box__title dash-icon-title">
                <Scissors size={20} style={{ color: "#ec4899" }} />
                <span>{t("salesman_remnants_title")}</span>
              </h3>
              <p className="dash-guide-text">{t("salesman_remnants_guide")}</p>
              <div className="stock-table-wrapper">
                <table className={`stock-table stock-table--${theme}`}>
                  <thead className="stock-table__head">
                    <tr className="stock-table__row">
                      <th className="stock-table__header">{t("item_name")}</th>
                      <th className="stock-table__header">{t("fabric_type")}</th>
                      <th className="stock-table__header">{t("stock_meters") || "متراژ باقیمانده"}</th>
                      <th className="stock-table__header">{t("price") || "قیمت هر متر"}</th>
                    </tr>
                  </thead>
                  <tbody className="stock-table__body">
                    {data.charts.branch_remnants.map((item) => (
                      <tr
                        key={item.id}
                        className={`stock-table__row stock-table__row--${theme}`}
                      >
                        <td className="stock-table__cell">{item.name}</td>
                        <td className="stock-table__cell">
                          <span className="dash-fabric-pill">{item.fabric_type}</span>
                        </td>
                        <td className="stock-table__cell" style={{ color: "#ec4899", fontWeight: 700 }}>
                          {parseFloat(item.stock_meters || 0).toFixed(2)} m
                        </td>
                        <td className="stock-table__cell">
                          {formatPrice(item.price_per_meter)} {t("kwd")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

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
                      stroke={theme === "dark" ? "rgba(148, 163, 184, 0.22)" : "#e2e8f0"}
                    />
                    <XAxis
                      dataKey="date"
                      stroke={theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8"}
                      tick={{ fill: theme === "dark" ? "#e2e8f0" : "#334155", fontSize: 12, fontWeight: 600 }}
                      tickFormatter={formatDate}
                    />
                    <YAxis
                      stroke={theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8"}
                      tick={{ fill: theme === "dark" ? "#e2e8f0" : "#334155", fontSize: 12, fontWeight: 600 }}
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
              </div>
            </div>
          )}

        {data?.charts?.sales_by_category_fabric &&
          data.charts.sales_by_category_fabric.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">
                {t("sales_by_category_fabric")}
              </h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.charts.sales_by_category_fabric}
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
                      isAnimationActive={false}
                    >
                      {data.charts.sales_by_category_fabric.map(
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

        {data?.charts?.sales_by_fabric &&
          data.charts.sales_by_fabric.length > 0 && (
            <div className={`chart-box chart-box--${theme}`}>
              <h3 className="chart-box__title">{t("sales_by_fabric")}</h3>
              <div className="chart-box__container">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={data.charts.sales_by_fabric}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={theme === "dark" ? "rgba(148, 163, 184, 0.22)" : "#e2e8f0"}
                    />
                    <XAxis
                      dataKey="fabric_type"
                      stroke={theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8"}
                      tick={{ fill: theme === "dark" ? "#e2e8f0" : "#334155", fontSize: 12, fontWeight: 600 }}
                    />
                    <YAxis
                      stroke={theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8"}
                      tick={{ fill: theme === "dark" ? "#e2e8f0" : "#334155", fontSize: 12, fontWeight: 600 }}
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
              </div>
            </div>
          )}

        {data?.charts?.top_5_items && data.charts.top_5_items.length > 0 && (
          <div className={`chart-box chart-box--${theme}`}>
            <h3 className="chart-box__title">{t("top_items_i_sold")}</h3>
            <div className="chart-box__container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.charts.top_5_items} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme === "dark" ? "rgba(148, 163, 184, 0.22)" : "#e2e8f0"}
                  />
                  <XAxis
                    type="number"
                    stroke={theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8"}
                    tick={{ fill: theme === "dark" ? "#e2e8f0" : "#334155", fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={120}
                    stroke={theme === "dark" ? "rgba(94, 234, 212, 0.45)" : "#94a3b8"}
                    tick={{ fill: theme === "dark" ? "#e2e8f0" : "#334155", fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip formatter={(value) => formatPrice(value)} />
                  <Bar dataKey="revenue" fill="#2dd4bf" radius={[0, 5, 5, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

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
