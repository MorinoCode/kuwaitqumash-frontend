import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff, RefreshCw, AlertCircle, DollarSign, TrendingUp, Scale, ShoppingCart, Users, Store, Check, Trash2, Sparkles, CreditCard, AlertTriangle } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useDashboardOwner } from "../../hooks/useDashboard";
import { toast } from "react-toastify";
import api from "../../api/axios";
import DateRangePicker from "../../components/dashboard/DateRangePicker";
import OwnerTablesSection from "./OwnerTablesSection";
import OwnerChartsSection from "./OwnerChartsSection";
import "./DashboardPage.css";

const OwnerDashboard = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [showProfit, setShowProfit] = useState(false);
  const [topItemsMetric, setTopItemsMetric] = useState("revenue");
  const [activeTab, setActiveTab] = useState("all");
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

  // Long fabric/item names are clipped by the chart area, so axis labels are shortened
  // (the full name stays in the tooltip).
  const [alertActionId, setAlertActionId] = useState(null);

  const dismissAlert = async (id) => {
    try {
      setAlertActionId(id);
      await api.post(`/inventory/${id}/dismiss-alert`);
      refresh();
    } catch {
      toast.error(t("failed_to_dismiss_alert"));
    } finally {
      setAlertActionId(null);
    }
  };

  const deleteLowStockItem = async (id, name) => {
    if (!window.confirm(`${t("confirm_delete_item")}\n${name || ""}`)) return;
    try {
      setAlertActionId(id);
      await api.delete(`/inventory/${id}`);
      toast.success(t("item_deleted"));
      refresh();
    } catch (error) {
      toast.error(error?.response?.data?.message || t("failed_delete_item"));
    } finally {
      setAlertActionId(null);
    }
  };

  const truncateLabel = (value, max = 16) => {
    const text = String(value ?? "");
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  };

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

  // A fabric shop has dozens of fabric/colour combinations; showing every one turns
  // the donut into unreadable slivers, so only the biggest ones get their own slice.
  const categoryChartData = useMemo(() => {
    const rows = data?.charts?.sales_by_category_fabric;
    if (!rows || rows.length === 0) return [];
    const maxSlices = 8;
    const sorted = [...rows].sort(
      (a, b) => (b.revenue || 0) - (a.revenue || 0),
    );
    if (sorted.length <= maxSlices) return sorted;

    const head = sorted.slice(0, maxSlices - 1);
    const rest = sorted.slice(maxSlices - 1);
    const other = rest.reduce(
      (acc, row) => ({
        ...acc,
        revenue: acc.revenue + (row.revenue || 0),
        profit: acc.profit + (row.profit || 0),
        quantity: acc.quantity + (row.quantity || 0),
      }),
      {
        name: t("other_categories"),
        revenue: 0,
        profit: 0,
        quantity: 0,
        is_other: true,
      },
    );
    return [...head, other];
  }, [data, t]);

  const categoryBarData = useMemo(() => {
    const rows = data?.charts?.sales_by_category_fabric;
    if (!rows || rows.length === 0) return [];
    return [...rows]
      .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
      .slice(0, 12);
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

  const topItemsFull = useMemo(() => {
    return data?.charts?.top_5_items_revenue || [];
  }, [data]);

  const paymentMethods = useMemo(() => {
    return data?.charts?.payment_methods || [];
  }, [data]);

  const staffPerformance = useMemo(() => {
    return data?.charts?.staff_performance || [];
  }, [data]);

  const deadStock = useMemo(() => {
    return data?.charts?.dead_stock || [];
  }, [data]);

  const remnants = useMemo(() => {
    return data?.charts?.remnants || [];
  }, [data]);

  const exportTopItemsCSV = () => {
    if (!topItemsFull.length) return;
    const headers = [
      "Rank",
      "Item Name",
      "Pattern / Color",
      "Fabric Type",
      "Revenue (KWD)",
      "Profit (KWD)",
      "Margin (%)",
      "Sold Meters (m)",
      "Remaining Stock (m)",
      "Est. Days Left",
    ];
    const rows = topItemsFull.map((item, idx) => {
      const rev = parseFloat(item.revenue || 0);
      const prof = parseFloat(item.profit || 0);
      const margin =
        item.profit_margin !== undefined
          ? parseFloat(item.profit_margin)
          : rev > 0
            ? (prof / rev) * 100
            : 0;
      return [
        idx + 1,
        `"${String(item.name || "").replace(/"/g, '""')}"`,
        `"${String(item.category || item.pattern || "-").replace(/"/g, '""')}"`,
        `"${String(item.fabric_type || "-").replace(/"/g, '""')}"`,
        rev.toFixed(3),
        prof.toFixed(3),
        margin.toFixed(1),
        parseFloat(item.meters || 0).toFixed(2),
        parseFloat(item.stock_meters || 0).toFixed(2),
        item.days_until_stockout ?? "-",
      ].join(",");
    });
    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `qummash-top-fabrics-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderPlainSummary = () => {
    if (!data?.kpi) return null;
    const rev = formatPrice(data.kpi.total_sales || 0);
    const prof = formatPrice(data.kpi.net_profit || 0);
    const meters = parseFloat(data.kpi.total_meters || 0).toFixed(2);
    const tx = parseInt(data.kpi.invoice_count || 0, 10);
    const revNum = parseFloat(data.kpi.total_sales || 0);
    const profNum = parseFloat(data.kpi.net_profit || 0);
    const margin = revNum > 0 ? ((profNum / revNum) * 100).toFixed(1) : "0.0";
    const bestFabric = data?.charts?.top_fabrics?.[0];
    const deadCapital = deadStock.reduce(
      (s, i) => s + parseFloat(i.tied_capital || 0),
      0,
    );
    const lang = i18n.language;

    if (lang === "fa") {
      return (
        <ul className="dash-story__list">
          <li>
            <strong>خلاصه فروش و سود:</strong> در این بازه زمانی، شما{" "}
            <strong>{tx} فاکتور</strong> صادر کرده‌اید و{" "}
            <strong>{meters} متر پارچه</strong> به مبلغ خالص{" "}
            <strong className="dash-hl-teal">{rev} دینار</strong> فروخته‌اید.{" "}
            {showProfit && (
              <>
                سود خالص شما{" "}
                <strong className="dash-hl-green">{prof} دینار</strong> است (یعنی
                از هر ۱۰۰ دینار فروش، <strong>{margin} دینار</strong> سود خالص در
                جیب شما مانده است).
              </>
            )}
          </li>
          {bestFabric && parseFloat(bestFabric.revenue || 0) > 0 && (
            <li>
              <strong>پرفروش‌ترین جنس پارچه:</strong> بیشترین استقبال از پارچه{" "}
              <strong className="dash-hl-teal">«{bestFabric.name}»</strong> با فروش{" "}
              <strong>{bestFabric.meters} متر</strong> (به ارزش{" "}
              <strong>{formatPrice(bestFabric.revenue)} دینار</strong>) بوده است.
            </li>
          )}
          {(deadStock.length > 0 || remnants.length > 0) && (
            <li>
              <strong>وضعیت انبار و خواب سرمایه:</strong>{" "}
              {deadStock.length > 0 && (
                <>
                  <strong className="dash-hl-amber">{deadStock.length} طاقه</strong>{" "}
                  در این مدت هیچ فروشی نداشته‌اند ({formatPrice(deadCapital)} دینار
                  سرمایه قفل‌شده)
                </>
              )}
              {deadStock.length > 0 && remnants.length > 0 && " و "}
              {remnants.length > 0 && (
                <>
                  <strong className="dash-hl-amber">
                    {remnants.length} ته‌طاقه ناقص (زیر ۳.۵ متر)
                  </strong>{" "}
                  در انبار دارید که مناسب حراج هستند.
                </>
              )}
            </li>
          )}
        </ul>
      );
    }

    if (lang === "ar") {
      return (
        <ul className="dash-story__list">
          <li>
            <strong>ملخص المبيعات والأرباح:</strong> أصدرت{" "}
            <strong>{tx} فاتورة</strong> وبعت <strong>{meters} متر</strong> من
            القماش بقيمة صافية <strong className="dash-hl-teal">{rev} د.ك</strong>.{" "}
            {showProfit && (
              <>
                ربحك الصافي هو{" "}
                <strong className="dash-hl-green">{prof} د.ك</strong> (نسبة الربح{" "}
                <strong>{margin}%</strong>).
              </>
            )}
          </li>
          {bestFabric && parseFloat(bestFabric.revenue || 0) > 0 && (
            <li>
              <strong>القماش الأكثر طلباً:</strong>{" "}
              <strong className="dash-hl-teal">«{bestFabric.name}»</strong> بمبيعات{" "}
              <strong>{bestFabric.meters} متر</strong> ({formatPrice(bestFabric.revenue)}{" "}
              د.ك).
            </li>
          )}
          {(deadStock.length > 0 || remnants.length > 0) && (
            <li>
              <strong>تنبيه المخزن:</strong> يوجد{" "}
              <strong className="dash-hl-amber">{deadStock.length} رول راكد</strong>{" "}
              بدون مبيعات ({formatPrice(deadCapital)} د.ك) و{" "}
              <strong className="dash-hl-amber">
                {remnants.length} بقايا رولات (أقل من 3.5 متر)
              </strong>.
            </li>
          )}
        </ul>
      );
    }

    return (
      <ul className="dash-story__list">
        <li>
          <strong>Sales & Profit Summary:</strong> You issued{" "}
          <strong>{tx} invoices</strong> and sold <strong>{meters} meters</strong>{" "}
          of fabric for <strong className="dash-hl-teal">{rev} KWD</strong>.{" "}
          {showProfit && (
            <>
              Net profit is <strong className="dash-hl-green">{prof} KWD</strong> (
              <strong>{margin}%</strong> profit margin).
            </>
          )}
        </li>
        {bestFabric && parseFloat(bestFabric.revenue || 0) > 0 && (
          <li>
            <strong>Best-Selling Fabric:</strong>{" "}
            <strong className="dash-hl-teal">“{bestFabric.name}”</strong> with{" "}
            <strong>{bestFabric.meters} m</strong> sold (
            {formatPrice(bestFabric.revenue)} KWD).
          </li>
        )}
        {(deadStock.length > 0 || remnants.length > 0) && (
          <li>
            <strong>Inventory Alerts:</strong>{" "}
            <strong className="dash-hl-amber">{deadStock.length} unsold rolls</strong>{" "}
            ({formatPrice(deadCapital)} KWD locked) and{" "}
            <strong className="dash-hl-amber">
              {remnants.length} remnant rolls (under 3.5m)
            </strong>.
          </li>
        )}
      </ul>
    );
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

      {data?.kpi && (
        <div className={`dash-story-box dash-story-box--${theme}`}>
          <div className="dash-story__header">
            <Sparkles size={20} />
            <h3>{t("analytics_summary_title") || "خلاصه وضعیت فروشگاه به زبان ساده"}</h3>
          </div>
          {renderPlainSummary()}
        </div>
      )}

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
                    <th className="stock-table__header">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="stock-table__body">
                  {data.alerts.low_stock_items.map((item, i) => (
                    <tr
                      key={item.id || i}
                      className={`stock-table__row stock-table__row--${theme} stock-table__row--critical`}
                    >
                      <td className="stock-table__cell">
                        {item.name || item.item_name || "-"}
                      </td>
                      <td className="stock-table__cell">
                        {item.category || "-"}
                      </td>
                      <td className="stock-table__cell stock-table__cell--alert">
                        {item.stock_meters ?? item.quantity ?? 0} {t("m") || "m"}
                      </td>
                      <td className="stock-table__cell stock-table__cell--faded">
                        {item.min_stock_level || "-"}
                      </td>
                      <td className="stock-table__cell stock-table__cell--actions">
                        <button
                          type="button"
                          className="stock-table__action-btn"
                          title={t("dismiss_alert")}
                          aria-label={t("dismiss_alert")}
                          disabled={alertActionId === item.id}
                          onClick={() => dismissAlert(item.id)}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          type="button"
                          className="stock-table__action-btn stock-table__action-btn--danger"
                          title={t("delete_item")}
                          aria-label={t("delete_item")}
                          disabled={alertActionId === item.id}
                          onClick={() =>
                            deleteLowStockItem(item.id, item.name || item.item_name)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
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

      <nav className={`dash-tabs-bar dash-tabs-bar--${theme}`}>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          {t("analytics_tab_all") || "نمایش همه گزارش‌ها"}
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === "drawer_staff" ? "active" : ""}`}
          onClick={() => setActiveTab("drawer_staff")}
        >
          <CreditCard size={16} />
          <span>{t("payment_methods_breakdown") || "صندوق و فروشندگان"}</span>
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === "top_fabrics" ? "active" : ""}`}
          onClick={() => setActiveTab("top_fabrics")}
        >
          <span>{t("analytics_tab_fabrics") || "پرفروش‌ترین پارچه‌ها"}</span>
        </button>
        <button
          type="button"
          className={`dash-tab-btn dash-tab-btn--warn ${activeTab === "dead_stock" ? "active" : ""}`}
          onClick={() => setActiveTab("dead_stock")}
        >
          <AlertTriangle size={16} />
          <span>{t("analytics_tab_deadstock") || "طاقه‌های راکد و ته‌طاقه‌ها"}</span>
          {(deadStock.length > 0 || remnants.length > 0) && (
            <span className="dash-tab-badge">
              {deadStock.length + remnants.length}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === "charts" ? "active" : ""}`}
          onClick={() => setActiveTab("charts")}
        >
          <span>{t("analytics_tab_sales") || "نمودارهای فروش"}</span>
        </button>
      </nav>

      <OwnerTablesSection
        activeTab={activeTab}
        theme={theme}
        t={t}
        showProfit={showProfit}
        formatPrice={formatPrice}
        paymentMethods={paymentMethods}
        staffPerformance={staffPerformance}
        topItemsFull={topItemsFull}
        deadStock={deadStock}
        remnants={remnants}
        exportTopItemsCSV={exportTopItemsCSV}
      />

      <OwnerChartsSection
        theme={theme}
        t={t}
        activeTab={activeTab}
        data={data}
        showBranchComparison={showBranchComparison}
        categoryChartData={categoryChartData}
        categoryBarData={categoryBarData}
        topItemsMetric={topItemsMetric}
        setTopItemsMetric={setTopItemsMetric}
        topItemsSorted={topItemsSorted}
        formatPrice={formatPrice}
        formatDate={formatDate}
        truncateLabel={truncateLabel}
      />
    </div>
  );
};

export default OwnerDashboard;
