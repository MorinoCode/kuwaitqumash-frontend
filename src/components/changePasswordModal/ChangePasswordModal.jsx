import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { KeyRound, X, Eye, EyeOff, Loader2 } from "lucide-react";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import "./ChangePasswordModal.css";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isRtl = i18n.language === "ar" || i18n.language === "fa";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, saving, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error(t("password_min_length") || "Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("passwords_do_not_match") || "Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const res = await api.put("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      const nextToken = res.data?.data?.token;
      if (nextToken) {
        try {
          localStorage.setItem("token", nextToken);
        } catch {
          void 0;
        }
      }
      toast.success(t("password_updated_success") || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          t("password_change_failed") ||
          "Failed to change password",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="pwd-modal-overlay"
      onClick={() => !saving && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={t("change_password") || "Change Password"}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div
        className={`pwd-modal pwd-modal--${theme}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pwd-modal__header">
          <h3 className="pwd-modal__title">
            <KeyRound size={18} />
            <span>{t("change_password") || "Change Password"}</span>
          </h3>
          <button
            type="button"
            className="pwd-modal__close"
            onClick={onClose}
            disabled={saving}
            aria-label={t("close") || "Close"}
          >
            <X size={18} />
          </button>
        </div>

        <form className="pwd-modal__form" onSubmit={handleSubmit}>
          <label className="pwd-modal__field">
            <span>{t("current_password") || "Current Password"}</span>
            <div className="pwd-modal__input-wrap">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={saving}
              />
              <button
                type="button"
                className="pwd-modal__eye"
                onClick={() => setShowCurrent((v) => !v)}
                aria-label="Toggle current password"
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="pwd-modal__field">
            <span>{t("new_password") || "New Password"}</span>
            <div className="pwd-modal__input-wrap">
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                disabled={saving}
              />
              <button
                type="button"
                className="pwd-modal__eye"
                onClick={() => setShowNew((v) => !v)}
                aria-label="Toggle new password"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <label className="pwd-modal__field">
            <span>{t("confirm_new_password") || "Confirm New Password"}</span>
            <div className="pwd-modal__input-wrap">
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
                disabled={saving}
              />
            </div>
          </label>

          <div className="pwd-modal__actions">
            <button
              type="button"
              className="pwd-modal__btn pwd-modal__btn--cancel"
              onClick={onClose}
              disabled={saving}
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="submit"
              className="pwd-modal__btn pwd-modal__btn--submit"
              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
            >
              {saving && <Loader2 size={15} className="spin" />}
              <span>{t("save") || "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
