import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useBranches } from "../../hooks/useBranches";
import { useBranch } from "../../context/BranchContext";
import {
  Sparkles,
  Wand2,
  Zap,
  Database,
  Clock,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Coins,
  Package,
} from "lucide-react";
import KPIStats from "../../components/analytics/KPIStats";
import RevenueChart from "../../components/analytics/RevenueChart";
import CategoryChart from "../../components/analytics/CategoryChart";
import BranchChart from "../../components/analytics/BranchChart";
import KaratChart from "../../components/analytics/KaratChart";
import BranchSelector from "../../components/analytics/BranchSelector";
import TopItemsTable from "../../components/analytics/TopItemsTable";
import "./AnalyticsPage.css";

const AnalyticsPage = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [selectedBranches, setSelectedBranches] = useState([]);

  const { data: branches = [] } = useBranches();
  const { activeBranchId } = useBranch();
  const [dateRange, setDateRange] = useState("30days");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [metricType, setMetricType] = useState("revenue");
  const [viewType, setViewType] = useState("value");
  const [compare, setCompare] = useState(false);
  const [compareType, setCompareType] = useState("previous_period");
  const [dataSource, setDataSource] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);

  const getStartDate = () => {
    const endDate = new Date();
    const startDate = new Date();
    if (dateRange === "7days") {
      startDate.setDate(endDate.getDate() - 7);
    } else if (dateRange === "30days") {
      startDate.setDate(endDate.getDate() - 30);
    } else if (dateRange === "90days") {
      startDate.setDate(endDate.getDate() - 90);
    }
    return startDate.toISOString();
  };

  useEffect(() => {
    if (
      branches.length > 0 &&
      activeBranchId &&
      selectedBranches.length === 0
    ) {

      const activeBranch = branches.find((b) => b.id === activeBranchId);
      if (activeBranch) {
        setSelectedBranches([activeBranchId]);
      } else if (branches.length > 0) {

        setSelectedBranches([branches[0].id]);
      }
    } else if (
      branches.length > 0 &&
      !activeBranchId &&
      selectedBranches.length === 0
    ) {

      setSelectedBranches([branches[0].id]);
    }
  }, [branches, activeBranchId, selectedBranches.length]);

  useEffect(() => {

    if (branches.length > 0 && selectedBranches.length > 0) {
      fetchAnalytics();
    }
  }, [branches.length, selectedBranches.length, fetchAnalytics]);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      let startDate = new Date();
      let endDate = new Date();

      if (dateRange === "7days") {
        startDate.setDate(endDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange === "30days") {
        startDate.setDate(endDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange === "90days") {
        startDate.setDate(endDate.getDate() - 90);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange === "custom") {
        if (!customStart || !customEnd) {
          setLoading(false);
          return;
        }
        startDate = new Date(customStart);
        endDate = new Date(customEnd);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      const params = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        compare: compare.toString(),
        compareType: compareType,
      };

      if (selectedBranches.length > 0) {
        params.branchIds = selectedBranches.join(",");
      }

      const response = await api.get("/dashboard/analytics", { params });

      if (response.data.success) {
        const result = response.data.data;

        const transformedData = {
          kpi: result?.current?.kpi || result?.kpi || null,
          charts: result?.current?.charts || result?.charts || null,
          comparison: result?.comparison || null,
          changes: result?.changes || null,
          data_source: result?.data_source || null,
          last_updated: result?.last_updated || null,
          next_update: result?.next_update || null,
        };

        setData(transformedData);
        setDataSource(transformedData.data_source);
        setLastUpdated(transformedData.last_updated);
        setNextUpdate(transformedData.next_update);
      }
    } catch { void 0; } finally {
      setLoading(false);
    }
  }, [dateRange, customStart, customEnd, compare, compareType, selectedBranches]);

  const formatTime = (dateStr) => {
    if (!dateStr) return "--";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return t("just_now");
      if (diffMins < 60) return `${diffMins} ${t("mins_ago")}`;

      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} ${t("hours_ago")}`;

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
      return "--";
    }
  };

  const formatNextUpdate = (dateStr) => {
    if (!dateStr) return "--";
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = date - now;
      const diffMins = Math.floor(diffMs / 60000);

      if (diffMins < 1) return t("updating_now");
      if (diffMins < 60) return `${diffMins} ${t("mins")}`;

      const diffHours = Math.floor(diffMins / 60);
      return `${diffHours} ${t("hours")}`;
    } catch {
      return "--";
    }
  };

  return (
    <div
      className={`analytics-page analytics-page--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >

      <div className="ai-header">
        <div className="ai-header__content">
          <div className="ai-header__icon">
            <Sparkles size={32} />
          </div>
          <div className="ai-header__text">
            <h1 className="ai-header__title">
              {t("ai_analytics") || "AI Analytics"}
            </h1>
            <p className="ai-header__subtitle">
              {t("ai_analytics_desc") ||
                "تحليل ذكي للبيانات باستخدام الذكاء الاصطناعي"}
            </p>
          </div>
        </div>
        <div className="ai-header__status">
          {dataSource === "cache" ? (
            <div className="data-source-badge data-source-badge--cache">
              <Database size={16} />
              <span>{t("cached_analysis")}</span>
            </div>
          ) : (
            <div className="data-source-badge data-source-badge--live">
              <Zap size={16} />
              <span>{t("live_analysis")}</span>
            </div>
          )}
        </div>
      </div>

      {(lastUpdated || nextUpdate) && (
        <div className="update-status-bar">
          <div className="update-status-item">
            <Clock size={16} />
            <span className="update-status-label">{t("last_updated")}:</span>
            <span className="update-status-value">
              {formatTime(lastUpdated)}
            </span>
          </div>
          {nextUpdate && (
            <div className="update-status-item">
              <RefreshCw size={16} />
              <span className="update-status-label">{t("next_update")}:</span>
              <span className="update-status-value">
                {formatNextUpdate(nextUpdate)}
              </span>
            </div>
          )}
        </div>
      )}

      <header className="analytics-header">
        <div>
          <h1 className="analytics-title">{t("dashboard")}</h1>
        </div>
        <div className="filter-group">

          {user?.role === "store_owner" && (
            <BranchSelector
              branches={branches}
              selectedBranches={selectedBranches}
              onSelectionChange={setSelectedBranches}
            />
          )}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`filter-select filter-select--${theme}`}
          >
            <option value="7days">{t("last_7_days")}</option>
            <option value="30days">{t("last_30_days")}</option>
            <option value="90days">{t("last_3_months")}</option>
            <option value="custom">{t("custom_range")}</option>
          </select>

          <div className="compare-control">
            <label className={`compare-label compare-label--${theme}`}>
              <input
                type="checkbox"
                checked={compare}
                onChange={(e) => setCompare(e.target.checked)}
              />
              {t("compare")}
            </label>
            {compare && (
              <select
                value={compareType}
                onChange={(e) => setCompareType(e.target.value)}
                className={`filter-select filter-select--${theme} compare-type-select`}
              >
                <option value="previous_period">
                  {t("compare_previous_period")}
                </option>
                <option value="previous_week">
                  {t("compare_previous_week")}
                </option>
                <option value="previous_month">
                  {t("compare_previous_month")}
                </option>
                <option value="same_month_last_year">
                  {t("compare_same_month_last_year")}
                </option>
                <option value="previous_quarter">
                  {t("compare_previous_quarter")}
                </option>
                <option value="previous_year">
                  {t("compare_previous_year")}
                </option>
              </select>
            )}
          </div>

          {dateRange === "custom" && (
            <div className="custom-date-inputs">
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className={`date-input date-input--${theme}`}
              />
              <span className="date-separator">-</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className={`date-input date-input--${theme}`}
              />
            </div>
          )}
        </div>
      </header>

      <div className="analytics-controls">
        <div className="toggle-group">
          <div className="toggle-group__header">
            <label className="toggle-label">
              {t("metric")}
              <span className="toggle-label__desc">{t("metric_desc")}</span>
            </label>
          </div>
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${metricType === "revenue" ? "active" : ""}`}
              onClick={() => setMetricType("revenue")}
              title={t("revenue_desc")}
            >
              <DollarSign size={18} />
              <span>{t("revenue_label")}</span>
              <span className="toggle-btn__desc">{t("revenue_desc")}</span>
            </button>
            <button
              className={`toggle-btn ${metricType === "profit" ? "active" : ""}`}
              onClick={() => setMetricType("profit")}
              title={t("profit_desc")}
            >
              <TrendingUp size={18} />
              <span>{t("profit_label")}</span>
              <span className="toggle-btn__desc">{t("profit_desc")}</span>
            </button>
          </div>
        </div>

        <div className="toggle-group">
          <div className="toggle-group__header">
            <label className="toggle-label">
              {t("view")}
              <span className="toggle-label__desc">{t("view_desc")}</span>
            </label>
          </div>
          <div className="toggle-buttons">
            <button
              className={`toggle-btn ${viewType === "value" ? "active" : ""}`}
              onClick={() => setViewType("value")}
              title={t("value_kwd_desc")}
            >
              <Coins size={18} />
              <span>{t("value_kwd")}</span>
              <span className="toggle-btn__desc">{t("value_kwd_desc")}</span>
            </button>
            <button
              className={`toggle-btn ${viewType === "quantity" ? "active" : ""}`}
              onClick={() => setViewType("quantity")}
              title={t("quantity_items_desc")}
            >
              <Package size={18} />
              <span>{t("quantity_items")}</span>
              <span className="toggle-btn__desc">
                {t("quantity_items_desc")}
              </span>
            </button>
          </div>
        </div>
      </div>

      {loading && !data.kpi ? (
        <div className="loading-screen">Loading Analytics...</div>
      ) : (
        <>
          <section className="analytics-section">
            <KPIStats data={data.kpi} changes={data.changes} theme={theme} />
          </section>

          <section className="analytics-section">
            <TopItemsTable
              dateRange={{
                startDate: customStart || getStartDate(),
                endDate: customEnd || new Date().toISOString(),
              }}
              selectedBranches={selectedBranches}
              theme={theme}
              metricType={metricType}
            />
          </section>

          <section className="analytics-section analytics-grid">
            <div className="analytics-grid__main">
              <RevenueChart
                data={data.charts?.sales_trend}
                comparisonData={data.comparison?.charts?.sales_trend}
                theme={theme}
                metricType={metricType}
                viewType={viewType}
              />
            </div>
            <div className="analytics-grid__side">
              <CategoryChart
                data={data.charts?.category_distribution}
                comparisonData={data.comparison?.charts?.category_distribution}
                theme={theme}
                metricType={metricType}
                viewType={viewType}
              />
            </div>
          </section>

          <section className="analytics-section">
            <div className="analytics-row">
              <div className="analytics-row__item">
                <KaratChart
                  data={data.charts?.fabric_distribution}
                  comparisonData={data.comparison?.charts?.fabric_distribution}
                  theme={theme}
                  metricType={metricType}
                  viewType={viewType}
                />
              </div>
              <div className="analytics-row__item">
                <BranchChart
                  data={data.charts?.branch_performance}
                  comparisonData={data.comparison?.charts?.branch_performance}
                  theme={theme}
                  metricType={metricType}
                  viewType={viewType}
                />
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
