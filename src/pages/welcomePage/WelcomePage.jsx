import React, { useEffect, useState } from "react";
import logoImage from "../../assets/logo-kuwaitqumash.svg";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Languages,
  Layers,
  Package,
  Receipt,
  Ruler,
  Scissors,
  Sparkles,
  Store,
  Users,
} from "lucide-react";
import Footer from "../../components/footer/Footer";
import "./WelcomePage.css";

const LANGUAGES = ["fa", "ar", "en"];

const SWATCHES = [
  { key: "swatch_1", color: "#8b5cf6" },
  { key: "swatch_2", color: "#0ea5e9" },
  { key: "swatch_3", color: "#f43f5e" },
  { key: "swatch_4", color: "#14b8a6" },
  { key: "swatch_5", color: "#f59e0b" },
  { key: "swatch_6", color: "#64748b" },
];

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

  const cycleLanguage = () => {
    const index = LANGUAGES.indexOf(i18n.language);
    i18n.changeLanguage(LANGUAGES[(index + 1) % LANGUAGES.length]);
  };

  const fadeUpVariant = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 15 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const scaleInVariant = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const slideInLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 15 },
    },
  };

  const slideInRight = {
    hidden: { x: 60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 15 },
    },
  };

  const stats = [
    { value: t("landing.stat1_value"), label: t("landing.stat1_label") },
    { value: t("landing.stat2_value"), label: t("landing.stat2_label") },
    { value: t("landing.stat3_value"), label: t("landing.stat3_label") },
    { value: t("landing.stat4_value"), label: t("landing.stat4_label") },
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

  const pricingPlans = [
    {
      name: t("landing.plan1_name"),
      price: t("landing.plan1_price"),
      period: t("landing.plan1_period"),
      desc: t("landing.plan1_desc"),
      features: [
        t("landing.plan1_f1"),
        t("landing.plan1_f2"),
        t("landing.plan1_f3"),
      ],
      cta: t("landing.plan1_cta"),
      popular: false,
    },
    {
      name: t("landing.plan2_name"),
      price: t("landing.plan2_price"),
      period: t("landing.plan2_period"),
      desc: t("landing.plan2_desc"),
      features: [
        t("landing.plan2_f1"),
        t("landing.plan2_f2"),
        t("landing.plan2_f3"),
        t("landing.plan2_f4"),
        t("landing.plan2_f5"),
      ],
      cta: t("landing.plan2_cta"),
      popular: true,
    },
    {
      name: t("landing.plan3_name"),
      price: t("landing.plan3_price"),
      period: t("landing.plan3_period"),
      desc: t("landing.plan3_desc"),
      features: [
        t("landing.plan3_f1"),
        t("landing.plan3_f2"),
        t("landing.plan3_f3"),
      ],
      cta: t("landing.plan3_cta"),
      popular: false,
    },
  ];

  const faqs = [
    { q: t("landing.q1"), a: t("landing.a1") },
    { q: t("landing.q2"), a: t("landing.a2") },
    { q: t("landing.q3"), a: t("landing.a3") },
    { q: t("landing.q4"), a: t("landing.a4") },
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="welcome-wrapper" dir={isRtl ? "rtl" : "ltr"}>
      <div className="global-page-bg">
        <div className="bg-glow bg-glow-1"></div>
        <div className="bg-glow bg-glow-2"></div>
        <div className="bg-glow bg-glow-3"></div>
        <div className="global-page-overlay"></div>
      </div>

      <nav className="welcome-nav">
        <div className="welcome-nav-logo">
          <img src={logoImage} alt="KuwaitQumash" className="welcome-logo-img" />
        </div>
        <div className="welcome-nav-links">
          <button
            className="nav-btn-lang"
            onClick={cycleLanguage}
            title={t("landing.lang_title")}
          >
            <Languages size={20} />
            <span>{(i18n.language || "fa").toUpperCase()}</span>
          </button>
          <button className="nav-btn-text" onClick={() => navigate("/login")}>
            {t("landing.nav_login")}
          </button>
          <button className="nav-btn-gold" onClick={() => navigate("/signup")}>
            {t("landing.nav_signup")}
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-container">
          <motion.div
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariant} className="hero-badge">
              <span className="badge-dot"></span>
              {t("landing.badge")}
            </motion.div>

            <motion.h1 variants={fadeUpVariant} className="hero-title">
              {t("landing.hero_title_1")}{" "}
              <span className="text-gradient-gold">
                {t("landing.hero_title_2")}
              </span>
            </motion.h1>

            <motion.p variants={fadeUpVariant} className="hero-subtitle">
              {t("landing.hero_desc")}
            </motion.p>

            <motion.div variants={fadeUpVariant} className="hero-actions">
              <button className="btn-gold-large" onClick={() => navigate("/signup")}>
                {t("landing.cta_start")}
                <ArrowRight size={20} className={isRtl ? "rotate-180" : ""} />
              </button>
              <button className="btn-outline hero-ghost-btn" onClick={() => navigate("/login")}>
                {t("landing.cta_login")}
              </button>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="hero-note">
              <Sparkles size={16} />
              <span>{t("landing.note_free")}</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="hero-image-container"
            variants={scaleInVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="hero-image-glow"></div>
            <div className="hero-swatches">
              {SWATCHES.map((swatch, index) => (
                <motion.div
                  key={swatch.key}
                  className="hero-swatch"
                  style={{
                    "--swatch-color": swatch.color,
                    "--swatch-delay": `${index * 0.6}s`,
                  }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 5 + index * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.25,
                  }}
                >
                  <span className="hero-swatch__weave"></span>
                  <span className="hero-swatch__label">
                    {t(`landing.${swatch.key}`)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <motion.section
        className="stats-section"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="stats-grid">
          {stats.map((stat, idx) => (
            <motion.div key={idx} className="stat-card" variants={fadeUpVariant}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <section className="showcase-section" id="features">
        <div className="showcase-header">
          <h2 className="section-title">
            {t("landing.features_title_1")}{" "}
            <span className="text-gradient-gold">
              {t("landing.features_title_2")}
            </span>
          </h2>
          <p className="section-subtitle">{t("landing.features_desc")}</p>
        </div>

        <div className="showcase-list">
          <motion.div
            className="showcase-item-bg-video full-screen-bg-video"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="showcase-video-container showcase-ai-bg">
              <div className="showcase-video-overlay"></div>
            </div>
            <div className="showcase-content">
              <span className="showcase-tag">
                <Ruler size={16} />
                {t("landing.feature1_tag")}
              </span>
              <h3 className="showcase-title">
                {t("landing.feature1_title_1")}{" "}
                <span className="text-gradient-gold">
                  {t("landing.feature1_title_2")}
                </span>
              </h3>
              <p className="showcase-desc">{t("landing.feature1_desc")}</p>
            </div>
          </motion.div>

          <motion.div
            className="kqirat-explainer-section"
            variants={fadeUpVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="kqirat-explainer-container">
              <span className="kqirat-tag">{t("landing.fit_tag")}</span>
              <h2 className="kqirat-title">
                {t("landing.fit_title_1")}{" "}
                <span className="text-gradient-gold">
                  {t("landing.fit_title_2")}
                </span>
              </h2>
              <p className="kqirat-text">{t("landing.fit_desc")}</p>
              <div className="kqirat-features-row">
                <div className="kqirat-feat-item">
                  <span className="kqirat-feat-num">{t("landing.fit1_value")}</span>
                  <span className="kqirat-feat-lbl">{t("landing.fit1_label")}</span>
                </div>
                <div className="kqirat-feat-item">
                  <span className="kqirat-feat-num">{t("landing.fit2_value")}</span>
                  <span className="kqirat-feat-lbl">{t("landing.fit2_label")}</span>
                </div>
                <div className="kqirat-feat-item">
                  <span className="kqirat-feat-num">{t("landing.fit3_value")}</span>
                  <span className="kqirat-feat-lbl">{t("landing.fit3_label")}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="showcase-item-bg-video full-screen-bg-video"
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="showcase-video-container showcase-dashboard-bg">
              <div className="showcase-video-overlay"></div>
            </div>
            <div className="showcase-content">
              <span className="showcase-tag">
                <Package size={16} />
                {t("landing.feature2_tag")}
              </span>
              <h3 className="showcase-title">
                {t("landing.feature2_title_1")}{" "}
                <span className="text-gradient-gold">
                  {t("landing.feature2_title_2")}
                </span>
              </h3>
              <p className="showcase-desc">{t("landing.feature2_desc")}</p>
            </div>
          </motion.div>

          <motion.div
            className="showcase-item-bg-video full-screen-bg-video"
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            <div className="showcase-video-container showcase-textile-bg">
              <div className="showcase-video-overlay"></div>
            </div>
            <div className="showcase-content">
              <span className="showcase-tag">
                <Store size={16} />
                {t("landing.feature3_tag")}
              </span>
              <h3 className="showcase-title">
                {t("landing.feature3_title_1")}{" "}
                <span className="text-gradient-gold">
                  {t("landing.feature3_title_2")}
                </span>
              </h3>
              <p className="showcase-desc">{t("landing.feature3_desc")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-steps" id="how">
        <div className="showcase-header">
          <h2 className="section-title">
            {t("landing.how_title_1")}{" "}
            <span className="text-gradient-gold">
              {t("landing.how_title_2")}
            </span>
          </h2>
          <p className="section-subtitle">{t("landing.how_desc")}</p>
        </div>
        <motion.div
          className="landing-steps__grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              className="landing-step"
              variants={fadeUpVariant}
            >
              <div className="landing-step__top">
                <span className="landing-step__index">{index + 1}</span>
                <step.icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className="landing-step__title">{step.title}</h3>
              <p className="landing-step__desc">{step.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section className="pricing-section" id="pricing">
        <div className="pricing-header">
          <h2 className="section-title">
            {t("landing.pricing_title_1")}{" "}
            <span className="text-gradient-gold">
              {t("landing.pricing_title_2")}
            </span>
          </h2>
          <p className="section-subtitle">{t("landing.pricing_desc")}</p>
        </div>

        <motion.div
          className="pricing-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {pricingPlans.map((plan, idx) => (
            <motion.div
              key={idx}
              className={`pricing-card ${plan.popular ? "pricing-card-popular" : ""}`}
              variants={fadeUpVariant}
            >
              {plan.popular && (
                <div className="popular-badge">{t("landing.popular")}</div>
              )}
              <h3 className="plan-name">{plan.name}</h3>
              <div className="plan-price-wrapper">
                <span className="plan-price">{plan.price}</span>
                <span className="plan-period">{plan.period}</span>
              </div>
              <p className="plan-desc">{plan.desc}</p>
              <div className="plan-divider"></div>
              <ul className="plan-features">
                {plan.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <Check size={18} className="check-icon" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`plan-cta-btn ${plan.popular ? "btn-gold-solid" : "btn-outline"}`}
                onClick={() => navigate("/signup")}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-header">
          <h2 className="section-title">
            {t("landing.faq_title_1")}{" "}
            <span className="text-gradient-gold">
              {t("landing.faq_title_2")}
            </span>
          </h2>
          <p className="section-subtitle">{t("landing.faq_desc")}</p>
        </div>

        <motion.div
          className="faq-list"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
        >
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              className={`faq-item ${activeFaq === idx ? "faq-item-active" : ""}`}
              onClick={() => toggleFaq(idx)}
              variants={fadeUpVariant}
            >
              <div className="faq-question-row">
                <span className="faq-question">{faq.q}</span>
                <ChevronDown
                  size={20}
                  className={`faq-icon ${activeFaq === idx ? "faq-icon-open" : ""}`}
                />
              </div>
              <div className="faq-answer-wrapper">
                <p className="faq-answer">{faq.a}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="cta-section">
        <motion.div
          className="cta-box"
          variants={scaleInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2>
            {t("landing.cta_title_1")}{" "}
            <span className="text-gradient-gold">{t("landing.cta_title_2")}</span>
          </h2>
          <p>{t("landing.cta_desc")}</p>
          <button className="btn-gold-solid" onClick={() => navigate("/signup")}>
            {t("landing.cta_btn")}
          </button>
          <p className="cta-note">
            <Users size={16} />
            <span>{t("landing.cta_note")}</span>
          </p>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default WelcomePage;
