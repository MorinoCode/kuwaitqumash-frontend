import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../../sidebar/Sidebar";
import { Menu, Sun, Moon, Languages, LogOut, Check, Sparkles, AlertTriangle } from "lucide-react";
import logoImage from "../../../assets/logo1.png";
import ErrorBoundary from "../../errorBoundary/ErrorBoundary";
import useTenantStore from "../../../store/tenantStore";
import "./MainLayout.css";

const HelpAssistant = React.lazy(() => import("../../helpAssistant/HelpAssistant"));

const HELP_OPEN_LABEL = {
  fa: "راهنمای سیستم",
  ar: "دليل المساعدة",
  en: "Help Guide",
};

const LANGUAGES = [
  { code: "fa", label: "فارسی" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isLangOpen, setIsLangOpen] = React.useState(false);
  const [isHelpOpen, setIsHelpOpen] = React.useState(false);
  const langMenuRef = React.useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const subscriptionWarning = useTenantStore((s) => s.subscriptionWarning);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = logout;
  const currentLang = (i18n.language || "fa").split("-")[0];
  const helpOpenLabel = HELP_OPEN_LABEL[currentLang] || HELP_OPEN_LABEL.en;

  React.useEffect(() => {
    if (!isLangOpen) return undefined;

    const handlePointerDown = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsLangOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLangOpen]);

  React.useEffect(() => {
    const lang = i18n.language || "fa";
    const isRtl = lang === "ar" || lang === "fa";
    document.dir = isRtl ? "rtl" : "ltr";
    document.body.dir = isRtl ? "rtl" : "ltr";
    document.body.classList.remove("font-arabic", "font-english", "font-persian");
    document.body.classList.add(
      lang === "fa" ? "font-persian" : lang === "ar" ? "font-arabic" : "font-english",
    );
  }, [i18n.language]);

  const changeLanguage = (next) => {
    i18n.changeLanguage(next);
    setIsLangOpen(false);
  };

  return (
    <div
      className={`main-layout main-layout--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Escape") closeSidebar();
        }}
        aria-label={t("close_sidebar") || "Close sidebar"}
      ></div>

      <div className={`layout-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <Sidebar closeSidebar={closeSidebar} />
      </div>

      <div className="layout-content">
        <header className={`main-header main-header--${theme}`}>
          <button
            className="hamburger-btn"
            onClick={toggleSidebar}
            aria-label={t("menu") || "Menu"}
            title={t("menu") || "Menu"}
          >
            <Menu size={28} />
          </button>

          <div className="main-header__left">
            <div
              className="brand-logo-wrapper"
              onClick={() => navigate("/home")}
            >
              <img
                src={logoImage}
                alt={t("app_title") || "Qummash"}
                className="brand-logo"
              />
            </div>
          </div>

          <div className={`main-header__right main-header__right--${theme}`}>
            <button
              type="button"
              className={`header-btn header-btn--${theme} header-btn--help ${isHelpOpen ? "header-btn--active" : ""}`}
              onClick={() => setIsHelpOpen((open) => !open)}
              aria-haspopup="dialog"
              aria-expanded={isHelpOpen}
              aria-label={helpOpenLabel}
              title={helpOpenLabel}
            >
              <Sparkles size={20} />
            </button>

            <div className={`lang-menu lang-menu--${theme}`} ref={langMenuRef}>
              <button
                type="button"
                className={`header-btn header-btn--${theme} ${isLangOpen ? "header-btn--active" : ""}`}
                onClick={() => setIsLangOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isLangOpen}
                aria-label={t("language") || "Language"}
                title={t("language") || "Language"}
              >
                <Languages size={20} />
                <span>{(i18n.language || "en").toUpperCase()}</span>
              </button>

              {isLangOpen && (
                <div
                  className={`lang-menu__list lang-menu__list--${theme}`}
                  role="menu"
                  aria-label={t("language") || "Language"}
                >
                  {LANGUAGES.map((language) => {
                    const isActive = i18n.language === language.code;
                    return (
                      <button
                        key={language.code}
                        type="button"
                        role="menuitemradio"
                        aria-checked={isActive}
                        className={`lang-menu__item lang-menu__item--${theme} ${isActive ? "lang-menu__item--active" : ""}`}
                        onClick={() => changeLanguage(language.code)}
                      >
                        <span>{language.label}</span>
                        {isActive && <Check size={14} className="lang-menu__check" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              className={`header-btn header-btn--${theme}`}
              onClick={toggleTheme}
              title={theme === "dark" ? t("light_mode") : t("dark_mode")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              className={`header-btn header-btn--logout header-btn--${theme}`}
              onClick={handleLogout}
              title={t("logout")}
            >
              <LogOut size={20} className="rtl-flip" />
              <span>{t("logout")}</span>
            </button>
          </div>
        </header>

        {subscriptionWarning && (
          <aside
            className={`subscription-banner subscription-banner--${subscriptionWarning.type || "warning"}`}
            role="alert"
            style={{
              padding: "10px 16px",
              margin: "12px 1rem 0 1rem",
              borderRadius: "8px",
              backgroundColor:
                subscriptionWarning.type === "expired_readonly"
                  ? "#ffebee"
                  : subscriptionWarning.type === "grace_period"
                    ? "#fff3e0"
                    : "#e3f2fd",
              color:
                subscriptionWarning.type === "expired_readonly"
                  ? "#c62828"
                  : subscriptionWarning.type === "grace_period"
                    ? "#e65100"
                    : "#1565c0",
              border: `1px solid ${
                subscriptionWarning.type === "expired_readonly"
                  ? "#ffcdd2"
                  : subscriptionWarning.type === "grace_period"
                    ? "#ffe0b2"
                    : "#bbdefb"
              }`,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>
              {subscriptionWarning.type === "expired_readonly"
                ? t("subscription_expired_readonly_msg") ||
                  "Subscription expired. Store is in read-only mode. Please contact administrator to renew."
                : subscriptionWarning.type === "grace_period"
                  ? t("subscription_grace_period_msg") ||
                    "Subscription has expired. You are currently in a 7-day grace period. Please renew promptly."
                  : t("subscription_expiring_soon_msg") ||
                    "Your annual store subscription is expiring soon. Please contact administrator to renew."}
            </span>
          </aside>
        )}

        <main className="page-container">
          <ErrorBoundary resetKeys={[location.pathname]}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>

      {isHelpOpen && (
        <React.Suspense fallback={null}>
          <HelpAssistant isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
        </React.Suspense>
      )}
    </div>
  );
};

export default MainLayout;
