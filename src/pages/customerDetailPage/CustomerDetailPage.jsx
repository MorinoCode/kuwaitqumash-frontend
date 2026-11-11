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
  CreditCard,
  Download,
  Calendar,
  Phone,
  Globe,
  Shield,
  Edit,
  Trash2,
  X,
  Loader2,
  Camera,
  Upload,
  Sparkles,
} from "lucide-react";

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
  const [isScanning, setIsScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idFiles, setIdFiles] = useState({ front: null, back: null });
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    civil_id: "",
    type: "Regular",
    notes: "",
    nationality: "Kuwaiti",
    gender: "M",
    address: "",
    birth_date: "",
    expiry_date: "",
  });
  const frontInputRef = React.useRef(null);
  const backInputRef = React.useRef(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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
        civil_id: data.customer.civil_id || "",
        type: data.customer.type || "Regular",
        notes: data.customer.notes || "",
        nationality: data.customer.nationality || "Kuwaiti",
        gender: data.customer.gender || "M",
        address: data.customer.address || "",
        birth_date: data.customer.birth_date || "",
        expiry_date: data.customer.expiry_date || "",
      });
    }
  }, [data]);

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    const cleanUrl = url.startsWith("/") ? url : `/${url}`;
    return `${API_BASE_URL}${cleanUrl}`;
  };

  const handleFileSelect = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(t("file_too_large") || "File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("invalid_file_type") || "Please select an image file");
      return;
    }

    setIdFiles((prev) => ({ ...prev, [side]: file }));
    await processOCR(file);
  };

  const processOCR = async (file) => {
    setIsScanning(true);
    const ocrFormData = new FormData();
    ocrFormData.append("image", file);

    try {
      const res = await api.post("/customers/scan", ocrFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          civil_id: data.civil_id || prev.civil_id,
          full_name: data.full_name || prev.full_name,
          nationality: data.nationality || prev.nationality,
          gender: data.gender ? (data.gender === "F" ? "F" : "M") : prev.gender,
          birth_date: data.birth_date || prev.birth_date,
          expiry_date: data.expiry_date || prev.expiry_date,
          address: data.address || prev.address,
          notes: prev.notes + (prev.notes ? "\n" : "") + "[AI Scanned]",
        }));
        toast.success(t("id_scanned_success"));
      }
    } catch {
      toast.error(t("scan_failed"));
    } finally {
      setIsScanning(false);
    }
  };

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

    const sanitizedData = {
      ...formData,
      full_name: formData.full_name.trim().substring(0, 255),
      phone: normalizeToLatinDigits(formData.phone || "")
        .trim()
        .substring(0, 50),
      civil_id: formData.civil_id
        ? normalizeToLatinDigits(formData.civil_id).trim().substring(0, 50)
        : "",
      nationality: formData.nationality
        ? formData.nationality.trim().substring(0, 100)
        : "",
      address: formData.address
        ? formData.address.trim().substring(0, 500)
        : "",
      notes: formData.notes ? formData.notes.trim().substring(0, 2000) : "",
    };

    try {
      setIsSubmitting(true);
      const payload = new FormData();
      Object.keys(sanitizedData).forEach((key) =>
        payload.append(key, sanitizedData[key]),
      );

      if (activeBranchId) payload.append("branch_id", activeBranchId);

      if (idFiles.front) payload.append("front_image", idFiles.front);
      if (idFiles.back) payload.append("back_image", idFiles.back);

      const dataObj = {};
      payload.forEach((value, key) => {
        if (key === "front_image" || key === "back_image") {
          dataObj[key] = value;
        } else {
          dataObj[key] = value;
        }
      });

      await updateCustomerMutation.mutateAsync({ id, data: dataObj });
      refetch();
      setIsEditModalOpen(false);
      setIdFiles({ front: null, back: null });
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
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
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
              <h3 className="customer-profile__civil-id">
                {customer.civil_id || t("no_civil_id")}
              </h3>

              <div className="customer-profile__info-list">
                <div className="customer-profile__info-item">
                  <Phone size={14} className="customer-profile__icon" />
                  <span className="customer-profile__label">{t("phone")}:</span>
                  <span className="customer-profile__value">
                    {customer.phone}
                  </span>
                </div>
                <div className="customer-profile__info-item">
                  <Globe size={14} className="customer-profile__icon" />
                  <span className="customer-profile__label">
                    {t("nationality")}:
                  </span>
                  <span className="customer-profile__value">
                    {customer.nationality}
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
                <div className="customer-profile__info-item">
                  <Calendar size={14} className="customer-profile__icon" />
                  <span className="customer-profile__label">{t("dob")}:</span>
                  <span className="customer-profile__value">
                    {customer.birth_date || "-"}
                  </span>
                </div>
                <div className="customer-profile__info-item">
                  <Shield size={14} className="customer-profile__icon" />
                  <span className="customer-profile__label">
                    {t("expiry")}:
                  </span>
                  <span className="customer-profile__value">
                    {customer.expiry_date || "-"}
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
              <CreditCard size={18} />
              <h3>{t("stored_id_cards")}</h3>
            </div>

            <div className="customer-ids__grid">
              <div className="customer-ids__item">
                <span className="customer-ids__label">{t("front_id")}</span>
                {customer.id_card_front_url ? (
                  <div className="customer-ids__image-container">
                    <img
                      src={getImageUrl(customer.id_card_front_url)}
                      alt="Front ID"
                      className="customer-ids__img"
                      loading="lazy"
                      onError={(e) => {
                        const placeholder =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXJyb3I8L3RleHQ+PC9zdmc+";
                        e.target.src = placeholder;
                      }}
                    />
                  </div>
                ) : (
                  <div className="customer-ids__placeholder">
                    {t("no_front_image")}
                  </div>
                )}
              </div>

              <div className="customer-ids__item">
                <span className="customer-ids__label">{t("back_id")}</span>
                {customer.id_card_back_url ? (
                  <div className="customer-ids__image-container">
                    <img
                      src={getImageUrl(customer.id_card_back_url)}
                      alt="Back ID"
                      className="customer-ids__img"
                      loading="lazy"
                      onError={(e) => {
                        const placeholder =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RXJyb3I8L3RleHQ+PC9zdmc+";
                        e.target.src = placeholder;
                      }}
                    />
                  </div>
                ) : (
                  <div className="customer-ids__placeholder">
                    {t("no_back_image")}
                  </div>
                )}
              </div>
            </div>
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
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIdFiles({ front: null, back: null });
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="customers-scan">
              <p className="customers-scan__label">{t("upload_civil_id")}</p>
              <div className="customers-scan__buttons">
                <input
                  type="file"
                  ref={frontInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "front")}
                />
                <button
                  type="button"
                  className={`customers-scan__btn ${
                    idFiles.front ? "customers-scan__btn--done" : ""
                  }`}
                  onClick={() => frontInputRef.current.click()}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Loader2 className="customers-spin" size={18} />
                  ) : (
                    <Camera size={18} />
                  )}
                  {idFiles.front ? t("front_uploaded") : t("scan_front")}
                </button>

                <input
                  type="file"
                  ref={backInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, "back")}
                />
                <button
                  type="button"
                  className={`customers-scan__btn ${
                    idFiles.back ? "customers-scan__btn--done" : ""
                  }`}
                  onClick={() => backInputRef.current.click()}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <Loader2 className="customers-spin" size={18} />
                  ) : (
                    <Upload size={18} />
                  )}
                  {idFiles.back ? t("back_uploaded") : t("scan_back")}
                </button>
              </div>
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
                <input
                  className="customers-form__input"
                  placeholder={t("civil_id")}
                  value={formData.civil_id}
                  onChange={(e) =>
                    setFormData({ ...formData, civil_id: e.target.value })
                  }
                />
              </div>

              <div className="customers-form__row">
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
                <input
                  className="customers-form__input"
                  placeholder={t("nationality")}
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData({ ...formData, nationality: e.target.value })
                  }
                />
              </div>

              <div className="customers-form__row">
                <input
                  className="customers-form__input"
                  placeholder={t("birth_date")}
                  value={formData.birth_date}
                  onChange={(e) =>
                    setFormData({ ...formData, birth_date: e.target.value })
                  }
                />
                <input
                  className="customers-form__input"
                  placeholder={t("expiry_date")}
                  value={formData.expiry_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expiry_date: e.target.value })
                  }
                />
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
                <option value="Regular">Regular</option>
                <option value="VIP">VIP</option>
                <option value="Wholesaler">Wholesaler</option>
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
                disabled={isScanning || isSubmitting}
              >
                {isSubmitting
                  ? t("saving") || "Saving..."
                  : isScanning
                    ? t("wait_ai")
                    : t("save_customer")}
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
