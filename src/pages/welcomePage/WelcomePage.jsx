import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Languages,
  Layers,
  Receipt,
  Ruler,
  Scissors,
  Sparkles,
  Store,
} from "lucide-react";
import Footer from "../../components/footer/Footer";
import ParticleSphere from "../../components/particleSphere/ParticleSphere";
import PublicNavbar from "../../components/publicNavbar/PublicNavbar";
import "./WelcomePage.css";

const SIGNUP_ENTRY_PATH =
  import.meta.env.VITE_ALLOW_PUBLIC_SIGNUP !== "false" ? "/signup" : "/contact";

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const themeContext = useTheme();
  const theme = themeContext?.theme || "dark";
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa";
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const currentLang = i18n.language || "fa";
    const rtl = currentLang === "ar" || currentLang === "fa";
    document.dir = rtl ? "rtl" : "ltr";
    document.body.dir = rtl ? "rtl" : "ltr";
    document.body.classList.remove("font-arabic", "font-english", "font-persian");
    document.body.classList.add(
      currentLang === "fa"
        ? "font-persian"
        : currentLang === "ar"
          ? "font-arabic"
          : "font-english",
    );
  }, [i18n.language]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get("section");
    if (section) {
      const timer = setTimeout(() => {
        const node = document.getElementById(section);
        if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.search]);

  const scrollTo = (id) => {
    const node = document.getElementById(id);
    if (node) node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stats = [
    { value: t("landing.stat2_value"), label: t("landing.stat2_label") },
    { value: t("landing.stat3_value"), label: t("landing.stat3_label") },
    { value: t("landing.stat4_value"), label: t("landing.stat4_label") },
  ];

  const features = [
    {
      tag: t("landing.feature1_tag"),
      icon: Ruler,
      title: t("landing.feature1_title_1"),
      accent: t("landing.feature1_title_2"),
      desc: t("landing.feature1_desc"),
    },
    {
      tag: t("landing.feature2_tag"),
      icon: Layers,
      title: t("landing.feature2_title_1"),
      accent: t("landing.feature2_title_2"),
      desc: t("landing.feature2_desc"),
    },
    {
      tag: t("landing.feature3_tag"),
      icon: Store,
      title: t("landing.feature3_title_1"),
      accent: t("landing.feature3_title_2"),
      desc: t("landing.feature3_desc"),
    },
  ];

  const steps = [
    {
      title: t("landing.step1_title"),
      desc: t("landing.step1_desc"),
      icon: Layers,
    },
    {
      title: t("landing.step2_title"),
      desc: t("landing.step2_desc"),
      icon: Scissors,
    },
    {
      title: t("landing.step3_title"),
      desc: t("landing.step3_desc"),
      icon: Receipt,
    },
    {
      title: t("landing.step4_title"),
      desc: t("landing.step4_desc"),
      icon: BarChart3,
    },
  ];

  const contactPlan = {
    name: t("landing.contact_plan_name"),
    desc: t("landing.contact_plan_desc"),
    features: [
      t("landing.contact_plan_f1"),
      t("landing.contact_plan_f2"),
      t("landing.contact_plan_f3"),
      t("landing.contact_plan_f4"),
    ],
    cta: t("landing.contact_plan_cta"),
  };

  const faqs = [
    { q: t("landing.q1"), a: t("landing.a1") },
    { q: t("landing.q2"), a: t("landing.a2") },
    { q: t("landing.q3"), a: t("landing.a3") },
    { q: t("landing.q4"), a: t("landing.a4") },
  ];

  return (
    <div className={`landing landing--${theme || "dark"}`} dir={isRtl ? "rtl" : "ltr"}>
      <PublicNavbar />

      <header className="hero">
        <div className="hero__sphere">
          <ParticleSphere />
        </div>
        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__content">
          <h1 className="hero__wordmark" dir="ltr">
            <span>Kuwait</span>
            <span className="hero__wordmark-accent">Qumash</span>
          </h1>

          <p className="hero__tagline">{t("landing.hero_desc")}</p>

          <div className="hero__actions">
            <button
              type="button"
              className="btn-pill btn-pill--solid"
              onClick={() => navigate(SIGNUP_ENTRY_PATH)}
            >
              {t("landing.cta_start")}
              <ArrowRight size={18} className={isRtl ? "flip-x" : ""} />
            </button>
            <button
              type="button"
              className="btn-pill btn-pill--ghost"
              onClick={() => navigate("/login")}
            >
              {t("landing.cta_login")}
            </button>
          </div>

          <p className="hero__note">
            <Sparkles size={15} />
            {t("landing.note_free")}
          </p>
        </div>

        <button
          type="button"
          className="hero__scroll"
          onClick={() => scrollTo("features")}
        >
          <span>{t("landing.scroll_hint")}</span>
          <ChevronDown size={16} />
        </button>
      </header>

      <section className="stat-band">
        {stats.map((stat, index) => (
          <div className="stat-band__item" key={index}>
            <span className="stat-band__value">{stat.value}</span>
            <span className="stat-band__label">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="section" id="features">
        <header className="section__head">
          <h2>
            {t("landing.features_title_1")}{" "}
            <span className="accent-text">{t("landing.features_title_2")}</span>
          </h2>
          <p>{t("landing.features_desc")}</p>
        </header>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={index}>
              <div className="feature-card__icon">
                <feature.icon size={22} strokeWidth={1.6} />
              </div>
              <span className="feature-card__tag">{feature.tag}</span>
              <h3>
                {feature.title} <span className="accent-text">{feature.accent}</span>
              </h3>
              <p>{feature.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fit-band">
        <span className="fit-band__tag">{t("landing.fit_tag")}</span>
        <h2>
          {t("landing.fit_title_1")}{" "}
          <span className="accent-text">{t("landing.fit_title_2")}</span>
        </h2>
        <p className="fit-band__desc">{t("landing.fit_desc")}</p>

        <div className="fit-band__metrics">
          <div>
            <strong>{t("landing.fit1_value")}</strong>
            <span>{t("landing.fit1_label")}</span>
          </div>
          <div>
            <strong>{t("landing.fit2_value")}</strong>
            <span>{t("landing.fit2_label")}</span>
          </div>
          <div>
            <strong>{t("landing.fit3_value")}</strong>
            <span>{t("landing.fit3_label")}</span>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <header className="section__head">
          <h2>
            {t("landing.how_title_1")}{" "}
            <span className="accent-text">{t("landing.how_title_2")}</span>
          </h2>
          <p>{t("landing.how_desc")}</p>
        </header>

        <div className="step-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={index}>
              <div className="step-card__top">
                <span className="step-card__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <step.icon size={20} strokeWidth={1.6} />
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="pricing">
        <header className="section__head">
          <h2>
            {t("landing.pricing_title_1")}{" "}
            <span className="accent-text">{t("landing.pricing_title_2")}</span>
          </h2>
          <p>{t("landing.pricing_desc")}</p>
        </header>

                <div className="plan-grid plan-grid--single">
          <article className="plan-card plan-card--popular">
            <h3>{contactPlan.name}</h3>
            <p className="plan-card__desc">{contactPlan.desc}</p>

            <ul>
              {contactPlan.features.map((feature, index) => (
                <li key={index}>
                  <Check size={15} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn-pill btn-pill--solid btn-pill--block"
              onClick={() => navigate(SIGNUP_ENTRY_PATH)}
            >
              {contactPlan.cta}
            </button>
          </article>
        </div>
      </section>

      <section className="section section--faq" id="faq">
        <header className="section__head">
          <h2>
            {t("landing.faq_title_1")}{" "}
            <span className="accent-text">{t("landing.faq_title_2")}</span>
          </h2>
          <p>{t("landing.faq_desc")}</p>
        </header>

        <div className="faq-list">
          {faqs.map((faq, index) => {
            const open = activeFaq === index;
            return (
              <div className={`faq-row ${open ? "faq-row--open" : ""}`} key={index}>
                <button
                  type="button"
                  className="faq-row__question"
                  onClick={() => setActiveFaq(open ? null : index)}
                  aria-expanded={open}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} />
                </button>
                <div className="faq-row__answer">
                  <p>{faq.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="final-cta">
        <h2>
          {t("landing.cta_title_1")}{" "}
          <span className="accent-text">{t("landing.cta_title_2")}</span>
        </h2>
        <p>{t("landing.cta_desc")}</p>
        <button
          type="button"
          className="btn-pill btn-pill--solid"
          onClick={() => navigate(SIGNUP_ENTRY_PATH)}
        >
          {t("landing.cta_btn")}
          <ArrowRight size={18} className={isRtl ? "flip-x" : ""} />
        </button>
      </section>

      <Footer />
    </div>
  );
};

export default WelcomePage;
