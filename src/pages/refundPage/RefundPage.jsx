import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useTheme } from "../../context/ThemeContext";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { ArrowLeft, Search, RotateCcw, Download } from "lucide-react";
import "./RefundPage.css";

const PAYMENT_METHODS = ["Cash", "K-Net", "Visa/Master", "Link", "Cheque"];

const RefundPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const invoiceIdFromUrl = searchParams.get("invoice");
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();

  const [invoiceIdInput, setInvoiceIdInput] = useState(invoiceIdFromUrl || "");
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [payments, setPayments] = useState([{ method: "Cash", amount: "", reference_number: "" }]);
  const [notes, setNotes] = useState("");
  const [lastRefundId, setLastRefundId] = useState(null);
  const [lastCreditNoteNumber, setLastCreditNoteNumber] = useState(null);

  const loadInvoice = useCallback(async (idOverride) => {
    const id = (idOverride ?? invoiceIdInput).toString().trim();
    if (!id) {
      toast.error(t("invalid_invoice_id") || "Please enter invoice ID or number");
      return;
    }
    setLoading(true);
    setInvoiceData(null);
    setSelectedItems({});
    try {
      const res = await api.get(`/refunds/invoices/${encodeURIComponent(id)}/for-refund`);
      if (res.data?.success && res.data?.data) {
        setInvoiceData(res.data.data);
      } else {
        toast.error(t("invoice_not_found") || "Invoice not found");
      }
    } catch (err) {
      const apiMsg = err.response?.data?.message;
      const msg = apiMsg || (err.message && err.code !== "ERR_NETWORK" ? err.message : null) || t("failed_to_load_invoice") || "Failed to load invoice";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [invoiceIdInput, t]);

  useEffect(() => {
    if (invoiceIdFromUrl && invoiceIdFromUrl !== invoiceIdInput) {
      setInvoiceIdInput(invoiceIdFromUrl);
    }
  }, [invoiceIdFromUrl, invoiceIdInput]);

  useEffect(() => {
    if (invoiceIdFromUrl) {
      setInvoiceIdInput(invoiceIdFromUrl);
      loadInvoice(invoiceIdFromUrl);
    }
  }, [invoiceIdFromUrl, loadInvoice]);

  const setItemQty = (item, qty) => {
    const q = Math.max(0, Math.min(parseInt(qty, 10) || 0, item.quantity_available));
    setSelectedItems((prev) => {
      const next = { ...prev };
      if (q < 1) {
        delete next[item.id];
      } else {
        const amountPerUnit = parseFloat(item.total_price) / item.quantity;
        next[item.id] = {
          invoice_item_id: item.id,
          quantity_refunded: q,
          amount_refunded: amountPerUnit * q,
        };
      }
      return next;
    });
  };

  const totalRefundAmount = Object.values(selectedItems).reduce((s, i) => s + (i?.amount_refunded || 0), 0);
  const paymentsTotal = payments.reduce((s, p) => s + (parseFloat(p.amount) || 0), 0);

  const addPayment = () => {
    setPayments((prev) => [...prev, { method: "Cash", amount: "", reference_number: "" }]);
  };

  const updatePayment = (idx, field, value) => {
    setPayments((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const removePayment = (idx) => {
    if (payments.length <= 1) return;
    setPayments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = Object.values(selectedItems).filter((i) => i && i.quantity_refunded > 0);
    if (items.length === 0) {
      toast.error(t("select_at_least_one_item") || "Please select at least one item to refund");
      return;
    }
    const validPayments = payments
      .map((p) => ({ ...p, amount: parseFloat(p.amount) || 0 }))
      .filter((p) => p.amount > 0);
    if (validPayments.length === 0) {
      toast.error(t("add_payment_method") || "Please add at least one payment method");
      return;
    }
    if (Math.abs(paymentsTotal - totalRefundAmount) > 0.01) {
      toast.error(t("payments_must_match_refund") || "Payments total must match refund amount");
      return;
    }

    setLoadingRefund(true);
    try {
      const res = await api.post("/refunds", {
        invoice_id: parseInt(invoiceData.invoice.id, 10),
        items,
        payments: validPayments.map((p) => ({
          method: p.method,
          amount: parseFloat(p.amount),
          reference_number: p.reference_number || null,
        })),
        notes: notes.trim() || null,
      });
      const refundId = res.data?.data?.id;
      const creditNoteNumber = res.data?.data?.credit_note_number;
      toast.success(t("refund_completed") || "Refund completed successfully");
      if (refundId) {
        setLastRefundId(refundId);
        setLastCreditNoteNumber(creditNoteNumber);
      }
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setInvoiceData(null);
      setSelectedItems({});
      setPayments([{ method: "Cash", amount: "", reference_number: "" }]);
      setNotes("");
    } catch (err) {
      const msg = err.response?.data?.message || t("refund_failed") || "Refund failed";
      toast.error(msg);
    } finally {
      setLoadingRefund(false);
    }
  };

  return (
    <div className={`refund-page refund-page--${theme}`} dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}>
      <header className="refund-page__header">
        <h1 className="refund-page__title">{t("refund") || "Refund"}</h1>
      </header>

      {lastRefundId && (
        <div className="refund-page__credit-note-card">
          <p>{t("refund_completed") || "Refund completed"} • {lastCreditNoteNumber || `#${lastRefundId}`}</p>
          <button
            type="button"
            className="refund-page__btn refund-page__btn--primary"
            onClick={async () => {
              try {
                const res = await api.get(`/refunds/${lastRefundId}/pdf`, { responseType: "blob" });
                const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
                window.open(url, "_blank");
              } catch {
                toast.error(t("failed_to_download_pdf") || "Failed to download PDF");
              }
            }}
          >
            <Download size={18} />
            {t("download_credit_note") || "Download Credit Note PDF"}
          </button>
          <button
            type="button"
            className="refund-page__btn refund-page__btn--ghost"
            onClick={() => { setLastRefundId(null); setLastCreditNoteNumber(null); }}
          >
            {t("load_another") || "Load another"}
          </button>
          <button
            type="button"
            className="refund-page__btn refund-page__btn--ghost"
            onClick={() => navigate("/refunds")}
          >
            {t("refunds") || "View Refunds"}
          </button>
        </div>
      )}
      {!invoiceData ? (
        <div className="refund-page__load-section">
          <div className="refund-page__load-card">
            <label className="refund-page__label">{t("invoice_id") || "Invoice ID"}</label>
            <div className="refund-page__load-row">
              <input
                type="text"
                className="refund-page__input"
                value={invoiceIdInput}
                onChange={(e) => setInvoiceIdInput(e.target.value)}
                placeholder={t("invoice_id_placeholder") || "e.g. 123 or INV-2024-001"}
                onKeyDown={(e) => e.key === "Enter" && loadInvoice()}
              />
              <button
                type="button"
                className="refund-page__btn refund-page__btn--primary"
                onClick={() => loadInvoice(invoiceIdInput)}
                disabled={loading}
              >
                {loading ? (
                  <span className="refund-page__spinner" />
                ) : (
                  <>
                    <Search size={18} />
                    {t("load") || "Load"}
                  </>
                )}
              </button>
            </div>
            <p className="refund-page__hint">
              {t("refund_hint") || "Enter the invoice ID to load items for refund. You can find the ID from the Invoices page."}
            </p>
          </div>
        </div>
      ) : (
        <form className="refund-page__form" onSubmit={handleSubmit}>
          <div className="refund-page__invoice-info">
            <h2 className="refund-page__invoice-title">
              {t("invoice_number")}: {invoiceData.invoice.invoice_number}
            </h2>
            <p className="refund-page__invoice-meta">
              {invoiceData.invoice.customer?.full_name} • {invoiceData.invoice.branch?.name}
            </p>
            <button
              type="button"
              className="refund-page__back-link"
              onClick={() => {
                setInvoiceData(null);
                setSelectedItems({});
              }}
            >
              <ArrowLeft size={16} />
              {t("load_another") || "Load another invoice"}
            </button>
          </div>

          <div className="refund-page__items-section">
            <h3 className="refund-page__section-title">{t("select_items_to_refund") || "Select items to refund"}</h3>
            <div className="refund-page__items-list">
              {invoiceData.items.map((item) => {
                if (item.quantity_available < 1) return null;
                const sel = selectedItems[item.id];
                const qty = sel?.quantity_refunded || 0;
                return (
                  <div key={item.id} className="refund-page__item-row">
                    <div className="refund-page__item-info">
                      <span className="refund-page__item-name">{item.item_name}</span>
                      <span className="refund-page__item-meta">
                        {item.meters ? `${item.meters} m` : ""} {item.fabric_type ? `• ${item.fabric_type}` : ""} • {item.quantity_available} {t("available")}
                      </span>
                    </div>
                    <div className="refund-page__item-actions">
                      <input
                        type="number"
                        min={0}
                        max={item.quantity_available}
                        value={qty}
                        onChange={(e) => setItemQty(item, e.target.value)}
                        className="refund-page__qty-input"
                      />
                      <span className="refund-page__item-amount">
                        {(qty > 0 ? (parseFloat(item.total_price) / item.quantity) * qty : 0).toFixed(3)} {t("kwd")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {invoiceData.items.filter((i) => i.quantity_available > 0).length === 0 && (
              <p className="refund-page__empty">{t("no_items_to_refund") || "No items available to refund"}</p>
            )}
          </div>

          <div className="refund-page__total-row">
            <span>{t("refund_total") || "Refund Total"}:</span>
            <strong>{totalRefundAmount.toFixed(3)} {t("kwd")}</strong>
          </div>

          <div className="refund-page__payments-section">
            <h3 className="refund-page__section-title">{t("refund_payment") || "Refund payment method"}</h3>
            {payments.map((p, idx) => (
              <div key={idx} className="refund-page__payment-row">
                <select
                  value={p.method}
                  onChange={(e) => updatePayment(idx, "method", e.target.value)}
                  className="refund-page__select"
                >
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <input
                  type="number"
                  step="0.001"
                  min="0"
                  placeholder={t("amount") || "Amount"}
                  value={p.amount}
                  onChange={(e) => updatePayment(idx, "amount", e.target.value)}
                  className="refund-page__input refund-page__input--amount"
                />
                <input
                  type="text"
                  placeholder={t("ref_number_placeholder") || "e.g. transaction ID, check #"}
                  title={t("ref_number_hint") || "Optional: K-Net/Check/Link transaction reference"}
                  value={p.reference_number || ""}
                  onChange={(e) => updatePayment(idx, "reference_number", e.target.value)}
                  className="refund-page__input refund-page__input--ref"
                />
                {payments.length > 1 && (
                  <button type="button" className="refund-page__btn refund-page__btn--ghost" onClick={() => removePayment(idx)}>
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="refund-page__add-payment" onClick={addPayment}>
              + {t("add_payment") || "Add payment"}
            </button>
          </div>

          <div className="refund-page__notes">
            <label>{t("notes") || "Notes"}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="refund-page__textarea"
              rows={2}
              placeholder={t("refund_notes_placeholder") || "Optional notes for this refund"}
            />
          </div>

          <button
            type="submit"
            className="refund-page__btn refund-page__btn--submit"
            disabled={Object.keys(selectedItems).length === 0 || loadingRefund || Math.abs(paymentsTotal - totalRefundAmount) > 0.01}
          >
            {loadingRefund ? (
              <span className="refund-page__spinner" />
            ) : (
              <>
                <RotateCcw size={18} />
                {t("process_refund") || "Process Refund"}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default RefundPage;
