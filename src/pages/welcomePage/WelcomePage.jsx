import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import logoImage from "../../assets/logo-kuwaitqumash.svg";
import Footer from "../../components/footer/Footer";
import ParticleSphere from "../../components/particleSphere/ParticleSphere";
import "./WelcomePage.css";

const LANGUAGES = ["fa", "ar", "en"];

const LANGUAGE_LABELS = { fa: "فارسی", ar: "العربية", en: "English" };

const WelcomePage = () => {
  const navigate = useNavigate();
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

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef(null);

  useEffect(() => {
    if (!langMenuOpen) return;

    const handlePointerDown = (event) => {
      if (!langMenuRef.current?.contains(event.target)) setLangMenuOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setLangMenuOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [langMenuOpen]);

  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangMenuOpen(false);
  };

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
    <div className="landing" dir={isRtl ? "rtl" : "ltr"}>
      <div className="landing__backdrop" aria-hidden="true">
        <ParticleSphere />
      </div>

      <nav className="landing-nav">
        <button
          type="button"
          className="landing-nav__brand"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <img src={logoImage} alt={t("app_title")} />
        </button>

        <div className="landing-nav__links">
          <button type="button" onClick={() => scrollTo("features")}>
            {t("landing.nav_features")}
          </button>
          <button type="button" onClick={() => scrollTo("how")}>
            {t("landing.nav_how")}
          </button>
          <button type="button" onClick={() => scrollTo("pricing")}>
            {t("landing.nav_pricing")}
          </button>
          <button type="button" onClick={() => scrollTo("faq")}>
            {t("landing.nav_faq")}
          </button>
        </div>

        <div className="landing-nav__actions">
          <div className="landing-nav__lang-wrap" ref={langMenuRef}>
            <button
              type="button"
              className="landing-nav__lang"
              onClick={() => setLangMenuOpen((open) => !open)}
              title={t("landing.lang_title")}
              aria-label={t("landing.lang_title")}
              aria-haspopup="menu"
              aria-expanded={langMenuOpen}
            >
              <Languages size={17} />
              <span>{(i18n.language || "fa").toUpperCase()}</span>
              <ChevronDown
                size={14}
                className={`landing-nav__lang-caret${langMenuOpen ? " landing-nav__lang-caret--open" : ""}`}
              />
            </button>

            {langMenuOpen && (
              <ul className="landing-nav__lang-menu" role="menu">
                {LANGUAGES.map((lang) => {
                  const isActive = (i18n.language || "fa").startsWith(lang);
                  return (
                    <li key={lang}>
                      <button
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        className={`landing-nav__lang-option${isActive ? " landing-nav__lang-option--active" : ""}`}
                        onClick={() => selectLanguage(lang)}
                      >
                        <span>{LANGUAGE_LABELS[lang]}</span>
                        {isActive && <Check size={14} />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <button
            type="button"
            className="landing-nav__login"
            onClick={() => navigate("/login")}
          >
            {t("landing.nav_login")}
          </button>

          <button
            type="button"
            className="landing-nav__cta"
            onClick={() => navigate("/signup")}
          >
            {t("landing.nav_signup")}
            <ArrowRight size={16} className={isRtl ? "flip-x" : ""} />
          </button>
        </div>
      </nav>

      <header className="hero">
        <div className="hero__vignette" aria-hidden="true" />

        <div className="hero__content">
          <span className="hero__badge">
            <i className="hero__badge-dot" />
            {t("landing.badge")}
          </span>

          <h1 className="hero__wordmark" dir="ltr">
            <span>Kuwait</span>
            <span className="hero__wordmark-accent">Qumash</span>
          </h1>

          <p className="hero__tagline">{t("landing.hero_desc")}</p>

          <div className="hero__actions">
            <button
              type="button"
              className="btn-pill btn-pill--solid"
              onClick={() => navigate("/signup")}
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
              onClick={() => navigate("/signup")}
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
          onClick={() => navigate("/signup")}
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
