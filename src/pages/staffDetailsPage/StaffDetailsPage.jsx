import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import "./StaffDetailsPage.css";
import {
  User,
  ArrowLeft,
  Briefcase,
  Sparkles,
  Calendar,
  BadgeCheck,
} from "lucide-react";

//stafDetailsPage
const StaffDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/manage/staff/${id}`);
        setData(res.data.data);
        setLoading(false);
      } catch {
        toast.error(t("failed_load_staff") || "Failed to load staff details");
        navigate("/manage");
      }
    };
    fetchDetails();
  }, [id, navigate, t]);

  const fetchStaffAnalytics = React.useCallback(async () => {
    if (!id) return;
    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/manage/staff/${id}/analytics`);
      if (response.data.success) {
        setAnalytics(response.data.data.analysis);
      }
    } catch {
      // Silently ignore fetch errors
    } finally {
      setAnalyticsLoading(false);
    }
  }, [id]);

  // Fetch staff analytics
  useEffect(() => {
    if (id) {
      fetchStaffAnalytics();
    }
  }, [id, fetchStaffAnalytics]);

  if (loading)
    return (
      <div className={`staff-page staff-page--${theme} staff-page--loading`}>
        <div className="staff-page__loader"></div>
        <span>{t("loading_analysis")}</span>
      </div>
    );

  const { staff, history, stats } = data;

  return (
    <div className={`staff-page staff-page--${theme}`}>
      <header className="staff-page__header">
        <button
          className="staff-page__back-btn"
          onClick={() => navigate("/manage")}
        >
          <ArrowLeft size={20} /> {t("back_to_list")}
        </button>
        <div className="staff-page__title-group">
          <h1 className="staff-page__title">{staff.full_name}</h1>
          <span
            className={`staff-page__badge staff-page__badge--${staff.role}`}
          >
            {t(staff.role)}
          </span>
        </div>
      </header>

      <div className="staff-grid">
        <aside className="staff-sidebar">
          <div className="staff-card staff-info">
            <div className="staff-info__avatar-wrapper">
              <div className="staff-info__avatar">
                <User size={40} />
              </div>
            </div>
            <h3 className="staff-info__username">{staff.username}</h3>

            <div className="staff-info__details">
              <div className="staff-info__detail-item">
                <Briefcase size={16} className="staff-info__icon" />
                <span className="staff-info__value">
                  {staff.branch
                    ? staff.branch.name.replace(/^KuwaitQumash\s+/i, "")
                    : t("no_branch")}
                </span>
              </div>
              <div className="staff-info__detail-item">
                <Calendar size={16} className="staff-info__icon" />
                <span className="staff-info__value">
                  {t("joined")}:{" "}
                  {new Date(staff.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="staff-card staff-ai">
            <div className="staff-card__header">
              <Sparkles size={20} className="staff-ai__icon" />
              <h3>{t("ai_performance_analytics")}</h3>
            </div>

            <div className="staff-ai__stats">
              <div className="staff-ai__stat-row">
                <span className="staff-ai__label">
                  {t("total_sales_volume")}:
                </span>
                <span className="staff-ai__value staff-ai__value--gold">
                  {analytics?.behavior?.total_sales || stats.total_sales_volume}{" "}
                  <small>{t("kwd")}</small>
                </span>
              </div>
              <div className="staff-ai__stat-row">
                <span className="staff-ai__label">{t("total_invoices")}:</span>
                <span className="staff-ai__value">
                  {analytics?.behavior?.total_invoices || stats.total_invoices}
                </span>
              </div>
              {analytics?.behavior?.total_profit && (
                <div className="staff-ai__stat-row">
                  <span className="staff-ai__label">{t("total_profit")}:</span>
                  <span className="staff-ai__value staff-ai__value--green">
                    {analytics.behavior.total_profit} <small>{t("kwd")}</small>
                  </span>
                </div>
              )}
              {analytics?.behavior?.unique_customers && (
                <div className="staff-ai__stat-row">
                  <span className="staff-ai__label">
                    {t("unique_customers")}:
                  </span>
                  <span className="staff-ai__value">
                    {analytics.behavior.unique_customers}
                  </span>
                </div>
              )}
            </div>

            <div className="staff-ai__insight">
              <div className="staff-ai__insight-header">
                <Sparkles size={16} className="staff-ai__insight-icon" />{" "}
                {t("ai_analysis")}
              </div>
              {analyticsLoading ? (
                <p className="staff-ai__insight-text">{t("loading")}...</p>
              ) : analytics ? (
                <div className="staff-ai__insight-content">
                  <div className="staff-ai__insight-tags">
                    {analytics.insights && analytics.insights.length > 0 ? (
                      analytics.insights.map((insight, idx) => (
                        <span key={idx} className="staff-ai__insight-tag">
                          {t(`staff_insight_${insight}`) || insight}
                        </span>
                      ))
                    ) : (
                      <span className="staff-ai__insight-tag">
                        {t("new_staff")}
                      </span>
                    )}
                  </div>
                  {analytics.preferences?.preferred_fabric_type && (
                    <div className="staff-ai__preference">
                      <span className="staff-ai__preference-label">
                        {t("sells_mostly")}:
                      </span>
                      <span className="staff-ai__preference-value">
                        {analytics.preferences.preferred_fabric_type}
                      </span>
                    </div>
                  )}
                  {analytics.preferences?.preferred_category && (
                    <div className="staff-ai__preference">
                      <span className="staff-ai__preference-label">
                        {t("preferred_category")}:
                      </span>
                      <span className="staff-ai__preference-value">
                        {analytics.preferences.preferred_category}
                      </span>
                    </div>
                  )}
                  {analytics.behavior?.best_selling_day && (
                    <div className="staff-ai__preference">
                      <span className="staff-ai__preference-label">
                        {t("best_selling_day")}:
                      </span>
                      <span className="staff-ai__preference-value">
                        {t(
                          `day_${analytics.behavior.best_selling_day.toLowerCase()}`,
                        ) || analytics.behavior.best_selling_day}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="staff-ai__insight-text">{t("ai_insight_text")}</p>
              )}
            </div>
          </div>
        </aside>

        <main className="staff-content">
          <div className="staff-card staff-history">
            <h2 className="staff-card__title">{t("recent_sales_history")}</h2>
            <div className="staff-table-wrapper">
              <table className="staff-table">
                <thead className="staff-table__head">
                  <tr>
                    <th>{t("date")}</th>
                    <th>{t("invoice_no")}</th>
                    <th>{t("customer")}</th>
                    <th>{t("amount")}</th>
                  </tr>
                </thead>
                <tbody className="staff-table__body">
                  {history.map((inv) => (
                    <tr key={inv.id} className="staff-table__row">
                      <td>{new Date(inv.createdAt).toLocaleDateString()}</td>
                      <td className="staff-table__invoice">
                        {inv.invoice_number}
                      </td>
                      <td>
                        {inv.customer ? inv.customer.full_name : t("unknown")}
                      </td>
                      <td className="staff-table__amount">
                        {inv.total_amount} {t("kwd")}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan="4" className="staff-table__empty">
                        {t("no_sales_records")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffDetailsPage;
