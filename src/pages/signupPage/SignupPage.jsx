import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import { useTheme } from "../../context/ThemeContext";
import { normalizeToLatinDigits } from "../../utils/normalizeNumbers.js";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import logoImage from "../../assets/logo-kuwaitqumash.svg";
import "./SignupPage.css";

const SignupPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    storeName: "",
    username: "",
    fullName: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [serverErrors, setServerErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const usernameRegex = useMemo(() => /^[a-zA-Z0-9_.-]+$/, []);
  const PASSWORD_MIN_LENGTH = 6;

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

  const localErrors = useMemo(() => {
    const newErrors = {};
    if (formData.password && formData.password.length < PASSWORD_MIN_LENGTH) {
      newErrors.password =
        t("password_min_length") ||
        `At least ${PASSWORD_MIN_LENGTH} characters.`;
    }
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        t("passwords_not_match") || "Passwords do not match.";
    }
    if (
      formData.username.trim() &&
      !usernameRegex.test(formData.username.trim())
    ) {
      newErrors.username =
        t("username_format") ||
        "Only letters, numbers, dots, dashes, underscores.";
    }
    if (formData.phone) {
      const digitsOnly = normalizeToLatinDigits(formData.phone).replace(
        /[^0-9+]/g,
        ""
      );
      if (digitsOnly.length < 8 || digitsOnly.length > 20) {
        newErrors.phone =
          t("phone_format") || "Phone must be 8–20 digits (e.g. 96512345678).";
      }
    }
    return newErrors;
  }, [formData, t, usernameRegex]);

  const errors = useMemo(() => ({ ...localErrors, ...serverErrors }), [localErrors, serverErrors]);

  const isFormValid = useMemo(() => {
    const digitsOnly = normalizeToLatinDigits(formData.phone || "").replace(
      /[^0-9+]/g,
      ""
    );
    return (
      Object.keys(localErrors).length === 0 &&
      formData.storeName.trim().length >= 3 &&
      formData.username.trim().length >= 3 &&
      usernameRegex.test(formData.username.trim()) &&
      formData.fullName.trim().length >= 3 &&
      digitsOnly.length >= 8 &&
      digitsOnly.length <= 20 &&
      formData.password.length >= PASSWORD_MIN_LENGTH &&
      formData.password === formData.confirmPassword &&
      !isSubmitting
    );
  }, [formData, localErrors, usernameRegex, isSubmitting]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name === "phone") {
      sanitizedValue = normalizeToLatinDigits(value).replace(/[^0-9+]/g, "");
    } else if (name === "username") {
      sanitizedValue = value.toLowerCase().replace(/\s/g, "");
    }
    setFormData({ ...formData, [name]: sanitizedValue });
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === "ar" ? "rtl" : "ltr";
    document.body.dir = lng === "ar" ? "rtl" : "ltr";
    document.body.classList.remove("font-arabic", "font-english");
    document.body.classList.add(lng === "ar" ? "font-arabic" : "font-english");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    const payload = {
      store_name: formData.storeName.trim().toLowerCase(),
      username: formData.username.trim().toLowerCase(),
      owner_name: formData.fullName.trim(),
      phone: formData.phone,
      password: formData.password,
    };

    try {
      const res = await api.post("/platform/register", payload);

      const tenantId = res.data.tenant_id;

      toast.success(
        t("store_registered_success", { tenantId }) ||
          `Store Registered! Your ID: ${tenantId}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: theme === "dark" ? "dark" : "light",
        }
      );

      setTimeout(() => {
        navigate("/login", { state: { tenantId } });
      }, 5500);
    } catch (err) {
      const data = err.response?.data;
      const serverMessage =
        data?.message || t("registration_failed") || "Registration failed.";

      if (
        err.response?.status === 400 &&
        data?.errors &&
        Array.isArray(data.errors)
      ) {
        const fieldMap = {
          store_name: "storeName",
          owner_name: "fullName",
          username: "username",
          phone: "phone",
          password: "password",
        };
        const serverErrors = {};
        data.errors.forEach((e) => {
          const path = e.path?.[0] ?? e.path;
          const field = fieldMap[path] || path;
          if (field && e.message) serverErrors[field] = e.message;
        });
        setServerErrors((prev) => ({ ...prev, ...serverErrors }));
      }

      toast.error(serverMessage, {
        position: "top-center",
        autoClose: 5000,
        theme: theme === "dark" ? "dark" : "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`signup-page signup-page--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div
        className="signup-page__logo-link"
        onClick={() => navigate("/")}
      >
        <img
          src={logoImage}
          alt={t("app_title") || "KuwaitQumash"}
          className="signup-page__top-logo"
        />
      </div>

      <div className={`signup-page__controls signup-page__controls--${theme}`}>

        <button
          type="button"
          className={`signup-page__theme-btn signup-page__theme-btn--${theme}`}
          onClick={toggleTheme}
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
          title={theme === "dark" ? t("light_mode") : t("dark_mode")}
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div
          className={`signup-page__language-selector signup-page__language-selector--${theme}`}
        >
          <button
            type="button"
            className={`signup-page__lang-btn ${
              i18n.language === "fa" ? "signup-page__lang-btn--active" : ""
            } signup-page__lang-btn--${theme}`}
            onClick={() => changeLanguage("fa")}
          >
            FA
          </button>
          <button
            type="button"
            className={`signup-page__lang-btn ${
              i18n.language === "en" ? "signup-page__lang-btn--active" : ""
            } signup-page__lang-btn--${theme}`}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
          <button
            type="button"
            className={`signup-page__lang-btn ${
              i18n.language === "ar" ? "signup-page__lang-btn--active" : ""
            } signup-page__lang-btn--${theme}`}
            onClick={() => changeLanguage("ar")}
          >
            AR
          </button>
        </div>
      </div>

      <div className={`signup-card signup-card--${theme}`}>
        <header className={`signup-card__header`}>
          <div
            className="signup-card__logo-wrapper"
            onClick={() => navigate("/")}
          >
            <img
              src={logoImage}
              alt={t("app_title") || "KuwaitQumash"}
              className="signup-card__logo"
            />
          </div>
          <p
            className={`signup-card__subtitle signup-card__subtitle--${theme}`}
          >
            {t("register_store_kuwait") || "REGISTER YOUR FABRIC STORE IN KUWAIT"}
          </p>
        </header>

        <form className={`signup-card__form`} onSubmit={handleSubmit}>
          <div
            className={`signup-card__form-group signup-card__form-group--full`}
          >
            <label
              className={`signup-card__label signup-card__label--${theme}`}
            >
              {t("store_name") || "Store Name"}
            </label>
            <input
              name="storeName"
              className={`signup-card__input signup-card__input--${theme}`}
              type="text"
              placeholder={t("store_name_placeholder") || "e.g. Al-Baraka Fabrics"}
              value={formData.storeName}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </div>

          <div className={`signup-card__form-group`}>
            <label
              className={`signup-card__label signup-card__label--${theme}`}
            >
              {t("owner_name") || "Owner Name"}
            </label>
            <input
              name="fullName"
              className={`signup-card__input signup-card__input--${theme}`}
              type="text"
              placeholder={t("full_name") || "Full Name"}
              value={formData.fullName}
              onChange={handleInputChange}
              required
              maxLength={100}
            />
          </div>

          <div className={`signup-card__form-group`}>
            <label
              className={`signup-card__label signup-card__label--${theme}`}
            >
              {t("admin_username") || "Admin Username"}
            </label>
            <input
              name="username"
              className={`signup-card__input ${
                errors.username ? "signup-card__input--error" : ""
              } signup-card__input--${theme}`}
              type="text"
              placeholder={
                t("username") || "Username (letters, numbers, . - _)"
              }
              value={formData.username}
              onChange={handleInputChange}
              required
              maxLength={50}
            />
            {errors.username && (
              <span
                className={`signup-card__error-msg signup-card__error-msg--${theme}`}
              >
                {errors.username}
              </span>
            )}
          </div>

          <div className={`signup-card__form-group`}>
            <label
              className={`signup-card__label signup-card__label--${theme}`}
            >
              {t("phone") || "Phone Number"}
            </label>
            <input
              name="phone"
              className={`signup-card__input ${
                errors.phone ? "signup-card__input--error" : ""
              } signup-card__input--${theme}`}
              type="tel"
              placeholder={t("phone_placeholder") || "e.g. 96512345678"}
              value={formData.phone}
              onChange={handleInputChange}
              required
              maxLength={20}
            />
            {errors.phone && (
              <span
                className={`signup-card__error-msg signup-card__error-msg--${theme}`}
              >
                {errors.phone}
              </span>
            )}
          </div>

          <div className={`signup-card__form-group`}>
            <label
              className={`signup-card__label signup-card__label--${theme}`}
            >
              {t("password") || "Password"}
            </label>
            <div className="signup-card__input-wrapper">
              <input
                name="password"
                className={`signup-card__input ${
                  errors.password ? "signup-card__input--error" : ""
                } signup-card__input--${theme}`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                maxLength={200}
              />
              <button
                type="button"
                className={`signup-card__password-toggle signup-card__password-toggle--${theme}`}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span
                className={`signup-card__error-msg signup-card__error-msg--${theme}`}
              >
                {errors.password}
              </span>
            )}
          </div>

          <div className={`signup-card__form-group`}>
            <label
              className={`signup-card__label signup-card__label--${theme}`}
            >
              {t("confirm_password") || "Confirm Password"}
            </label>
            <div className="signup-card__input-wrapper">
              <input
                name="confirmPassword"
                className={`signup-card__input ${
                  errors.confirmPassword ? "signup-card__input--error" : ""
                } signup-card__input--${theme}`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                maxLength={200}
              />
              <button
                type="button"
                className={`signup-card__password-toggle signup-card__password-toggle--${theme}`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span
                className={`signup-card__error-msg signup-card__error-msg--${theme}`}
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>

          <button
            type="submit"
            className={`signup-card__submit-btn ${
              !isFormValid || isSubmitting ? "signup-card__submit-btn--disabled" : ""
            } signup-card__submit-btn--${theme}`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? t("processing") || "Processing..." : t("create_account") || "CREATE ACCOUNT"}
          </button>

          <footer className={`signup-card__footer`}>
            <span
              className={`signup-card__footer-text signup-card__footer-text--${theme}`}
            >
              {t("already_have_account") || "Already have an account? "}
            </span>
            <button
              type="button"
              className={`signup-card__link-btn signup-card__link-btn--${theme}`}
              onClick={() => navigate("/login")}
            >
              {t("login") || "LOGIN"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
