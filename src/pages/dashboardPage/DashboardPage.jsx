import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import OwnerDashboard from './OwnerDashboard';
import ManagerDashboard from './ManagerDashboard';
import SalesmanDashboard from './SalesmanDashboard';
import './DashboardPage.css';

const DashboardPage = () => {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const { user, loading } = useAuth();

    const userRole = user?.role;

    if (loading || !user) {
        return (
            <div className={`dashboard-loader dashboard-loader--${theme}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="dashboard-loader__spinner"></div>
                <span className="dashboard-loader__text">{t('loading')}...</span>
            </div>
        );
    }

    return (
        <div className={`dashboard-page dashboard-page--${theme}`} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
            {(() => {
                switch (userRole) {
                    case 'store_owner':
                        return <OwnerDashboard />;
                    case 'branch_manager':
                        return <ManagerDashboard />;
                    case 'sales_man':
                        return <SalesmanDashboard />;
                    default:
                        return (
                            <div className="dashboard-page__error">
                                <span className="dashboard-page__error-text">{t('access_denied')}: {t('unknown_role')}</span>
                            </div>
                        );
                }
            })()}
        </div>
    );
};

export default DashboardPage;
