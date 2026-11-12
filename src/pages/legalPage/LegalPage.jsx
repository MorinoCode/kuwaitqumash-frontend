import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import Footer from "../../components/footer/Footer";
import "./LegalPage.css";

const LegalPage = ({ doc }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa";

  const sections = t(`legal.${doc}.sections`, { returnObjects: true });
  const list = Array.isArray(sections) ? sections : [];

  return (
    <div className="legal-page" dir={isRtl ? "rtl" : "ltr"}>
      <main className="legal-page__main">
        <Link to="/" className="legal-page__back">
          <ArrowLeft size={16} className={isRtl ? "flip-x" : ""} />
          {t("legal.back_home")}
        </Link>

        <h1 className="legal-page__title">{t(`legal.${doc}.title`)}</h1>
        <p className="legal-page__updated">{t("legal.updated")}</p>
        <p className="legal-page__intro">{t(`legal.${doc}.intro`)}</p>

        <div className="legal-page__sections">
          {list.map((section, index) => (
            <section className="legal-page__section" key={index}>
              <h2>
                {index + 1}. {section.title}
              </h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPage;
