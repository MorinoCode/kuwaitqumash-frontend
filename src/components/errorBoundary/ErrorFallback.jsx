import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, RefreshCw, Home, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import './ErrorBoundary.css';

function ErrorFallback({ error, resetErrorBoundary }) {
  const { t, i18n } = useTranslation();
  const [showDetails, setShowDetails] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);
  const theme = typeof localStorage !== 'undefined' ? (localStorage.getItem('app_theme') || 'dark') : 'dark';
  const dir = i18n?.language === 'ar' || i18n?.language === 'fa' ? 'rtl' : 'ltr';

  const handleGoHome = () => {
    resetErrorBoundary();
    if (typeof window !== 'undefined') window.location.href = '/dashboard';
  };

  const handleReportError = async () => {
    if (reported || isReporting) return;
    setIsReporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setReported(true);
      toast.success(t('error_reported_successfully') || 'Error reported successfully');
    } catch {
      toast.error(t('error_reporting_failed') || 'Failed to report error');
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className={`error-fallback error-fallback--${theme}`} dir={dir} role="alert">
      <div className="error-fallback__card">
        <div className="error-fallback__icon">
          <AlertTriangle size={48} strokeWidth={1.5} />
        </div>
        <h2 className="error-fallback__title">
          {t('error_boundary_title') || 'Something went wrong'}
        </h2>
        <p className="error-fallback__message">
          {t('error_boundary_message') || 'An unexpected error occurred. You can try again or go back to the dashboard.'}
        </p>
        <div className="error-fallback__actions">
          <button
            type="button"
            className="error-fallback__btn error-fallback__btn--primary"
            onClick={resetErrorBoundary}
          >
            <RefreshCw size={18} />
            {t('error_boundary_retry') || 'Retry'}
          </button>
          <button
            type="button"
            className="error-fallback__btn error-fallback__btn--secondary"
            onClick={handleGoHome}
          >
            <Home size={18} />
            {t('back_to_dashboard') || 'Back to Dashboard'}
          </button>
          <button
            type="button"
            className="error-fallback__btn error-fallback__btn--secondary"
            onClick={handleReportError}
            disabled={isReporting || reported}
          >
            <Send size={18} />
            {isReporting
              ? (t('reporting') || 'Reporting...')
              : reported
              ? (t('reported') || 'Reported')
              : (t('report_error') || 'Report')}
          </button>
        </div>
        {error && (
          <div className="error-fallback__details">
            <button
              type="button"
              className="error-fallback__details-toggle"
              onClick={() => setShowDetails((s) => !s)}
            >
              {showDetails ? (t('error_boundary_hide_details') || 'Hide details') : (t('error_boundary_show_details') || 'Show details')}
            </button>
            {showDetails && (
              <pre className="error-fallback__pre">
                {error.toString()}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ErrorFallback;
