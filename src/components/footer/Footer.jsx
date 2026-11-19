import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import logoImage from '../../assets/logo1.png';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'dark';

  const handleBrandClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const handleSectionClick = (sectionId) => (e) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(`/?section=${sectionId}`);
    }
  };

  return (
    <footer className={`welcome-footer welcome-footer--${theme}`}>
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <button
              type="button"
              className="footer-brand-btn"
              onClick={handleBrandClick}
              title={t('home', 'خانه')}
              aria-label={t('app_title', 'KuwaitQumash')}
            >
              <img src={logoImage} alt="KuwaitQumash" className="welcome-logo-img-footer" />
            </button>
            <p className="footer-tagline">
              {t('footer.tagline', 'Fabric store management for metered sales, rolls and customer accounts.')}
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4>{t('footer.product', 'Product')}</h4>
              <ul>
                <li>
                  <button type="button" onClick={handleSectionClick('features')}>
                    {t('footer.features', 'Features')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleSectionClick('how')}>
                    {t('landing.nav_how', 'How It Works')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleSectionClick('pricing')}>
                    {t('footer.pricing', 'Pricing')}
                  </button>
                </li>
                <li>
                  <button type="button" onClick={handleSectionClick('faq')}>
                    {t('landing.nav_faq', 'FAQ')}
                  </button>
                </li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4>{t('footer.company', 'Company')}</h4>
              <ul>
                <li>
                  <Link to="/contact">{t('footer.contact', 'Contact')}</Link>
                </li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4>{t('footer.legal', 'Legal')}</h4>
              <ul>
                <li>
                  <Link to="/privacy">{t('footer.privacy', 'Privacy Policy')}</Link>
                </li>
                <li>
                  <Link to="/terms">{t('footer.terms', 'Terms of Service')}</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {new Date().getFullYear()} KuwaitQumash. {t('footer.rights', 'All rights reserved.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
