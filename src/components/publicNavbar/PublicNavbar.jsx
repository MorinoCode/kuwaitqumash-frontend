import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import {
  Languages,
  ChevronDown,
  Check,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";
import logoImage from "../../assets/logo1.png";
import "./PublicNavbar.css";

const LANGUAGES = ["fa", "ar", "en"];
const LANGUAGE_LABELS = { fa: "فارسی", ar: "العربية", en: "English" };

const SIGNUP_ENTRY_PATH =
  import.meta.env.VITE_ALLOW_PUBLIC_SIGNUP !== "false" ? "/signup" : "/contact";

const PublicNavbar = ({ className = "" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar" || i18n.language === "fa";

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

  useEffect(() => {
    const lang = i18n.language || "en";
    const rtl = lang === "ar" || lang === "fa";
    document.documentElement.setAttribute("dir", rtl ? "rtl" : "ltr");
    document.body.setAttribute("dir", rtl ? "rtl" : "ltr");
    document.body.classList.remove("font-arabic", "font-english", "font-persian");
    document.body.classList.add(
      lang === "fa"
        ? "font-persian"
        : lang === "ar"
          ? "font-arabic"
          : "font-english"
    );
  }, [i18n.language]);

  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangMenuOpen(false);
  };

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      const node = document.getElementById(id);
      if (node) {
        node.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      navigate(`/?section=${id}`);
    }
  };

  const handleBrandClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  const isLoginPage = location.pathname === "/login";
  const isContactPage = location.pathname === "/contact";
  const isSignupPage = location.pathname === "/signup";
  const isPublicSignupAllowed =
    import.meta.env.VITE_ALLOW_PUBLIC_SIGNUP !== "false";

  return (
    <nav
      className={`landing-nav landing-nav--${theme} ${className}`}
      dir={isRtl ? "rtl" : "ltr"}
      aria-label="Main Navigation"
    >
      <button
        type="button"
        className="landing-nav__brand"
        onClick={handleBrandClick}
        title={t("app_title") || "Qummash"}
        aria-label={t("app_title") || "Qummash"}
      >
        <img
          src={logoImage}
          alt={t("app_title") || "Qummash"}
          className="landing-nav__logo-img"
        />
      </button>

      <div className="landing-nav__links">
        <button
          type="button"
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
          className={location.pathname === "/" ? "landing-nav__link--active" : ""}
        >
          {t("home", "خانه")}
        </button>
        <button type="button" onClick={() => scrollToSection("features")}>
          {t("landing.nav_features")}
        </button>
        <button type="button" onClick={() => scrollToSection("how")}>
          {t("landing.nav_how")}
        </button>
        <button type="button" onClick={() => scrollToSection("pricing")}>
          {t("landing.nav_pricing")}
        </button>
        <button type="button" onClick={() => scrollToSection("faq")}>
          {t("landing.nav_faq")}
        </button>
        <button
          type="button"
          onClick={() => {
            if (location.pathname === "/contact") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/contact");
            }
          }}
          className={location.pathname === "/contact" ? "landing-nav__link--active" : ""}
        >
          {t("landing.nav_contact", t("landing.contact_plan_cta"))}
        </button>
      </div>

      <div className="landing-nav__actions">
        <button
          type="button"
          className={`landing-nav__theme-btn landing-nav__theme-btn--${theme}`}
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={theme === "dark" ? t("light_mode") || "Light mode" : t("dark_mode") || "Dark mode"}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

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

        {!isLoginPage && (
          <button
            type="button"
            className="landing-nav__login"
            onClick={() => navigate("/login")}
          >
            {t("landing.nav_login")}
          </button>
        )}

        {isPublicSignupAllowed ? (
          !isSignupPage && (
            <button
              type="button"
              className="landing-nav__cta"
              onClick={() => navigate("/signup")}
            >
              <span>{t("landing.nav_signup")}</span>
              <ArrowRight size={16} className={isRtl ? "flip-x" : ""} />
            </button>
          )
        ) : (
          !isContactPage && (
            <button
              type="button"
              className="landing-nav__cta"
              onClick={() => navigate("/contact")}
            >
              <span>{t("landing.contact_plan_cta")}</span>
              <ArrowRight size={16} className={isRtl ? "flip-x" : ""} />
            </button>
          )
        )}
      </div>
    </nav>
  );
};

export default PublicNavbar;
