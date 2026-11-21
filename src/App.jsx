import React, { useEffect, lazy, Suspense } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { BranchProvider } from "./context/BranchContext";
import MainLayout from "./components/layout/mainLayout/MainLayout";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary";
import { useTranslation } from "react-i18next";

const WelcomePage = lazy(() => import("./pages/welcomePage/WelcomePage"));
const LoginPage = lazy(() => import("./pages/loginPage/LoginPage"));
const MainPage = lazy(() => import("./pages/mainPage/MainPage"));
const DashboardPage = lazy(() => import("./pages/dashboardPage/DashboardPage"));
const InventoryPage = lazy(() => import("./pages/inventoryPage/InventoryPage"));
const SalesPage = lazy(() => import("./pages/salesPage/SalesPage"));
const CustomersPage = lazy(() => import("./pages/customersPage/CustomersPage"));
const ManagePage = lazy(() => import("./pages/managePage/ManagePage"));
const ItemDetailsPage = lazy(
  () => import("./pages/itemDetailsPage/ItemDetailsPage"),
);
const StaffDetailsPage = lazy(
  () => import("./pages/staffDetailsPage/StaffDetailsPage"),
);
const BranchDetailPage = lazy(
  () => import("./pages/branchDetailPage/BranchDetailPage"),
);
const CustomerDetailsPage = lazy(
  () => import("./pages/customerDetailPage/CustomerDetailPage"),
);
const InvoicesPage = lazy(() => import("./pages/invoicesPage/InvoicesPage"));
const RefundPage = lazy(() => import("./pages/refundPage/RefundPage"));
const RefundsPage = lazy(() => import("./pages/refundsPage/RefundsPage"));
const ContactPage = lazy(() => import("./pages/contactPage/ContactPage"));
const LegalPage = lazy(() => import("./pages/legalPage/LegalPage"));

function RouteFallback() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        color: "var(--text, #333)",
      }}
    >
      <div className="app-route-loader" />
      <span style={{ marginLeft: 10 }}>Loading...</span>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const isRtl = i18n.language === "ar" || i18n.language === "fa";
    document.documentElement.lang = i18n.language;
    document.dir = isRtl ? "rtl" : "ltr";
    document.body.dir = isRtl ? "rtl" : "ltr";

    document.body.classList.remove("font-arabic", "font-english", "font-persian");
    document.body.classList.add(
      i18n.language === "fa"
        ? "font-persian"
        : i18n.language === "ar"
          ? "font-arabic"
          : "font-english",
    );
  }, [i18n.language]);

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <BranchProvider>
            <ToastContainer
              position="top-center"
              autoClose={4000}
              hideProgressBar={false}
              theme="colored"
            />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <ErrorBoundary>
                      <LoginPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/signup"
                  element={<Navigate to="/contact" replace />}
                />

                <Route
                  element={
                    <ErrorBoundary>
                      <MainLayout />
                    </ErrorBoundary>
                  }
                >
                  <Route
                    path="/dashboard"
                    element={
                      <ErrorBoundary>
                        <DashboardPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/analytics"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route
                    path="/home"
                    element={
                      <ErrorBoundary>
                        <MainPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/inventory"
                    element={
                      <ErrorBoundary>
                        <InventoryPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/inventory/item/:id"
                    element={
                      <ErrorBoundary>
                        <ItemDetailsPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/sales"
                    element={
                      <ErrorBoundary>
                        <SalesPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/customers"
                    element={
                      <ErrorBoundary>
                        <CustomersPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/customers/:id"
                    element={
                      <ErrorBoundary>
                        <CustomerDetailsPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/manage"
                    element={
                      <ErrorBoundary>
                        <ManagePage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/manage/branch/:id"
                    element={
                      <ErrorBoundary>
                        <BranchDetailPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/manage/staff/:id"
                    element={
                      <ErrorBoundary>
                        <StaffDetailsPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/invoices"
                    element={
                      <ErrorBoundary>
                        <InvoicesPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/refund"
                    element={
                      <ErrorBoundary>
                        <RefundPage />
                      </ErrorBoundary>
                    }
                  />
                  <Route
                    path="/refunds"
                    element={
                      <ErrorBoundary>
                        <RefundsPage />
                      </ErrorBoundary>
                    }
                  />
                </Route>

                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <WelcomePage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <ErrorBoundary>
                      <ContactPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/privacy"
                  element={
                    <ErrorBoundary>
                      <LegalPage doc="privacy" />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/terms"
                  element={
                    <ErrorBoundary>
                      <LegalPage doc="terms" />
                    </ErrorBoundary>
                  }
                />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
          </BranchProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
