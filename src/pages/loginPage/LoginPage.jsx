import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useTenantStore from "../../store/tenantStore";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import logoImage from "../../assets/logo-kuwaitqumash.svg";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { setTenant } = useTenantStore();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState(() => ({
    storeId: (location.state?.tenantId || "").toLowerCase(),
    username: "",
    password: "",
  }));
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    credentials.storeId.trim().length > 0 &&
    credentials.username.trim().length > 0 &&
    credentials.password.length > 0 &&
    !isSubmitting;

  useEffect(() => {

    const currentLang = i18n.language || "fa";
    const isRtlLang = currentLang === "ar" || currentLang === "fa";
    document.dir = isRtlLang ? "rtl" : "ltr";
    document.body.dir = isRtlLang ? "rtl" : "ltr";
    document.body.classList.remove("font-arabic", "font-english", "font-persian");
    document.body.classList.add(
      currentLang === "fa"
        ? "font-persian"
        : currentLang === "ar"
          ? "font-arabic"
          : "font-english",
    );
  }, [i18n.language]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const config = {
        headers: {
          "x-tenant-id": credentials.storeId.trim().toLowerCase(),
        },
      };

      const response = await api.post(
        "/auth/login",
        {
          username: credentials.username.trim().toLowerCase(),
          password: credentials.password,
        },
        config
      );

      const data = response.data?.data || response.data;
      const tenantId = data?.tenant_id ?? credentials.storeId;
      const tenantName = data?.tenant_name ?? null;
      setTenant(tenantId, tenantName);

      toast.success(
        t("login_successful") || "Login Successful! Redirecting...",
        {
          position: "top-center",
          autoClose: 1500,
          theme: theme === "dark" ? "dark" : "light",
        }
      );

      login(data);
    } catch (err) {

      const serverError =
        err.response?.data?.message ||
        t("invalid_credentials") ||
        "Login failed.";

      toast.error(serverError, {
        position: "top-center",
        autoClose: 4000,
        theme: theme === "dark" ? "dark" : "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === "ar" ? "rtl" : "ltr";
    document.body.dir = lng === "ar" ? "rtl" : "ltr";
    document.body.classList.remove("font-arabic", "font-english");
    document.body.classList.add(lng === "ar" ? "font-arabic" : "font-english");
  };

  return (
    <div
      className={`login-page login-page--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="login-page__logo-link"
        onClick={() => navigate("/")}
      >
        <img
          src={logoImage}
          alt={t("app_title")}
          className="login-page__top-logo"
        />
      </div>

      <div className={`login-page__controls login-page__controls--${theme}`}>

        <button
          type="button"
          className={`login-page__theme-btn login-page__theme-btn--${theme}`}
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={theme === "dark" ? t("light_mode") : t("dark_mode")}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div
          className={`login-page__language-selector login-page__language-selector--${theme}`}
        >
          <button
            type="button"
            className={`login-page__lang-btn ${
              i18n.language === "fa" ? "login-page__lang-btn--active" : ""
            } login-page__lang-btn--${theme}`}
            onClick={() => changeLanguage("fa")}
          >
            FA
          </button>
          <button
            type="button"
            className={`login-page__lang-btn ${
              i18n.language === "en" ? "login-page__lang-btn--active" : ""
            } login-page__lang-btn--${theme}`}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={`login-page__lang-btn ${
              i18n.language === "ar" ? "login-page__lang-btn--active" : ""
            } login-page__lang-btn--${theme}`}
            onClick={() => changeLanguage("ar")}
          >
            AR
          </button>
        </div>
      </div>

      <div className={`login-card login-card--${theme}`}>
        <header className={`login-card__header login-card__header--${theme}`}>
          <div
            className="login-card__logo-wrapper"
            onClick={() => navigate("/")}
          >
            <img
              src={logoImage}
              alt={t("app_title")}
              className="login-card__logo"
            />
          </div>
          <p className={`login-card__subtitle login-card__subtitle--${theme}`}>
            FABRIC MANAGEMENT PORTAL | KUWAIT
          </p>
        </header>

        <form
          className={`login-card__form login-card__form--${theme}`}
          onSubmit={handleLogin}
        >
          <div
            className={`login-card__form-group login-card__form-group--${theme}`}
          >
            <label className={`login-card__label login-card__label--${theme}`}>
              {t("store_id")}
            </label>
            <input
              className={`login-card__input login-card__input--${theme}`}
              type="text"
              placeholder="e.g. royal-fabrics"
              value={credentials.storeId}
              onChange={(e) =>
                setCredentials({ ...credentials, storeId: e.target.value.toLowerCase().replace(/\s/g, "-") })
              }
              required
            />
          </div>

          <div
            className={`login-card__form-group login-card__form-group--${theme}`}
          >
            <label className={`login-card__label login-card__label--${theme}`}>
              {t("username")}
            </label>
            <input
              className={`login-card__input login-card__input--${theme}`}
              type="text"
              placeholder={t("enter_username")}
              value={credentials.username}
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value.toLowerCase().replace(/\s/g, "") })
              }
              required
            />
          </div>

          <div
            className={`login-card__form-group login-card__form-group--${theme}`}
          >
            <label className={`login-card__label login-card__label--${theme}`}>
              {t("password")}
            </label>
            <div className="login-card__input-wrapper">
              <input
                className={`login-card__input login-card__input--${theme}`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className={`login-card__password-toggle login-card__password-toggle--${theme}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`login-card__submit-btn ${
              !isFormValid || isSubmitting ? "login-card__submit-btn--disabled" : ""
            } login-card__submit-btn--${theme}`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? t("processing") || "Processing..." : t("secure_login")}
          </button>

          <footer className="login-card__footer">
            <button
              type="button"
              className={`login-card__signup-btn login-card__signup-btn--${theme}`}
              onClick={() => navigate("/signup")}
            >
              {t("dont_have_account")} {t("sign_up")}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
