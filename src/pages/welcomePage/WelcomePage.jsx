import React, { useEffect, useState } from 'react';
import logoImage from '../../assets/logo-kuwaitqumash.svg';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Diamond, TrendingUp, Users, Shield, ArrowRight, Languages, Check, HelpCircle } from 'lucide-react';
import Footer from '../../components/footer/Footer';
import './WelcomePage.css';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    const currentLang = i18n.language || 'en';
    document.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.remove('font-arabic', 'font-english');
    document.body.classList.add(currentLang === 'ar' ? 'font-arabic' : 'font-english');
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const fadeUpVariant = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 60, damping: 15 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const scaleInVariant = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const slideInLeft = {
    hidden: { x: -60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  const slideInRight = {
    hidden: { x: 60, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 15 }
    }
  };

  const stats = [
    { value: '99.9%', label: t('welcome.stats.uptime', 'Platform Uptime') },
    { value: '10K+', label: t('welcome.stats.invoices', 'Invoices Processed') },
    { value: '500+', label: t('welcome.stats.stores', 'Active Store Branches') },
    { value: 'Live', label: t('welcome.stats.live', 'Kuwait Market Feed') }
  ];

  const pricingPlans = [
    {
      name: t('welcome.pricing.basic_name', 'Starter'),
      price: t('welcome.pricing.basic_price', 'Free'),
      period: t('welcome.pricing.basic_period', 'forever'),
      desc: t('welcome.pricing.basic_desc', 'For single boutique gold stores getting started.'),
      features: [
        t('welcome.pricing.feat_1', '1 Branch & 2 Staff Members'),
        t('welcome.pricing.feat_2', 'Basic Gold Inventory Tracking'),
        t('welcome.pricing.feat_3', 'Standard Invoicing & Sales'),
        t('welcome.pricing.feat_4', 'Live Market Rates (Kuwait Gold Market)')
      ],
      cta: t('welcome.pricing.cta_free', 'Start Free'),
      popular: false
    },
    {
      name: t('welcome.pricing.pro_name', 'Professional'),
      price: '49 KWD',
      period: t('welcome.pricing.pro_period', 'per month'),
      desc: t('welcome.pricing.pro_desc', 'Perfect for growing jewelry networks and multi-branch retailers.'),
      features: [
        t('welcome.pricing.feat_5', 'Unlimited Branches & Staff'),
        t('welcome.pricing.feat_6', 'AI-Powered Customer Insights & CRM'),
        t('welcome.pricing.feat_7', 'WhatsApp Invoice Integration'),
        t('welcome.pricing.feat_8', 'Advanced Analytics & Excel Reports'),
        t('welcome.pricing.feat_9', 'Barcode Printing & Camera Scanning')
      ],
      cta: t('welcome.pricing.cta_pro', 'Get Pro Access'),
      popular: true
    },
    {
      name: t('welcome.pricing.enterprise_name', 'Enterprise'),
      price: t('welcome.pricing.enterprise_price', 'Custom'),
      period: '',
      desc: t('welcome.pricing.enterprise_desc', 'Tailored systems for large-scale jewelry groups and manufacturers.'),
      features: [
        t('welcome.pricing.feat_10', 'Dedicated Database Server'),
        t('welcome.pricing.feat_11', 'Custom ERP & POS Integrations'),
        t('welcome.pricing.feat_12', '24/7 Priority VIP Support'),
        t('welcome.pricing.feat_13', 'On-site Staff Training')
      ],
      cta: t('welcome.pricing.cta_contact', 'Contact Sales'),
      popular: false
    }
  ];

  const faqs = [
    {
      q: t('welcome.faq.q1', 'How does the live gold price calculation work?'),
      a: t('welcome.faq.a1', 'KuwaitQumash syncs directly with the Kuwait Gold Market in real-time. When creating an invoice, the system automatically fetches the latest live price for 24K, 22K, 21K, and 18K gold to calculate the exact item value instantly.')
    },
    {
      q: t('welcome.faq.q2', 'Can I manage multiple branches from a single dashboard?'),
      a: t('welcome.faq.a2', 'Yes. The Store Owner dashboard allows you to monitor and manage all branches, analyze branch-specific sales trends, allocate inventory, and view aggregate store metrics in one central location.')
    },
    {
      q: t('welcome.faq.q3', 'Is my store\'s data secure?'),
      a: t('welcome.faq.a3', 'Absolutely. All data is encrypted during transmission and stored securely in Google Cloud. We run automated, continuous backups to ensure your business information is never lost.')
    },
    {
      q: t('welcome.faq.q4', 'Does the app support barcode printing and scanning?'),
      a: t('welcome.faq.a4', 'Yes. You can generate and print professional barcodes for all items. Staff can scan barcodes using standard usb scanners or directly using the device camera for fast checkouts.')
    }
  ];

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="welcome-wrapper" dir={isRtl ? 'rtl' : 'ltr'}>
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
          <button className="nav-btn-lang" onClick={toggleLanguage} title={i18n.language === 'en' ? 'العربية' : 'English'}>
            <Languages size={20} />
            <span>{i18n.language === 'en' ? 'AR' : 'EN'}</span>
          </button>
          <button className="nav-btn-text" onClick={() => navigate('/login')}>
            {t('welcome.login', 'Sign In')}
          </button>
          <button className="nav-btn-gold" onClick={() => navigate('/signup')}>
            {t('welcome.signup', 'Get Started')}
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
              {t('welcome.badge', 'The #1 Jewelry Management Platform')}
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="hero-title">
              {t('welcome.hero_title', 'Elevate Your Jewelry')}{' '}
              <span className="text-gradient-gold">{t('welcome.hero_highlight', 'Business')}</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="hero-subtitle">
              {t('welcome.hero_desc', 'A complete ecosystem to manage your gold inventory, track daily sales, and connect with your customers seamlessly.')}
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="hero-actions">
              <button className="btn-gold-large" onClick={() => navigate('/signup')}>
                {t('welcome.start_now', 'Start Your Journey')}
                <ArrowRight size={20} className={isRtl ? 'rotate-180' : ''} />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-image-container"
            variants={scaleInVariant}
            initial="hidden"
            animate="visible"
          >
            <div className="hero-image-glow"></div>
            <motion.img 
              src={logoImage} 
              alt="KuwaitQumash Logo" 
              className="hero-logo-large"
              animate={{ 
                y: [0, -15, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
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
            {t('welcome.features_title_white', 'Everything You')}{' '}
            <span className="text-gradient-gold">{t('welcome.features_title_gold', 'Need')}</span>
          </h2>
          <p className="section-subtitle">{t('welcome.features_desc', 'Powerful tools designed specifically for modern jewelry stores.')}</p>
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
              <span className="showcase-tag">{t('showcase.ai_tag', 'AI-Driven Store Optimization')}</span>
              <h3 className="showcase-title">
                {t('showcase.ai_title_white', 'AI Analytics &')}{' '}
                <span className="text-gradient-gold">{t('showcase.ai_title_gold', 'Sales Reports')}</span>
              </h3>
              <p className="showcase-desc">{t('showcase.ai_desc', 'Our platform performs deep AI-driven analysis of your sales transactions, generating automated predictions, identifying top performers, and exporting comprehensive reports on demand.')}</p>
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
              <span className="kqirat-tag">{t('welcome.kqirat_tag', 'Tailored for Kuwait')}</span>
              <h2 className="kqirat-title">
                {t('welcome.kqirat_title_white', 'Built for the Kuwaiti')}{' '}
                <span className="text-gradient-gold">{t('welcome.kqirat_title_gold', 'Gold Standard')}</span>
              </h2>
              <p className="kqirat-text">
                {t('welcome.kqirat_desc', 'KuwaitQumash is a specialized ecosystem designed to meet the strict demands of Kuwait\'s luxury jewelry industry. From automated Civil ID customer registrations to live feeds directly integrated with the official Kuwait Gold Market, we ensure your store remains fully compliant, secure, and ready for high-volume transactions.')}
              </p>
              <div className="kqirat-features-row">
                <div className="kqirat-feat-item">
                  <span className="kqirat-feat-num">24K - 18K</span>
                  <span className="kqirat-feat-lbl">{t('welcome.kqirat_feat1', 'Full Karat Support')}</span>
                </div>
                <div className="kqirat-feat-item">
                  <span className="kqirat-feat-num">Live KWD</span>
                  <span className="kqirat-feat-lbl">{t('welcome.kqirat_feat2', 'Official Market Rates')}</span>
                </div>
                <div className="kqirat-feat-item">
                  <span className="kqirat-feat-num">Civil ID</span>
                  <span className="kqirat-feat-lbl">{t('welcome.kqirat_feat3', 'Kuwait Legal Compliance')}</span>
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
              <span className="showcase-tag">{t('showcase.control_tag', 'Total Visibility')}</span>
              <h3 className="showcase-title">
                {t('showcase.control_title_white', 'Modern Real-time')}{' '}
                <span className="text-gradient-gold">{t('showcase.control_title_gold', 'Dashboard')}</span>
              </h3>
              <p className="showcase-desc">{t('showcase.control_desc', 'Experience a modern, clean, and intuitive design that gives you complete control over your entire business operations. Monitor live gold rates, inventory status, and staff performance effortlessly.')}</p>
            </div>
          </motion.div>
        </div>
      </section>



      <section className="pricing-section" id="pricing">
        <div className="pricing-header">
          <h2 className="section-title">
            {t('welcome.pricing.title_white', 'Simple, Transparent')}{' '}
            <span className="text-gradient-gold">{t('welcome.pricing.title_gold', 'Pricing')}</span>
          </h2>
          <p className="section-subtitle">{t('welcome.pricing.subtitle', 'Choose the plan that fits your business needs.')}</p>
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
              className={`pricing-card ${plan.popular ? 'pricing-card-popular' : ''}`}
              variants={fadeUpVariant}
            >
              {plan.popular && <div className="popular-badge">{t('welcome.pricing.popular', 'Most Popular')}</div>}
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
                className={`plan-cta-btn ${plan.popular ? 'btn-gold-solid' : 'btn-outline'}`}
                onClick={() => navigate('/signup')}
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
            {t('welcome.faq.title_white', 'Frequently Asked')}{' '}
            <span className="text-gradient-gold">{t('welcome.faq.title_gold', 'Questions')}</span>
          </h2>
          <p className="section-subtitle">{t('welcome.faq.subtitle', 'Find answers to common questions about KuwaitQumash.')}</p>
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
              className={`faq-item ${activeFaq === idx ? 'faq-item-active' : ''}`}
              onClick={() => toggleFaq(idx)}
              variants={fadeUpVariant}
            >
              <div className="faq-question-row">
                <span className="faq-question">{faq.q}</span>
                <HelpCircle size={20} className="faq-icon" />
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
            {t('welcome.cta_title_white', 'Ready to transform your')}{' '}
            <span className="text-gradient-gold">{t('welcome.cta_title_gold', 'store?')}</span>
          </h2>
          <p>{t('welcome.cta_desc', 'Join KuwaitQumash today and take control of your business.')}</p>
          <button className="btn-gold-solid" onClick={() => navigate('/signup')}>
            {t('welcome.create_account', 'Create Free Account')}
          </button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default WelcomePage;
