import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImage from '../../assets/logo-kuwaitqumash.svg';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="welcome-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <img src={logoImage} alt="KuwaitQumash" className="welcome-logo-img-footer" />
            <p className="footer-tagline">{t('footer.tagline', 'Fabric store management for metered sales, rolls and customer accounts.')}</p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <h4>{t('footer.product', 'Product')}</h4>
              <ul>
                <li><a href="#features">{t('footer.features', 'Features')}</a></li>
                <li><a href="#pricing">{t('footer.pricing', 'Pricing')}</a></li>
                <li><a href="#security">{t('footer.security', 'Security')}</a></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4>{t('footer.company', 'Company')}</h4>
              <ul>
                <li><a href="#about">{t('footer.about', 'About Us')}</a></li>
                <li><Link to="/contact">{t('footer.contact', 'Contact')}</Link></li>
              </ul>
            </div>
            <div className="footer-links-col">
              <h4>{t('footer.legal', 'Legal')}</h4>
              <ul>
                <li><Link to="/privacy">{t('footer.privacy', 'Privacy Policy')}</Link></li>
                <li><Link to="/terms">{t('footer.terms', 'Terms of Service')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom">
          <p className="footer-copyright">© {new Date().getFullYear()} KuwaitQumash. {t('footer.rights', 'All rights reserved.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
