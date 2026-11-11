import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../../sidebar/Sidebar";
import { Menu, Sun, Moon, Languages, LogOut } from "lucide-react";
import logoImage from "../../../assets/logo-kuwaitqumash.svg";
import ErrorBoundary from "../../errorBoundary/ErrorBoundary";
import "./MainLayout.css";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const handleLogout = logout;

  // en -> ar -> fa -> en
  const toggleLanguage = () => {
    const order = ["fa", "ar", "en"];
    const next = order[(order.indexOf(i18n.language) + 1) % order.length];
    i18n.changeLanguage(next);
    const isRtl = next === "ar" || next === "fa";
    document.dir = isRtl ? "rtl" : "ltr";
    document.body.dir = isRtl ? "rtl" : "ltr";
    document.body.classList.remove("font-arabic", "font-english", "font-persian");
    document.body.classList.add(
      next === "fa" ? "font-persian" : next === "ar" ? "font-arabic" : "font-english",
    );
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
          <div className="main-header__left">
            <button className="hamburger-btn" onClick={toggleSidebar}>
              <Menu size={28} />
            </button>
            <div
              className="brand-logo-wrapper"
              onClick={() => navigate("/home")}
            >
              <img
                src={logoImage}
                alt={t("app_title") || "KuwaitQumash"}
                className="brand-logo"
              />
            </div>
          </div>

          <div className={`main-header__right main-header__right--${theme}`}>
            <button
              className={`header-btn header-btn--${theme}`}
              onClick={toggleLanguage}
              title={i18n.language}
            >
              <Languages size={20} />
              <span>{(i18n.language || "en").toUpperCase()}</span>
            </button>

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

        <main className="page-container">
          <ErrorBoundary resetKeys={[location.pathname]}>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
