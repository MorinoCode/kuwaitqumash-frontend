import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import PublicNavbar from "../../components/publicNavbar/PublicNavbar";
import Footer from "../../components/footer/Footer";
import "./LegalPage.css";

const LegalPage = ({ doc }) => {
  const { t, i18n } = useTranslation();
  const themeContext = useTheme();
  const theme = themeContext?.theme || "dark";
  const isRtl = i18n.language === "ar" || i18n.language === "fa";

  const sections = t(`legal.${doc}.sections`, { returnObjects: true });
  const list = Array.isArray(sections) ? sections : [];

  return (
    <div className={`legal-page legal-page--${theme}`} dir={isRtl ? "rtl" : "ltr"}>
      <PublicNavbar />

      <main className="legal-page__main">
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
