import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { removeStorageItem } from "../../utils/storage";
import useBranchStore from "../../store/branchStore";
import useTenantStore from "../../store/tenantStore";
import { useBranches } from "../../hooks/useBranches";
import "./Sidebar.css";
import {
  Home, LayoutDashboard, Package, ShoppingCart, Layers, Store, ChevronDown,
  Users, X, Settings, Check, FileText, RotateCcw
} from "lucide-react";

const Sidebar = ({ closeSidebar }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { activeBranchId, setActiveBranch, validateBranch } = useBranchStore();
  const { clearTenant } = useTenantStore();

  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  const activeStore = branches.find(b => b.id === activeBranchId) || null;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRes = await api.get('/auth/me');
        const user = userRes.data.data || userRes.data;
        setCurrentUser(user);
      } catch (err) {

        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          return;
        }

        if (err.response?.status === 400) {
          const errorMessage = err.response.data?.message || '';
          if (errorMessage.includes('tenant') || errorMessage.includes('Tenant')) {
            clearTenant();
            useBranchStore.getState().clearBranch();
            removeStorageItem('token');
            removeStorageItem('authToken');
            navigate('/login', { replace: true });
            return;
          }
        }

        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          clearTenant();
          useBranchStore.getState().clearBranch();
          removeStorageItem('token');
          removeStorageItem('authToken');
          navigate('/login', { replace: true });
        }
      }
    };

    fetchUser();
  }, [navigate, clearTenant]);

  useEffect(() => {
    if (!branchesLoading && branches.length > 0 && currentUser) {

      if (activeBranchId) {
        validateBranch(activeBranchId, api).then(isValid => {
          if (!isValid) {

            const defaultBranch = branches.find(b => b.is_main) || branches[0];
            setActiveBranch(defaultBranch);
          }
        });
      } else {

        const defaultBranch = branches.find(b => b.is_main) || branches[0];
        setActiveBranch(defaultBranch);
      }
    }
  }, [branches, branchesLoading, activeBranchId, currentUser, validateBranch, setActiveBranch]);

  const handleSwitchBranch = (branch) => {
    setActiveBranch(branch);
    setIsStoreMenuOpen(false);

    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    const handleBranchChange = () => {

    };

    window.addEventListener('branchChanged', handleBranchChange);
    return () => window.removeEventListener('branchChanged', handleBranchChange);
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const getAvatarColor = (name) => {
      const colors = ['#D4AF37', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#db2777'];
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
  };

  const isActive = (path) => location.pathname === path ? "sidebar__nav-item--active" : "";
  const canSwitchBranch = currentUser?.role === 'store_owner';

  return (
    <aside className={`sidebar-inner sidebar-inner--${theme}`} dir={document.documentElement.dir || 'ltr'}>
      <div className="sidebar__header-row">
        <div className={`sidebar__logo sidebar__logo--${theme}`}>
          <Layers className="sidebar__logo-icon" size={28} />
          <span
            className="sidebar__logo-text"
            onClick={() => navigate('/home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/home');
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            KuwaitQumash
          </span>
        </div>
        <button
          className="sidebar__close-btn"
          onClick={closeSidebar}
          aria-label={t('close') || 'Close'}
          title={t('close') || 'Close'}
        >
          <X size={24} />
        </button>
      </div>

      {currentUser && (
         <div className={`sidebar__user-profile sidebar__user-profile--${theme}`}>
            <div
                className="sidebar__user-avatar-circle"
                style={{ backgroundColor: getAvatarColor(currentUser.full_name || 'User') }}
            >
                {getInitials(currentUser.full_name)}
            </div>
            <div className="sidebar__user-text">
                <span className="sidebar__user-name">{currentUser.full_name}</span>
                <span className="sidebar__user-role-badge">
                    {currentUser.role.replace('_', ' ').toUpperCase()}
                </span>
            </div>
         </div>
      )}

      <div className="sidebar__branch-section">
        <label className="sidebar__label">{t('current_branch')}</label>
        <div
          className={`sidebar__branch-selector sidebar__branch-selector--${theme} ${!canSwitchBranch ? 'disabled' : ''}`}
          onClick={() => canSwitchBranch && setIsStoreMenuOpen(!isStoreMenuOpen)}
          role={canSwitchBranch ? "button" : "text"}
          aria-label={canSwitchBranch ? t('select_branch') || 'Select branch' : t('current_branch') || 'Current branch'}
          aria-expanded={canSwitchBranch ? isStoreMenuOpen : undefined}
          tabIndex={canSwitchBranch ? 0 : -1}
          onKeyDown={(e) => {
            if (canSwitchBranch && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              setIsStoreMenuOpen(!isStoreMenuOpen);
            }
          }}
        >
          <div className="sidebar__branch-info">
            <div className={`sidebar__branch-icon-bg ${activeStore?.is_main ? 'main-branch-icon' : ''}`}>
              <Store size={18} />
            </div>
            <div className="sidebar__branch-details">
              <span className="sidebar__branch-name">
                {activeStore ? activeStore.name : t('loading', 'Loading...')}
              </span>
            </div>
          </div>
          {canSwitchBranch && <ChevronDown size={16} className="rtl-flip" />}
        </div>

        {isStoreMenuOpen && canSwitchBranch && (
          <div className={`branch-dropdown branch-dropdown--${theme}`}>
            {branches.map(branch => (
              <div
                key={branch.id}
                className={`branch-item ${branch.id === activeStore?.id ? 'active' : ''}`}
                onClick={() => handleSwitchBranch(branch)}
                role="button"
                aria-label={`${t('switch_to_branch') || 'Switch to branch'}: ${branch.name}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSwitchBranch(branch);
                  }
                }}
              >
                <div className="branch-info">
                  <span className="branch-name">{branch.name}</span>
                  {branch.is_main && <span className="badge-hq">HQ</span>}
                </div>
                {branch.id === activeStore?.id && <Check size={14} className="check-icon"/>}
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="sidebar__nav">
        <Link
          to="/home"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/home")}`}
          onClick={closeSidebar}
          aria-label={t('home') || 'Home'}
          aria-current={isActive("/home") ? 'page' : undefined}
        >
          <Home size={20} /> <span>{t('home')}</span>
        </Link>
        <Link
          to="/dashboard"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/dashboard")}`}
          onClick={closeSidebar}
          aria-label={t('dashboard') || 'Dashboard'}
          aria-current={isActive("/dashboard") ? 'page' : undefined}
        >
          <LayoutDashboard size={20} /> <span>{t('dashboard')}</span>
        </Link>
        <Link
          to="/inventory"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/inventory")}`}
          onClick={closeSidebar}
          aria-label={t('inventory') || 'Inventory'}
          aria-current={isActive("/inventory") ? 'page' : undefined}
        >
          <Package size={20} /> <span>{t('inventory')}</span>
        </Link>
        <Link
          to="/sales"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/sales")}`}
          onClick={closeSidebar}
          aria-label={t('sales') || 'Sales'}
          aria-current={isActive("/sales") ? 'page' : undefined}
        >
          <ShoppingCart size={20} /> <span>{t('sales')}</span>
        </Link>
        <Link
          to="/invoices"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/invoices")}`}
          onClick={closeSidebar}
          aria-label={t('invoices') || 'Invoices'}
          aria-current={isActive("/invoices") ? 'page' : undefined}
        >
          <FileText size={20} /> <span>{t('invoices')}</span>
        </Link>
        <Link
          to="/refunds"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/refunds") || isActive("/refund")}`}
          onClick={closeSidebar}
          aria-label={t('refunds') || 'Refunds'}
          aria-current={isActive("/refunds") || isActive("/refund") ? 'page' : undefined}
        >
          <RotateCcw size={20} /> <span>{t('refunds') || 'Refunds'}</span>
        </Link>
        <Link
          to="/customers"
          className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/customers")}`}
          onClick={closeSidebar}
          aria-label={t('customers') || 'Customers'}
          aria-current={isActive("/customers") ? 'page' : undefined}
        >
          <Users size={20} /> <span>{t('customers')}</span>
        </Link>
        {currentUser?.role !== 'sales_man' && (
          <Link
            to="/manage"
            className={`sidebar__nav-item sidebar__nav-item--${theme} ${isActive("/manage")}`}
            onClick={closeSidebar}
            aria-label={t('manage') || 'Manage'}
            aria-current={isActive("/manage") ? 'page' : undefined}
          >
            <Settings size={20} /> <span>{t('manage')}</span>
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
