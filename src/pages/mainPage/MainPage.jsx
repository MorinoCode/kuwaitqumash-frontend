import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useBranchStore from "../../store/branchStore";
import AddItemModal from "../../components/addItemModal/AddItemModal";
import "./MainPage.css";
import {
  ShoppingCart,
  Users,
  Package,
  BarChart2,
  Store,
  Calculator,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";

const MainPage = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeBranchId } = useBranchStore();
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const menuItems = [
    {
      category: "sales_operations",
      items: [
        {
          title: "new_sale",
          icon: ShoppingCart,
          link: "/sales",
          color: "primary",
          desc: "start_invoice",
        },
        {
          title: "customers",
          icon: Users,
          link: "/customers",
          color: "secondary",
          desc: "manage_crm",
        },
        {
          title: "gold_calculator",
          icon: Calculator,
          link: "/calculator",
          color: "success",
          desc: "quick_calc",
        },
        {
          title: "live_prices",
          icon: TrendingUp,
          link: "/prices",
          color: "accent",
          desc: "view_live_prices",
        },
      ],
    },
    {
      category: "inventory_stock",
      items: [
        {
          title: "inventory",
          icon: Package,
          link: "/inventory",
          color: "orange",
          desc: "view_stock",
        },
        {
          title: "add_item",
          icon: PlusCircle,
          link: null,
          color: "success",
          desc: "new_stock",
          isModal: true,
        },
        {
          title: "invoices",
          icon: FileText,
          link: "/invoices",
          color: "info",
          desc: "view_invoices",
        },
      ],
    },
    {
      category: "management",
      items: [
        {
          title: "dashboard",
          icon: BarChart2,
          link: "/dashboard",
          color: "accent",
          desc: "analytics_kpi",
        },
        {
          title: "manage",
          icon: Store,
          link: "/manage",
          color: "purple",
          desc: "manage_store_desc",
        },
      ],
    },
  ];

  const handleCardClick = (item) => {
    if (item.isModal && item.title === "add_item") {
      setIsAddItemModalOpen(true);
    } else if (item.link) {
      navigate(item.link);
    }
  };

  // Filter menu items based on user role
  const filteredMenuItems = menuItems
    .map((section) => {
      if (section.category === "management") {
        // Hide "manage" button for sales_man
        return {
          ...section,
          items: section.items.filter(
            (item) => !(item.title === "manage" && user?.role === "sales_man")
          ),
        };
      }
      return section;
    })
    .filter((section) => section.items.length > 0); // Hide empty sections

  return (
    <div
      className={`main-dashboard main-dashboard--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="main-dashboard__content">
        {/* Quick Actions */}
        {filteredMenuItems.map((section, idx) => (
          <section key={idx} className="main-dashboard__section">
            <h3 className="main-dashboard__section-title">
              {t(section.category)}
            </h3>
            <div className="main-dashboard__grid">
              {section.items.map((item, i) => (
                <article
                  key={i}
                  className={`dashboard-card dashboard-card--${item.color}`}
                  onClick={() => handleCardClick(item)}
                >
                  <div className="dashboard-card__icon-box">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <div className="dashboard-card__info">
                    <h4 className="dashboard-card__title">{t(item.title)}</h4>
                    <p className="dashboard-card__desc">{t(item.desc)}</p>
                  </div>
                  <div className="dashboard-card__action">
                    <ArrowRight size={18} />
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSuccess={() => {
          setIsAddItemModalOpen(false);
          // Optionally navigate to inventory page
          navigate("/inventory");
        }}
        activeBranchId={activeBranchId}
      />
    </div>
  );
};

export default MainPage;
