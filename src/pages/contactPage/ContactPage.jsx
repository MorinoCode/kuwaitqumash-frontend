import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import api from "../../api/axios";
import Footer from "../../components/footer/Footer";
import "./ContactPage.css";

const EMPTY_FORM = { name: "", contact: "", message: "" };

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa";

  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const isValid =
    form.name.trim().length >= 2 &&
    form.contact.trim().length >= 5 &&
    form.message.trim().length >= 5;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isValid) {
      toast.error(t("contact_page.invalid"));
      return;
    }

    try {
      setSending(true);
      await api.post("/platform/contact", {
        name: form.name.trim(),
        contact: form.contact.trim(),
        message: form.message.trim(),
      });
      setSent(true);
      setForm(EMPTY_FORM);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("contact_page.failed"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page" dir={isRtl ? "rtl" : "ltr"}>
      <main className="contact-page__main">
        <Link to="/" className="contact-page__back">
          <ArrowLeft size={16} className={isRtl ? "flip-x" : ""} />
          {t("contact_page.back_home")}
        </Link>

        <h1 className="contact-page__title">{t("contact_page.title")}</h1>
        <p className="contact-page__subtitle">{t("contact_page.subtitle")}</p>

        {sent ? (
          <div className="contact-page__success" role="status">
            <CheckCircle2 size={28} />
            <h2>{t("contact_page.success_title")}</h2>
            <p>{t("contact_page.success_desc")}</p>
            <button
              type="button"
              className="contact-page__button contact-page__button--ghost"
              onClick={() => setSent(false)}
            >
              {t("contact_page.send_another")}
            </button>
          </div>
        ) : (
          <form className="contact-page__form" onSubmit={handleSubmit}>
            <label className="contact-page__field">
              <span>{t("contact_page.name_label")}</span>
              <input
                type="text"
                value={form.name}
                onChange={updateField("name")}
                placeholder={t("contact_page.name_placeholder")}
                maxLength={100}
                required
              />
            </label>

            <label className="contact-page__field">
              <span>{t("contact_page.contact_label")}</span>
              <input
                type="text"
                value={form.contact}
                onChange={updateField("contact")}
                placeholder={t("contact_page.contact_placeholder")}
                maxLength={150}
                required
              />
            </label>

            <label className="contact-page__field">
              <span>{t("contact_page.message_label")}</span>
              <textarea
                value={form.message}
                onChange={updateField("message")}
                placeholder={t("contact_page.message_placeholder")}
                rows={6}
                maxLength={2000}
                required
              />
            </label>

            <button
              type="submit"
              className="contact-page__button"
              disabled={!isValid || sending}
            >
              <Send size={16} />
              {sending ? t("contact_page.sending") : t("contact_page.submit")}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
