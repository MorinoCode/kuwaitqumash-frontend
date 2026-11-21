import React from "react";
import { Save, Send, Loader2, QrCode } from "lucide-react";

const BranchWhatsAppTabs = ({
  t,
  id,
  activeTab,
  tabReceive,
  tabConnect,
  tabBulk,
  form,
  setForm,
  saving,
  setSaving,
  receiveActive,
  updateBranchMutation,
  refetchBranch,
  handleSaveReceive,
  isConnected,
  waStatus,
  handleDisconnectWa,
  handleConnectWa,
  connecting,
  qrDataUrl,
  handleBulkSend,
  bulkSegment,
  setBulkSegment,
  bulkBranchId,
  setBulkBranchId,
  branches,
  bulkMessage,
  setBulkMessage,
  bulkSending,
}) => (
  <>
    {activeTab === tabReceive && (
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
                } catch {
                  void 0;
                } finally {
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

    {activeTab === tabConnect && (
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
                    : "") +
                  (waStatus?.is_central_fallback
                    ? ` (${t("store_central_number") || "Store Central Number"})`
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

    {activeTab === tabBulk && (
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
              <p className="branch-detail__hint branch-detail__hint--sm">
                {t("bulk_antiban_hint") ||
                  "Automatic anti-ban pacing (20–45s between messages during Kuwait working hours 09:00–22:00) is enforced by the background worker."}
              </p>
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
  </>
);

export default BranchWhatsAppTabs;
