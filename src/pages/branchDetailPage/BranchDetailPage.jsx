import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api, { apiBaseURL } from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  useBranch,
  useBranches,
  useUpdateBranch,
} from "../../hooks/useBranches";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../config/queryClient";
import useTenantStore from "../../store/tenantStore";
import {
  ArrowLeft,
  Building,
  MapPin,
  Phone,
  Edit2,
  Save,
  X,
  MessageCircle,
  Send,
  Loader2,
  QrCode,
  FileText,
  Image,
} from "lucide-react";
import LogoUpload from "../../components/branch/LogoUpload";
import "./BranchDetailPage.css";

const TAB_INFO = "info";
const TAB_RECEIVE = "receive";
const TAB_CONNECT = "connect";
const TAB_BULK = "bulk";
const TAB_LOGO = "logo";

export default function BranchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const queryClient = useQueryClient();
  const {
    data: branch,
    isLoading: loading,
    refetch: refetchBranch,
  } = useBranch(id);
  const { data: branches = [] } = useBranches();
  const updateBranchMutation = useUpdateBranch();

  const [activeTab, setActiveTab] = useState(TAB_INFO);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    phone: "",
    whatsapp_invoice_enabled: false,
    whatsapp_invoice_to_store_enabled: false,
    whatsapp_invoice_to_store_phone: "",
  });
  const [saving, setSaving] = useState(false);

  const [waStatus, setWaStatus] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const connectPollRef = useRef(null);
  const connectSucceededRef = useRef(false);

  const [bulkSegment, setBulkSegment] = useState("all");
  const [bulkBranchId, setBulkBranchId] = useState(id || "");
  const [bulkMessage, setBulkMessage] = useState("");
  const [bulkDelay, setBulkDelay] = useState(3000);
  const [bulkSending, setBulkSending] = useState(false);

  const isOwner = user?.role === "store_owner";
  const isManager = user?.role === "branch_manager";
  const ownBranch =
    user?.branch_id != null && String(user.branch_id) === String(id);
  const canEdit =
    isOwner || ((isManager || user?.role === "sales_man") && ownBranch);
  const canEditSendToCustomer = isOwner || (isManager && ownBranch);
  const canManageLogo = isOwner || (isManager && ownBranch);

  useEffect(() => {
    if (branch) {
      setForm({
        name: branch.name || "",
        location: branch.location || "",
        phone: branch.phone || "",
        whatsapp_invoice_enabled: !!branch.whatsapp_invoice_enabled,
        whatsapp_invoice_to_store_enabled:
          !!branch.whatsapp_invoice_to_store_enabled,
        whatsapp_invoice_to_store_phone:
          branch.whatsapp_invoice_to_store_phone || "",
      });
    }
  }, [branch]);

  const fetchWaStatus = useCallback(async () => {
    try {
      const res = await api.get(`/whatsapp/status?branch_id=${id}`);
      setWaStatus(res.data.data || {});
    } catch {
      setWaStatus({ status: "NOT_CONFIGURED" });
    }
  }, [id]);

  useEffect(() => {
    if (isOwner) fetchWaStatus();

    return () => {
      if (connectPollRef.current) {
        clearInterval(connectPollRef.current);
        connectPollRef.current = null;
      }
    };
  }, [isOwner, fetchWaStatus]);

  useEffect(() => {
    if (isOwner && activeTab === TAB_CONNECT) fetchWaStatus();
  }, [isOwner, activeTab, fetchWaStatus]);

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateBranchMutation.mutateAsync({
        id,
        data: {
          name: form.name.trim(),
          location: form.location.trim(),
          phone: form.phone.trim() || "",
          whatsapp_invoice_enabled: form.whatsapp_invoice_enabled,
        },
      });
      setEditing(false);
      refetchBranch();
    } catch { void 0; } finally {
      setSaving(false);
    }
  };

  const handleSaveReceive = async () => {
    setSaving(true);
    try {
      await updateBranchMutation.mutateAsync({
        id,
        data: {
          whatsapp_invoice_to_store_enabled:
            form.whatsapp_invoice_to_store_enabled,
          whatsapp_invoice_to_store_phone:
            form.whatsapp_invoice_to_store_phone.trim() || null,
        },
      });
      refetchBranch();
    } catch { void 0; } finally {
      setSaving(false);
    }
  };

  const handleConnectWa = async () => {

    if (connectPollRef.current) {
      clearInterval(connectPollRef.current);
      connectPollRef.current = null;
    }

    connectSucceededRef.current = false;
    setConnecting(true);
    setQrDataUrl(null);
    const tenantId = useTenantStore.getState().tenantId;
    const token = localStorage.getItem("token");
    const headers = {
      "x-tenant-id": tenantId || "",
      Accept: "text/event-stream",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const abort = new AbortController();
    const timeoutId = setTimeout(() => {
      abort.abort();
    }, 90_000);

    fetch(`${apiBaseURL}/whatsapp/connect?branch_id=${id}`, {
      method: "GET",
      credentials: "include",
      headers,
      signal: abort.signal,
    })
      .then(async (r) => {
        if (!r.ok) {
          let errorMsg = "Connect failed";
          try {
            const errorData = await r.json();
            errorMsg = errorData.message || errorData.error || errorMsg;
          } catch {
            errorMsg =
              r.status === 401
                ? "Unauthorized"
                : `Connect failed (${r.status})`;
          }
          throw new Error(errorMsg);
        }
        return r.body.getReader();
      })
      .then((reader) => {
        const decoder = new TextDecoder();
        let buf = "";

        const clearPoll = () => {
          if (connectPollRef.current) {
            clearInterval(connectPollRef.current);
            connectPollRef.current = null;
          }
        };

        const stop = () => {
          clearTimeout(timeoutId);
          clearPoll();
          setConnecting(false);
          fetchWaStatus();
        };

        connectPollRef.current = setInterval(async () => {
          try {
            const res = await api.get(`/whatsapp/status?branch_id=${id}`);
            const data = res.data?.data || {};
            if (data.status === "CONNECTED" || data.is_ready) {
              if (connectSucceededRef.current) return;
              connectSucceededRef.current = true;
              clearPoll();
              clearTimeout(timeoutId);
              setConnecting(false);
              setQrDataUrl(null);
              setWaStatus(data);
              toast.success(t("connected") || "Connected");
            }
          } catch { void 0; }
        }, 2000);

        const read = () => {
          reader
            .read()
            .then(({ done, value }) => {
              if (done) {
                stop();
                return;
              }
              buf += decoder.decode(value, { stream: true });
              const parts = buf.split("\n\n");
              buf = parts.pop() || "";
              for (const block of parts) {
                const line = block
                  .split("\n")
                  .find((l) => l.startsWith("data: "));
                if (!line) continue;
                try {
                  const ev = JSON.parse(line.slice(6).trim());
                  if (ev.type === "qr") setQrDataUrl(ev.data || "");
                  if (ev.type === "restarting") {
                    setQrDataUrl(null);
                    toast.info(
                      ev.data || t("linking_device") || "Linking device…",
                    );
                  }
                  if (ev.type === "connected") {
                    if (connectSucceededRef.current) return;
                    connectSucceededRef.current = true;
                    setQrDataUrl(null);
                    clearTimeout(timeoutId);
                    clearPoll();
                    setConnecting(false);
                    setWaStatus({
                      status: "CONNECTED",
                      is_ready: true,
                      phone_connected: ev.data?.phone || "",
                    });
                    toast.success(t("connected") || "Connected");
                    return;
                  }
                  if (ev.type === "error") {
                    clearTimeout(timeoutId);
                    clearPoll();
                    toast.error(ev.data || "Error");
                    setConnecting(false);
                    fetchWaStatus();
                    return;
                  }
                  if (ev.type === "closed") {
                    clearTimeout(timeoutId);
                    clearPoll();
                    toast.warning(
                      ev.data ||
                        t("connection_closed") ||
                        "Connection closed. Try again.",
                    );
                    setConnecting(false);
                    fetchWaStatus();
                    return;
                  }
                } catch { void 0; }
              }
              read();
            })
            .catch((e) => {
              clearTimeout(timeoutId);
              clearPoll();
              if (e?.name === "AbortError") {
                toast.warning(
                  t("connect_timeout") || "Taking too long. Try again.",
                );
              } else {
                toast.error(t("connect_stream_error") || "Connection lost.");
              }
              setConnecting(false);
              fetchWaStatus();
            });
        };
        read();
      })
      .catch((e) => {
        clearTimeout(timeoutId);
        if (connectPollRef.current) {
          clearInterval(connectPollRef.current);
          connectPollRef.current = null;
        }
        if (e?.name === "AbortError") {
          toast.warning(t("connect_timeout") || "Taking too long. Try again.");
        } else {
          const errorMsg =
            e?.message ||
            t("connect_failed") ||
            "Could not start WhatsApp connect.";
          toast.error(errorMsg);
        }
        setConnecting(false);
      });

  };

  const handleDisconnectWa = async () => {
    try {
      await api.post(`/whatsapp/disconnect?branch_id=${id}`);
      setWaStatus({ status: "DISCONNECTED" });
      setQrDataUrl(null);
      toast.success(t("disconnected") || "Disconnected");
    } catch (e) {
      toast.error(e.response?.data?.message || "Disconnect failed");
    }
  };

  const handleBulkSend = async (e) => {
    e.preventDefault();
    if (!bulkMessage.trim()) {
      toast.error(t("message_required") || "Message is required");
      return;
    }
    setBulkSending(true);
    try {
      const payload = {
        segment: bulkSegment,
        message: bulkMessage.trim(),
        delay_ms: Math.max(
          500,
          Math.min(60000, parseInt(bulkDelay, 10) || 3000),
        ),
      };

      const branchIdToUse = bulkBranchId
        ? parseInt(bulkBranchId, 10)
        : id
          ? parseInt(id, 10)
          : null;
      if (branchIdToUse) {
        payload.branch_id = branchIdToUse;
      }
      const res = await api.post("/whatsapp/bulk", payload);
      toast.success(
        t("bulk_sent") || `Sent to ${res.data.sent}/${res.data.total}`,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Bulk send failed");
    } finally {
      setBulkSending(false);
    }
  };

  if (loading) {
    return (
      <div
        className={`branch-detail branch-detail--${theme} branch-detail--loading`}
      >
        <div className="branch-detail__loader" />
        <span>{t("loading_analysis")}</span>
      </div>
    );
  }

  if (!branch) return null;

  const isConnected = waStatus?.status === "CONNECTED" || !!waStatus?.is_ready;
  const receiveActive =
    !!branch.whatsapp_invoice_to_store_enabled &&
    !!(branch.whatsapp_invoice_to_store_phone || "").trim();

  return (
    <div
      className={`branch-detail branch-detail--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <header className="branch-detail__header">
        <button
          type="button"
          className="branch-detail__back"
          onClick={() => navigate("/manage")}
        >
          <ArrowLeft size={20} /> {t("back_to_list")}
        </button>
        <div className="branch-detail__title-row">
          <h1 className="branch-detail__title">
            <Building size={24} /> {branch.name}
          </h1>
          {branch.is_main && (
            <span className="branch-detail__badge branch-detail__badge--hq">
              {t("hq")}
            </span>
          )}
        </div>
      </header>

      <div className="branch-detail__tabs">
        <button
          type="button"
          className={`branch-detail__tab ${activeTab === TAB_INFO ? "branch-detail__tab--active" : ""}`}
          onClick={() => setActiveTab(TAB_INFO)}
        >
          <Building size={18} /> {t("branch_details") || "Branch details"}
        </button>
        {isOwner && (
          <>
            <button
              type="button"
              className={`branch-detail__tab ${activeTab === TAB_RECEIVE ? "branch-detail__tab--active" : ""}`}
              onClick={() => setActiveTab(TAB_RECEIVE)}
            >
              <FileText size={18} />{" "}
              {t("receive_invoice") || "Receive invoices"}
            </button>
            <button
              type="button"
              className={`branch-detail__tab ${activeTab === TAB_CONNECT ? "branch-detail__tab--active" : ""}`}
              onClick={() => setActiveTab(TAB_CONNECT)}
            >
              <QrCode size={18} /> {t("whatsapp_connect") || "Connect WhatsApp"}
            </button>
            <button
              type="button"
              className={`branch-detail__tab ${activeTab === TAB_BULK ? "branch-detail__tab--active" : ""}`}
              onClick={() => setActiveTab(TAB_BULK)}
            >
              <MessageCircle size={18} />{" "}
              {t("bulk_messages") || "Bulk messages"}
            </button>
            <button
              type="button"
              className={`branch-detail__tab ${activeTab === TAB_LOGO ? "branch-detail__tab--active" : ""}`}
              onClick={() => setActiveTab(TAB_LOGO)}
            >
              <Image size={18} /> {t("logo") || "Logo"}
            </button>
          </>
        )}
      </div>

      <div className="branch-detail__grid">
        {activeTab === TAB_INFO && (
          <section className="branch-detail__card">
            <h2 className="branch-detail__card-title">
              {t("branch_details") || "Branch details"}
            </h2>
            {!editing ? (
              <>
                <div className="branch-detail__info">
                  <p>
                    <MapPin size={16} /> {branch.location || "-"}
                  </p>
                  <p>
                    <Phone size={16} /> {branch.phone || "-"}
                  </p>
                </div>
                {canEdit && (
                  <button
                    type="button"
                    className="branch-detail__btn branch-detail__btn--edit"
                    onClick={() => setEditing(true)}
                  >
                    <Edit2 size={16} /> {t("edit")}
                  </button>
                )}
                {canEditSendToCustomer && (
                  <div className="branch-detail__store-toggle">
                    <h3 className="branch-detail__store-toggle-title">
                      {t("send_invoice_to_customer_title") ||
                        "Send invoice to customer via WhatsApp"}
                    </h3>
                    <p className="branch-detail__hint branch-detail__hint--sm">
                      {t("send_invoice_to_customer_hint") ||
                        "When enabled, staff can send invoice PDF to customers via WhatsApp from Sales and Invoices. Only store owner and branch manager can change this."}
                    </p>
                    <label className="branch-detail__toggle">
                      <input
                        type="checkbox"
                        checked={form.whatsapp_invoice_enabled}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            whatsapp_invoice_enabled: e.target.checked,
                          }))
                        }
                      />
                      <span>{t("send_invoice_whatsapp")}</span>
                    </label>
                    <button
                      type="button"
                      className="branch-detail__btn branch-detail__btn--primary"
                      disabled={saving}
                      onClick={async () => {
                        setSaving(true);
                        try {
                          await updateBranchMutation.mutateAsync({
                            id,
                            data: {
                              whatsapp_invoice_enabled:
                                form.whatsapp_invoice_enabled,
                            },
                          });
                          refetchBranch();
                        } catch { void 0; } finally {
                          setSaving(false);
                        }
                      }}
                    >
                      {saving ? (
                        <Loader2 size={16} className="spin" />
                      ) : (
                        <Save size={16} />
                      )}{" "}
                      {t("save")}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={handleSaveInfo} className="branch-detail__form">
                <input
                  className="branch-detail__input"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder={t("branch_name")}
                  required
                />
                <input
                  className="branch-detail__input"
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  placeholder={t("location")}
                />
                <input
                  className="branch-detail__input"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  placeholder={t("phone")}
                />
                <div className="branch-detail__form-actions">
                  <button
                    type="button"
                    className="branch-detail__btn branch-detail__btn--secondary"
                    onClick={() => {
                      setEditing(false);
                      if (branch) {
                        setForm({
                          name: branch.name,
                          location: branch.location,
                          phone: branch.phone,
                          whatsapp_invoice_enabled:
                            !!branch.whatsapp_invoice_enabled,
                          whatsapp_invoice_to_store_enabled:
                            !!branch.whatsapp_invoice_to_store_enabled,
                          whatsapp_invoice_to_store_phone:
                            branch.whatsapp_invoice_to_store_phone || "",
                        });
                      }
                    }}
                  >
                    <X size={16} /> {t("cancel")}
                  </button>
                  <button
                    type="submit"
                    className="branch-detail__btn branch-detail__btn--primary"
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <Save size={16} />
                    )}{" "}
                    {t("save")}
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {isOwner && activeTab === TAB_RECEIVE && (
          <section className="branch-detail__card">
            <h2 className="branch-detail__card-title">
              {t("receive_invoice") || "Receive invoices via WhatsApp"}
            </h2>
            <p className="branch-detail__hint">
              {t("receive_invoice_hint") ||
                "Enter the number where you want to receive invoice PDFs when a sale is made in this branch. Activate to enable."}
            </p>
            <div className="branch-detail__form">
              <label>{t("phone")}</label>
              <input
                type="tel"
                className="branch-detail__input"
                placeholder={t("phone_placeholder") || "e.g. 96512345678"}
                value={form.whatsapp_invoice_to_store_phone}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    whatsapp_invoice_to_store_phone: e.target.value,
                  }))
                }
              />
              <label className="branch-detail__toggle">
                <input
                  type="checkbox"
                  checked={form.whatsapp_invoice_to_store_enabled}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      whatsapp_invoice_to_store_enabled: e.target.checked,
                    }))
                  }
                />
                <span>
                  {t("activate_receive_invoice") ||
                    "Activate receiving invoices for this branch"}
                </span>
              </label>
              <div className="branch-detail__form-actions">
                <button
                  type="button"
                  className="branch-detail__btn branch-detail__btn--secondary"
                  disabled={saving || !receiveActive}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await updateBranchMutation.mutateAsync({
                        id,
                        data: {
                          whatsapp_invoice_to_store_enabled: false,
                          whatsapp_invoice_to_store_phone:
                            form.whatsapp_invoice_to_store_phone || null,
                        },
                      });
                      setForm((f) => ({
                        ...f,
                        whatsapp_invoice_to_store_enabled: false,
                      }));
                      refetchBranch();
                    } catch { void 0; } finally {
                      setSaving(false);
                    }
                  }}
                >
                  {t("deactivate") || "Deactivate"}
                </button>
                <button
                  type="button"
                  className="branch-detail__btn branch-detail__btn--primary"
                  onClick={handleSaveReceive}
                  disabled={
                    saving ||
                    (form.whatsapp_invoice_to_store_enabled &&
                      !(form.whatsapp_invoice_to_store_phone || "").trim())
                  }
                >
                  {saving ? (
                    <Loader2 size={16} className="spin" />
                  ) : (
                    <Save size={16} />
                  )}{" "}
                  {receiveActive
                    ? t("change_number") || "Change number"
                    : t("save")}
                </button>
              </div>
            </div>
          </section>
        )}

        {isOwner && activeTab === TAB_CONNECT && (
          <section className="branch-detail__card">
            <h2 className="branch-detail__card-title">
              {t("whatsapp_connect") || "Connect WhatsApp"}
            </h2>
            <p className="branch-detail__hint">
              {t("connect_wa_hint") ||
                "Scan QR with your phone to connect. Disconnect to use another number."}
            </p>
            <div className="branch-detail__wa-connect">
              <p className="branch-detail__status">
                {t("status")}:{" "}
                <span
                  className={
                    isConnected
                      ? "branch-detail__status--ok"
                      : "branch-detail__status--off"
                  }
                >
                  {isConnected
                    ? t("connected") +
                      (waStatus?.phone_connected
                        ? ` (${waStatus.phone_connected})`
                        : "")
                    : t("disconnected") || "Disconnected"}
                </span>
              </p>
              {isConnected ? (
                <button
                  type="button"
                  className="branch-detail__btn branch-detail__btn--danger"
                  onClick={handleDisconnectWa}
                >
                  {t("disconnect_change_number") ||
                    "Disconnect / Change number"}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="branch-detail__btn branch-detail__btn--primary"
                    onClick={handleConnectWa}
                    disabled={connecting}
                  >
                    {connecting ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <QrCode size={16} />
                    )}{" "}
                    {connecting
                      ? t("connecting") || "Connecting..."
                      : t("connect") || "Connect"}
                  </button>
                  {connecting && !qrDataUrl && (
                    <p className="branch-detail__hint branch-detail__hint--sm">
                      {t("waiting_qr") || "Waiting for QR..."}
                    </p>
                  )}
                  {qrDataUrl && (
                    <div className="branch-detail__qr-wrap">
                      <p>{t("scan_qr")}</p>
                      <img
                        src={qrDataUrl}
                        alt="QR"
                        className="branch-detail__qr"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        )}

        {isOwner && activeTab === TAB_BULK && (
          <section className="branch-detail__card branch-detail__card--bulk">
            <h2 className="branch-detail__card-title">{t("bulk_messages")}</h2>
            <p className="branch-detail__hint">
              {t("bulk_hint") ||
                "Select a segment, optional branch filter, write your message, and set delay between sends to avoid blocks."}
            </p>
            <form onSubmit={handleBulkSend} className="branch-detail__bulk">
              <div className="branch-detail__bulk-row">
                <div className="branch-detail__bulk-field">
                  <label>{t("segment")}</label>
                  <select
                    className="branch-detail__input"
                    value={bulkSegment}
                    onChange={(e) => setBulkSegment(e.target.value)}
                  >
                    <option value="all">{t("all_customers")}</option>
                    <option value="high_value_6m">{t("high_value_6m")}</option>
                    <option value="inactive_6m">{t("inactive_6m")}</option>
                    <option value="last_30d">
                      {t("last_30d") || "Purchased in last 30 days"}
                    </option>
                    <option value="last_90d">
                      {t("last_90d") || "Purchased in last 90 days"}
                    </option>
                    <option value="vip_only">
                      {t("vip_only") || "VIP customers only"}
                    </option>
                  </select>
                </div>
                <div className="branch-detail__bulk-field">
                  <label>
                    {t("branch")} ({t("optional")})
                  </label>
                  <select
                    className="branch-detail__input"
                    value={bulkBranchId}
                    onChange={(e) => setBulkBranchId(e.target.value)}
                  >
                    <option value="">
                      {t("all_branches") || "All branches (tenant-level)"}
                    </option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <p className="branch-detail__hint branch-detail__hint--sm">
                    {t("bulk_branch_hint") ||
                      "If no branch selected, uses tenant-level WhatsApp connection. Current branch is pre-selected."}
                  </p>
                </div>
              </div>
              <div className="branch-detail__bulk-field">
                <label>{t("message")}</label>
                <textarea
                  className="branch-detail__input branch-detail__textarea"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder={t("bulk_message_placeholder")}
                  rows={4}
                  required
                />
              </div>
              <div className="branch-detail__bulk-row">
                <div className="branch-detail__bulk-field">
                  <label>{t("delay_ms")}</label>
                  <input
                    type="number"
                    className="branch-detail__input"
                    min={500}
                    max={60000}
                    step={500}
                    value={bulkDelay}
                    onChange={(e) => setBulkDelay(e.target.value)}
                  />
                </div>
                <div className="branch-detail__bulk-actions">
                  <button
                    type="submit"
                    className="branch-detail__btn branch-detail__btn--primary"
                    disabled={bulkSending || !isConnected}
                  >
                    {bulkSending ? (
                      <Loader2 size={16} className="spin" />
                    ) : (
                      <Send size={16} />
                    )}{" "}
                    {bulkSending ? t("sending") : t("send_bulk")}
                  </button>
                </div>
              </div>
              {!isConnected && (
                <p className="branch-detail__hint branch-detail__hint--warn">
                  {t("connect_first_bulk")}
                </p>
              )}
            </form>
          </section>
        )}

        {canManageLogo && activeTab === TAB_LOGO && (
          <section className="branch-detail__card">
            <h2 className="branch-detail__card-title">
              {t("branch_logo") || "Branch Logo"}
            </h2>
            <p className="branch-detail__hint">
              {t("logo_hint") ||
                "Upload a logo for this branch. The logo will appear on invoices as a watermark and in the header."}
            </p>
            <LogoUpload
              branchId={id}
              currentLogoUrl={branch?.logo_url || null}
              onLogoUpdated={async () => {

                queryClient.invalidateQueries({
                  queryKey: queryKeys.branch(id),
                });
                queryClient.invalidateQueries({
                  queryKey: queryKeys.branches(),
                });

                try {
                  await refetchBranch();
                } catch { void 0; }
              }}
              theme={theme}
            />
          </section>
        )}
      </div>
    </div>
  );
}
