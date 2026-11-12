import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ArrowLeft, Check, Inbox, Mail, Phone, ShieldAlert } from "lucide-react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./ContactInboxPage.css";

const formatDate = (value) => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return value;
  }
};

const ContactInboxPage = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const isOwner = user?.role === "store_owner";

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/platform/contact");
      setMessages(res.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("contact_inbox.failed_load"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (!authLoading && isOwner) {
      loadMessages();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, isOwner, loadMessages]);

  const markAsRead = async (id) => {
    try {
      await api.patch(`/platform/contact/${id}/read`);
      setMessages((prev) =>
        prev.map((message) =>
          message.id === id ? { ...message, status: "read" } : message,
        ),
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || t("contact_inbox.failed_update"));
    }
  };

  const unreadCount = messages.filter((message) => message.status !== "read").length;

  return (
    <div
      className={`contact-inbox contact-inbox--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <header className="contact-inbox__header">
        <button
          type="button"
          className="contact-inbox__back"
          onClick={() => navigate("/manage")}
        >
          <ArrowLeft size={18} />
          {t("contact_inbox.back")}
        </button>
        <div>
          <h1 className="contact-inbox__title">
            <Inbox size={22} />
            {t("contact_inbox.title")}
          </h1>
          <p className="contact-inbox__subtitle">
            {t("contact_inbox.subtitle")}
            {unreadCount > 0 && (
              <span className="contact-inbox__badge">{unreadCount}</span>
            )}
          </p>
        </div>
      </header>

      {!isOwner ? (
        <div className="contact-inbox__state contact-inbox__state--denied">
          <ShieldAlert size={30} />
          <p>{t("contact_inbox.owner_only")}</p>
        </div>
      ) : loading ? (
        <div className="contact-inbox__state">{t("loading")}...</div>
      ) : messages.length === 0 ? (
        <div className="contact-inbox__state">
          <Mail size={26} />
          <p>{t("contact_inbox.empty")}</p>
        </div>
      ) : (
        <ul className="contact-inbox__list">
          {messages.map((message) => {
            const unread = message.status !== "read";
            return (
              <li
                key={message.id}
                className={`contact-inbox__item ${unread ? "contact-inbox__item--unread" : ""}`}
              >
                <div className="contact-inbox__item-head">
                  <span className="contact-inbox__name">{message.name}</span>
                  <span className="contact-inbox__date">
                    {formatDate(message.created_at)}
                  </span>
                </div>

                <span className="contact-inbox__contact">
                  {String(message.contact).includes("@") ? (
                    <Mail size={14} />
                  ) : (
                    <Phone size={14} />
                  )}
                  {message.contact}
                </span>

                <p className="contact-inbox__message">{message.message}</p>

                <div className="contact-inbox__actions">
                  {unread ? (
                    <button
                      type="button"
                      className="contact-inbox__action"
                      onClick={() => markAsRead(message.id)}
                    >
                      <Check size={15} />
                      {t("contact_inbox.mark_read")}
                    </button>
                  ) : (
                    <span className="contact-inbox__read">
                      {t("contact_inbox.read")}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContactInboxPage;
