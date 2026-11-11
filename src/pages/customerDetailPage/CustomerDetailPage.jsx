import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";
import { useTheme } from "../../context/ThemeContext";
import useBranchStore from "../../store/branchStore";
import {
  useCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
} from "../../hooks/useCustomers";
import "./CustomerDetailPage.css";
import {
  User,
  ArrowLeft,
  MapPin,
  TrendingUp,
  ShoppingBag,
  Download,
  Phone,
  Edit,
  Trash2,
  X,
  Loader2,
  Sparkles,
  StickyNote,
} from "lucide-react";

const emptyForm = {
  full_name: "",
  phone: "",
  gender: "M",
  address: "",
  type: "Regular",
  notes: "",
};

const CustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const { data: customerData, isLoading: loading, refetch } = useCustomer(id);
  const updateCustomerMutation = useUpdateCustomer();
  const deleteCustomerMutation = useDeleteCustomer();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pdfLoadingId, setPdfLoadingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const { activeBranchId } = useBranchStore();

  useEffect(() => {
    if (customerData) {
      setData(customerData);
    } else {
      setData(null);
    }
  }, [customerData]);

  const fetchCustomerAnalytics = React.useCallback(async () => {
    if (!id) return;
    try {
      setAnalyticsLoading(true);
      const response = await api.get(`/customers/${id}/analytics`);
      if (response.data.success) {
        setAnalytics(response.data.data.analysis);
      }
    } catch { void 0; } finally {
      setAnalyticsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchCustomerAnalytics();
    }
  }, [id, fetchCustomerAnalytics]);

  useEffect(() => {
    if (!id || isNaN(parseInt(id))) {
      navigate("/customers");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (data?.customer) {
      setFormData({
        full_name: data.customer.full_name || "",
        phone: data.customer.phone || "",
        gender: data.customer.gender || "M",
        address: data.customer.address || "",
        type: data.customer.type || "Regular",
        notes: data.customer.notes || "",
      });
    }
  }, [data]);

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.full_name || formData.full_name.trim().length < 2) {
      return toast.error(
        t("name_required") || "Full name must be at least 2 characters",
      );
    }

    const phoneNorm = normalizeToLatinDigits(formData.phone || "").replace(
      /[^0-9+]/g,
      "",
    );
    if (!phoneNorm || phoneNorm.length < 8) {
      return toast.error(
        t("phone_required") || "Valid phone number is required",
      );
    }

    const payload = {
      full_name: formData.full_name.trim().substring(0, 255),
      phone: normalizeToLatinDigits(formData.phone || "").trim().substring(0, 50),
      gender: formData.gender || "M",
      type: formData.type || "Regular",
      address: formData.address ? formData.address.trim().substring(0, 500) : "",
      notes: formData.notes ? formData.notes.trim().substring(0, 2000) : "",
    };

    if (activeBranchId) payload.branch_id = activeBranchId;

    try {
      setIsSubmitting(true);
      await updateCustomerMutation.mutateAsync({ id, data: payload });
      refetch();
      setIsEditModalOpen(false);
    } catch { void 0; } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCustomerMutation.mutateAsync(id);
      navigate("/customers");
    } catch {
      setIsDeleteModalOpen(false);
    }
  };

  const handleDownloadInvoice = async (invoice) => {
    if (!invoice || !invoice.invoice_number) {
      toast.error(t("invalid_invoice") || "Invalid invoice");
      return;
    }
    if (!invoice.id) {
      toast.error(t("invalid_invoice") || "Invalid invoice");
      return;
    }
    setPdfLoadingId(invoice.id);
    try {
      const res = await api.get(`/sales/invoices/${invoice.id}/pdf`, {
        params: { disposition: "inline" },
        responseType: "blob",
      });
      const url = URL.createObjectURL(
        new Blob([res.data], { type: "application/pdf" }),
      );
      window.open(url, "_blank");

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        t("pdf_generation_failed") ||
        "Failed to generate PDF";
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const j = JSON.parse(text);
          toast.error(j.message || msg);
        } catch {
          toast.error(msg);
        }
      } else {
        toast.error(typeof msg === "string" ? msg : "Failed to generate PDF");
      }
    } finally {
      setPdfLoadingId(null);
    }
  };

  if (loading)
    return (
      <div
        className={`customer-details customer-details--${theme} customer-details--loading`}
      >
        <div className="customer-details__loader"></div>
        <span>{t("loading")}</span>
      </div>
    );

  if (!data || !data.customer) {
    return (
      <div
        className={`customer-details customer-details--${theme} customer-details--loading`}
      >
        <span>{t("customer_not_found")}</span>
      </div>
    );
  }

  const { customer, history = [], stats = {} } = data;

  const safeStats = {
    total_spent: stats.total_spent || "0.000",
    invoice_count: stats.invoice_count || 0,
    last_purchase: stats.last_purchase || null,
  };

  return (
    <div
      className={`customer-details customer-details--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <header className="customer-details__header">
        <button
          className="customer-details__back-btn"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft size={20} /> {t("back")}
        </button>
        <div className="customer-details__title-group">
          <h1 className="customer-details__name">{customer.full_name}</h1>
          <span
            className={`customer-details__badge customer-details__badge--${customer.type.toLowerCase()}`}
          >
            {customer.type}
          </span>
        </div>
        <div className="customer-details__actions">
          <button
            className="customer-details__action-btn customer-details__action-btn--edit"
            onClick={() => setIsEditModalOpen(true)}
            title={t("edit")}
          >
            <Edit size={18} /> {t("edit")}
          </button>
          <button
            className="customer-details__action-btn customer-details__action-btn--delete"
            onClick={handleDelete}
            title={t("delete")}
          >
            <Trash2 size={18} /> {t("delete")}
          </button>
        </div>
      </header>

      <div className="customer-details__grid">
        <aside className="customer-details__sidebar">
          <div className="customer-card customer-profile">
            <div className="customer-profile__avatar-wrapper">
              <div className="customer-profile__avatar">
                <User size={40} />
              </div>
            </div>

            <div className="customer-profile__content">
              <h3 className="customer-profile__civil-id">{customer.type}</h3>

              <div className="customer-profile__info-list">
                <div className="customer-profile__info-item">
                  <Phone size={14} className="customer-profile__icon" />
                  <span className="customer-profile__label">{t("phone")}:</span>
                  <span className="customer-profile__value">
                    {customer.phone}
                  </span>
                </div>
                <div className="customer-profile__info-item">
                  <User size={14} className="customer-profile__icon" />
                  <span className="customer-profile__label">
                    {t("gender")}:
                  </span>
                  <span className="customer-profile__value">
                    {customer.gender === "M" ? t("male") : t("female")}
                  </span>
                </div>
              </div>

              <div className="customer-profile__address">
                <MapPin size={16} className="customer-profile__address-icon" />
                <span>{customer.address || t("no_address")}</span>
              </div>
            </div>
          </div>

          <div className="customer-card customer-ids">
            <div className="customer-card__header">
              <StickyNote size={18} />
              <h3>{t("notes")}</h3>
            </div>
            <p className="customer-profile__value">
              {customer.notes || "-"}
            </p>
          </div>
        </aside>

        <main className="customer-details__content">
          <div className="customer-card customer-insights">
            <div className="customer-card__header">
              <TrendingUp size={20} />
              <h3>{t("ai_shopping_insights")}</h3>
            </div>

            <div className="customer-insights__stats">
              <div className="customer-insights__stat-box">
                <span className="customer-insights__label">
                  {t("total_spent")}
                </span>
                <span className="customer-insights__value">
                  {safeStats.total_spent} <small>{t("kwd")}</small>
                </span>
              </div>
              <div className="customer-insights__stat-box">
                <span className="customer-insights__label">
                  {t("transactions")}
                </span>
                <span className="customer-insights__value">
                  {safeStats.invoice_count}
                </span>
              </div>
              <div className="customer-insights__stat-box">
                <span className="customer-insights__label">
                  {t("last_visit")}
                </span>
                <span className="customer-insights__value">
                  {safeStats.last_purchase
                    ? new Date(safeStats.last_purchase).toLocaleDateString(
                        i18n.language === "ar" ? "ar-KW" : "en-US",
                      )
                    : t("never")}
                </span>
              </div>
            </div>

            <div className="customer-insights__prediction">
              <Sparkles
                size={20}
                className="customer-insights__prediction-icon"
              />
              <div className="customer-insights__prediction-text">
                <strong>{t("ai_analysis")}:</strong>
                {analyticsLoading ? (
                  <span> {t("loading")}...</span>
                ) : analytics ? (
                  <div className="customer-insights__analysis-details">
                    <div className="customer-insights__analysis-main">
                      {analytics.insights && analytics.insights.length > 0 ? (
                        analytics.insights.map((insight, idx) => (
                          <span
                            key={idx}
                            className="customer-insights__insight-tag"
                          >
                            {t(`ai_insight_${insight}`) || insight}
                          </span>
                        ))
                      ) : (
                        <span>{t("ai_new_customer")}</span>
                      )}
                    </div>
                    {analytics.preferences?.preferred_fabric_type && (
                      <div className="customer-insights__preference">
                        <span className="customer-insights__preference-label">
                          {t("preferred_fabric_type") || "Preferred fabric"}:
                        </span>
                        <span className="customer-insights__preference-value">
                          {analytics.preferences.preferred_fabric_type}
                        </span>
                      </div>
                    )}
                    {analytics.preferences?.preferred_pattern && (
                      <div className="customer-insights__preference">
                        <span className="customer-insights__preference-label">
                          {t("preferred_pattern") || "Preferred pattern"}:
                        </span>
                        <span className="customer-insights__preference-value">
                          {analytics.preferences.preferred_pattern}
                        </span>
                      </div>
                    )}
                    {analytics.behavior?.best_buying_day && (
                      <div className="customer-insights__preference">
                        <span className="customer-insights__preference-label">
                          {t("best_buying_day")}:
                        </span>
                        <span className="customer-insights__preference-value">
                          {t(
                            `day_${analytics.behavior.best_buying_day.toLowerCase()}`,
                          ) || analytics.behavior.best_buying_day}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <span>
                    {" "}
                    {parseInt(safeStats.invoice_count) > 2
                      ? t("ai_frequent_buyer")
                      : t("ai_new_customer")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="customer-card customer-history">
            <div className="customer-card__header">
              <ShoppingBag size={20} />
              <h3>{t("purchase_history")}</h3>
            </div>

            <div className="customer-history__wrapper">
              <table className="customer-history__table">
                <thead>
                  <tr>
                    <th>{t("date")}</th>
                    <th>{t("invoice_no")}</th>
                    <th>{t("items")}</th>
                    <th>{t("total")}</th>
                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {history && history.length > 0 ? (
                    history.map((inv) => (
                      <tr
                        key={inv.id}
                        onClick={() => handleDownloadInvoice(inv)}
                        className="customer-history__row"
                        title={t("click_download")}
                      >
                        <td>
                          {inv.createdAt
                            ? new Date(inv.createdAt).toLocaleDateString(
                                i18n.language === "ar" ? "ar-KW" : "en-US",
                              )
                            : "-"}
                        </td>
                        <td className="customer-history__invoice-id">
                          {inv.invoice_number || "-"}
                        </td>
                        <td>{inv.items?.length || 0}</td>
                        <td className="customer-history__amount">
                          {parseFloat(inv.total_amount || 0).toFixed(3)}{" "}
                          {t("kwd")}
                        </td>
                        <td>
                          <button
                            className="customer-history__download-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadInvoice(inv);
                            }}
                            disabled={pdfLoadingId === inv.id}
                          >
                            {pdfLoadingId === inv.id ? (
                              <Loader2 size={16} className="customers-spin" />
                            ) : (
                              <Download size={16} />
                            )}{" "}
                            {t("pdf")}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="customer-history__empty">
                        {t("no_purchases_yet")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {isEditModalOpen && (
        <div className="customers-modal-overlay">
          <div className={`customers-modal customers-modal--${theme}`}>
            <div className="customers-modal__header">
              <h3 className="customers-modal__title">{t("edit_customer")}</h3>
              <button
                className="customers-modal__close"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="customers-form">
              <input
                className="customers-form__input"
                placeholder={t("full_name")}
                required
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
              />

              <div className="customers-form__row">
                <input
                  className="customers-form__input"
                  placeholder={t("phone")}
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                <select
                  className="customers-form__input"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="M">{t("male")}</option>
                  <option value="F">{t("female")}</option>
                </select>
              </div>

              <input
                className="customers-form__input"
                placeholder={t("address")}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <select
                className="customers-form__input"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="Regular">{t("regular_customer", "Regular")}</option>
                <option value="VIP">VIP</option>
                <option value="Wholesaler">
                  {t("wholesaler_customer", "Wholesaler")}
                </option>
              </select>

              <textarea
                className="customers-form__input customers-form__input--textarea"
                placeholder={t("notes")}
                rows="2"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />

              <button
                type="submit"
                className="customers-page__btn customers-page__btn--submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("saving") || "Saving..." : t("save_customer")}
              </button>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="customers-modal-overlay">
          <div className={`customers-modal customers-modal--${theme}`}>
            <div className="customers-modal__header">
              <h3 className="customers-modal__title">
                {t("confirm") || "Confirm"}
              </h3>
              <button
                className="customers-modal__close"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="customers-modal__body">
              <p>{t("confirm_delete_customer")}</p>
              <div
                style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}
              >
                <button
                  className="customers-page__btn customers-page__btn--secondary"
                  onClick={() => setIsDeleteModalOpen(false)}
                  style={{ flex: 1 }}
                >
                  {t("cancel")}
                </button>
                <button
                  className="customers-page__btn customers-page__btn--danger"
                  onClick={confirmDelete}
                  style={{ flex: 1 }}
                >
                  {t("delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailsPage;
