import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useBranchStore from "../../store/branchStore";
import useSaleDraftStore from "../../store/saleDraftStore";
import { useCreateSale, useSendInvoiceWhatsApp } from "../../hooks/useInvoices";
import {
  useCustomers,
  useCreateCustomer,
} from "../../hooks/useCustomers";
import { useInventory } from "../../hooks/useInventory";
import BarcodeScanner from "../../components/barcodeScanner/BarcodeScanner";
import CustomerSelector from "../../components/sales/CustomerSelector";
import ItemSelector from "../../components/sales/ItemSelector";
import Cart from "../../components/sales/Cart";
import PaymentForm from "../../components/sales/PaymentForm";
import InvoicePreviewModal from "../../components/sales/InvoicePreviewModal";
import CustomerFormModal from "../../components/sales/CustomerFormModal";
import "./SalesPage.css";
import "../inventoryPage/InventoryPage.css";
import { ShoppingCart, CheckCircle, Loader } from "lucide-react";
import AddItemModal from "../../components/addItemModal/AddItemModal";
import {
  computeLineTotal,
  useSalesPayments,
  openInvoicePdfInBrowser,
} from "./useSalesPayments";


const SalesPage = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  const { activeBranchId } = useBranchStore();

  const [customerSearch, setCustomerSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [showCustDropdown, setShowCustDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const { data: customersData } = useCustomers({
    search: customerSearch.trim() ? customerSearch.trim() : undefined,
    branch_id: activeBranchId,
  });
  const customersList = customersData?.data || [];

  const { data: inventoryData } = useInventory({
    search: itemSearch.trim() ? itemSearch.trim() : undefined,
    branch_id: activeBranchId,
  });

  const inventoryList = useMemo(
    () => (inventoryData?.data || []).filter((i) => i.status === "In Stock"),
    [inventoryData?.data],
  );

  const createCustomerMutation = useCreateCustomer();
  const sendInvoiceWhatsAppMutation = useSendInvoiceWhatsApp();

  const defaultPayments = useMemo(
    () => [{ method: "K-Net", amount: "", reference: "" }],
    [],
  );
  const [draftHydrated, setDraftHydrated] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  const [payments, setPayments] = useState(defaultPayments);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastInvoice, setLastInvoice] = useState(null);
  const [waConnected, setWaConnected] = useState(false);
  const [printPdfLoading, setPrintPdfLoading] = useState(false);
  const [waStep, setWaStep] = useState(null);
  const [waCustomPhone, setWaCustomPhone] = useState("");
  const [waSending, setWaSending] = useState(false);

  const itemInputRef = useRef(null);

  const createSaleMutation = useCreateSale();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    gender: "M",
    address: "",
    type: "Regular",
    notes: "",
  });

  useEffect(() => {
    if (!activeBranchId) return;
    const draft = useSaleDraftStore.getState().getDraft(activeBranchId);
    setSelectedCustomer(draft.selectedCustomer);
    setCart(draft.cart);
    setPayments(
      Array.isArray(draft.payments) && draft.payments.length > 0
        ? draft.payments
        : defaultPayments,
    );
    setDraftHydrated(true);
  }, [activeBranchId, defaultPayments]);

  useEffect(() => {
    if (!activeBranchId || !draftHydrated) return;
    useSaleDraftStore.getState().setDraft(activeBranchId, {
      selectedCustomer,
      cart,
      payments,
    });
  }, [activeBranchId, draftHydrated, selectedCustomer, cart, payments]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchWaStatus = async () => {
      try {

        const branchId = activeBranchId || user?.branch_id;
        const url = branchId
          ? `/whatsapp/status?branch_id=${branchId}`
          : "/whatsapp/status";
        const res = await api.get(url, { signal: abortController.signal });
        if (isMounted) {
          const d = res.data?.data || {};
          setWaConnected(
            (d.status === "CONNECTED" || !!d.is_ready) &&
              d.invoice_enabled !== false,
          );
        }
      } catch {
        if (isMounted) {
          setWaConnected(false);
        }
      }
    };
    fetchWaStatus();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [activeBranchId, user?.branch_id]);

  useEffect(() => {
    if (itemInputRef.current) itemInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (!isPreviewOpen || !lastInvoice) return;

    let isMounted = true;
    const abortController = new AbortController();

    (async () => {
      try {

        const branchId =
          lastInvoice.branch_id || activeBranchId || user?.branch_id;
        const url = branchId
          ? `/whatsapp/status?branch_id=${branchId}`
          : "/whatsapp/status";
        const res = await api.get(url, { signal: abortController.signal });
        const d = res.data?.data || {};
        if (isMounted) {
          setWaConnected(
            (d.status === "CONNECTED" || !!d.is_ready) &&
              d.invoice_enabled !== false,
          );
        }
      } catch (err) {
        if (err.name !== "CanceledError" && isMounted) {
          setWaConnected(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [isPreviewOpen, lastInvoice, activeBranchId, user?.branch_id]);

  const addToCart = useCallback(
    (item) => {
      setCart((prev) => {
        if (prev.find((c) => c.id === item.id)) {
          toast.warning(t("item_already_in_cart"));
          setItemSearch("");
          return prev;
        }

        const pricePerMeter = parseFloat(item.price_per_meter) || 0;
        const stockLength = parseFloat(item.length_m ?? item.meters) || 0;
        const stockQty = Math.max(1, parseInt(item.quantity, 10) || 1);
        const availableMeters =
          Math.round(stockLength * stockQty * 1000) / 1000;

        if (!availableMeters || availableMeters <= 0) {
          toast.error(
            t("invalid_item_length") || "This fabric has no length recorded",
          );
          return prev;
        }
        if (!pricePerMeter || pricePerMeter <= 0) {
          toast.error(
            t("invalid_item_price") ||
              "Set a price per meter for this fabric first",
          );
          return prev;
        }

        const rollLength = parseFloat(item.roll_length_m) || 0;
        const meters =
          item.unit === "roll" && rollLength > 0
            ? Math.min(rollLength, availableMeters)
            : Math.min(1, availableMeters);

        const newItem = {
          ...item,
          cartQty: 1,
          meters,
          price_per_meter: pricePerMeter,
          discount: 0,
          total_price: +(meters * pricePerMeter).toFixed(3),
        };

        setItemSearch("");
        setShowItemDropdown(false);

        if (itemInputRef.current) {
          requestAnimationFrame(() => itemInputRef.current?.focus());
        }

        return [...prev, newItem];
      });
    },
    [t],
  );

  const updateCartItem = useCallback((id, field, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "cartQty") {
          const qty = value === "" ? 1 : Math.max(1, parseInt(value, 10) || 1);
          const updated = { ...item, cartQty: qty };
          updated.total_price = computeLineTotal(updated);
          return updated;
        }

        if (field === "total_price") {
          const meters = Math.max(0, parseFloat(item.meters) || 0);
          const price = Math.max(0, parseFloat(item.price_per_meter) || 0);
          const qty = Math.max(1, parseInt(item.cartQty, 10) || 1);
          const gross = +(meters * price * qty).toFixed(3);
          const target = Math.min(Math.max(0, parseFloat(value) || 0), gross);
          return {
            ...item,
            discount: +(gross - target).toFixed(3),
            total_price: target,
          };
        }

        const numeric = parseFloat(value);
        const val = isNaN(numeric) || numeric < 0 ? 0 : numeric;
        const updated = { ...item, [field]: val };
        updated.total_price = computeLineTotal(updated);
        return updated;
      }),
    );
  }, []);

  const handleCameraScan = useCallback(() => {
    setIsScannerOpen(true);
  }, []);

  const handleScanSuccess = useCallback(
    async (barcode) => {
      const cleanBarcode = String(barcode || "").trim();
      setIsScannerOpen(false);
      if (!cleanBarcode) return;

      try {
        const res = await api.get(
          `/inventory/barcode/${encodeURIComponent(cleanBarcode)}`,
        );
        const found = res.data?.data || res.data;
        if (!found || !found.id) {
          toast.error(t("item_not_found") || "Item not found");
          return;
        }
        if (found.status && found.status !== "In Stock") {
          toast.warning(t("out_of_stock") || "Item is out of stock");
          return;
        }
        addToCart(found);
        setItemSearch("");
        setShowItemDropdown(false);
      } catch (err) {
        if (err?.response?.status === 404) {
          toast.error(t("item_not_found") || "Item not found");
        } else {
          toast.error(
            err?.response?.data?.message ||
              t("item_not_found") ||
              "Item not found",
          );
        }
        setItemSearch("");
      } finally {
        if (itemInputRef.current) {
          itemInputRef.current.focus();
        }
      }
    },
    [addToCart, t],
  );

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const {
    grandTotal,
    totalPaid,
    remaining,
    addPaymentMethod,
    updatePayment,
    removePayment,
    resetPaymentTracking,
  } = useSalesPayments({ cart, payments, setPayments });

  const handleSubmitSale = async () => {
    if (!selectedCustomer) return toast.warning(t("select_customer_first"));
    if (cart.length === 0) return toast.warning(t("cart_empty"));

    const actualGrandTotal = cart.reduce((acc, item) => {
      const lineTotal = parseFloat(item.total_price) || 0;
      return acc + lineTotal;
    }, 0);

    const actualTotalPaid = payments
      .filter((p) => parseFloat(p.amount) > 0)
      .reduce((acc, p) => {
        const amount = parseFloat(p.amount) || 0;
        return acc + amount;
      }, 0);

    const exceedsStock = cart.some((i) => {
      const qty = Math.max(1, parseInt(i.cartQty, 10) || 1);
      const parsedStock = parseInt(i.quantity, 10);
      const stock = Number.isFinite(parsedStock) ? parsedStock : 1;
      const requestedMeters = (parseFloat(i.meters) || 0) * qty;
      const availableMeters = (parseFloat(i.length_m) || 0) * stock;
      if (stock > 0 && qty > stock && availableMeters > 0 && requestedMeters > availableMeters + 0.001) {
        return true;
      }
      if (availableMeters > 0 && requestedMeters > availableMeters + 0.001) {
        return true;
      }
      return false;
    });
    if (exceedsStock) {
      return toast.error(
        t("quantity_exceeds_stock") ||
          "Requested meters or quantity exceeds available stock for one or more items.",
      );
    }

    const actualRemaining = actualGrandTotal - actualTotalPaid;

    if (Math.abs(actualRemaining) > 0.05) {
      return toast.error(t("payment_mismatch"));
    }

    const hasInvalidAmounts = payments.some((p) => {
      const amount = parseFloat(p.amount);
      return isNaN(amount) || amount < 0;
    });
    if (hasInvalidAmounts) {
      return toast.error(
        t("invalid_payment_amount") || "Invalid payment amounts",
      );
    }

    setIsLoading(true);

    const payload = {
      customer_id: selectedCustomer.id,
      branch_id: activeBranchId,
      items: cart.map((i) => ({
        id: i.id,
        meters: Math.max(0, parseFloat(i.meters) || 0),
        price_per_meter: Math.max(0, parseFloat(i.price_per_meter) || 0),
        discount: Math.max(0, parseFloat(i.discount) || 0),
        total_price: computeLineTotal(i),
        quantity: Math.max(1, parseInt(i.cartQty, 10) || 1),
      })),
      payments: payments
        .filter((p) => parseFloat(p.amount) > 0)
        .map((p) => ({
          method: p.method,
          amount: parseFloat(p.amount),
          reference: (p.reference || "").trim(),
        })),
      notes: "Point of Sale Transaction",
    };

    try {
      const responseData = await createSaleMutation.mutateAsync(payload);

      setLastInvoice(responseData.data?.invoice || responseData.invoice);
      setWaStep(null);
      setWaCustomPhone(
        responseData.data?.invoice?.customer?.phone ||
          responseData.invoice?.customer?.phone ||
          "",
      );
      setIsPreviewOpen(true);
      setCart([]);
      setPayments([{ method: "K-Net", amount: "", reference: "" }]);
      setSelectedCustomer(null);
      resetPaymentTracking();
      useSaleDraftStore.getState().clearDraft(activeBranchId);

    } catch { void 0; } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPDF = () =>
    openInvoicePdfInBrowser({ lastInvoice, t, setPrintPdfLoading });

  const handleSendWa = async (phone = null) => {
    if (!lastInvoice?.id) return;
    setWaSending(true);
    try {
      await sendInvoiceWhatsAppMutation.mutateAsync({
        id: lastInvoice.id,
        phone: phone != null ? phone : undefined,
      });
      setWaStep(null);
      setWaCustomPhone("");
    } catch { void 0; } finally {
      setWaSending(false);
    }
  };

  const handleSaveNewCustomer = async (e) => {
    e.preventDefault();
    try {
      setIsSavingCustomer(true);
      const customerData = {
        ...formData,
        branch_id: activeBranchId,
      };

      const res = await createCustomerMutation.mutateAsync(customerData);

      setSelectedCustomer(res.data || res);
      setIsFormOpen(false);
      setCustomerSearch("");

      setFormData({
        full_name: "",
        phone: "",
        gender: "M",
        address: "",
        type: "Regular",
        notes: "",
      });
    } catch { void 0; } finally {
      setIsSavingCustomer(false);
    }
  };

  const formatPrice = useCallback((price) => {
    if (price === null || price === undefined || price === "") return "--";
    const num = parseFloat(price);
    if (isNaN(num)) return "--";
    return num.toFixed(3);
  }, []);

  return (
    <div
      className={`sales-page sales-page--${theme}`}
      dir={i18n.language === "ar" || i18n.language === "fa" ? "rtl" : "ltr"}
    >
      <header className="sales-header">
        <div className="sales-header__title-group">
          <ShoppingCart size={28} className="sales-header__icon" />
          <h1 className="sales-header__title">{t("new_sale")}</h1>
        </div>
      </header>

      <div className="sales-grid">
        <div className="sales-grid__left">
          <ItemSelector
            itemSearch={itemSearch}
            setItemSearch={setItemSearch}
            inventoryList={inventoryList}
            showItemDropdown={showItemDropdown}
            onAddToCart={addToCart}
            onScanClick={handleCameraScan}
            onAddItemClick={() => setIsAddItemModalOpen(true)}
            onSearchFocus={() => setShowItemDropdown(true)}
            onSearchBlur={() =>
              setTimeout(() => setShowItemDropdown(false), 200)
            }
            itemInputRef={itemInputRef}
            theme={theme}
          />

          <Cart
            cart={cart}
            onUpdateItem={updateCartItem}
            onRemoveItem={removeFromCart}
            theme={theme}
          />
        </div>

        <div className="sales-grid__right">
          <CustomerSelector
            selectedCustomer={selectedCustomer}
            customerSearch={customerSearch}
            setCustomerSearch={setCustomerSearch}
            customersList={customersList}
            showCustDropdown={showCustDropdown}
            onSearchFocus={() => setShowCustDropdown(true)}
            onSearchBlur={() =>
              setTimeout(() => setShowCustDropdown(false), 200)
            }
            onSelectCustomer={(cust) => {
              setSelectedCustomer(cust);
              setCustomerSearch("");
            }}
            onClearCustomer={() => setSelectedCustomer(null)}
            onAddCustomer={() => setIsFormOpen(true)}
          />

          <PaymentForm
            grandTotal={grandTotal}
            totalPaid={totalPaid}
            remaining={remaining}
            payments={payments}
            onUpdatePayment={updatePayment}
            onAddPayment={addPaymentMethod}
            onRemovePayment={removePayment}
            formatPrice={formatPrice}
            theme={theme}
          />

          <button
            className="sales-btn sales-btn--large sales-btn--primary"
            disabled={
              Math.abs(remaining) > 0.01 || cart.length === 0 || isLoading
            }
            onClick={handleSubmitSale}
            aria-label={t("complete_sale") || "Complete sale"}
          >
            {isLoading ? (
              <>
                <Loader
                  className="sales-spin"
                  size={20}
                  style={{ marginRight: 8 }}
                />{" "}
                {t("processing")}
              </>
            ) : (
              <>
                <CheckCircle size={20} /> {t("complete_sale")}
              </>
            )}
          </button>
        </div>
      </div>

      <InvoicePreviewModal
        isOpen={isPreviewOpen}
        lastInvoice={lastInvoice}
        waConnected={waConnected}
        waStep={waStep}
        waCustomPhone={waCustomPhone}
        waSending={waSending}
        printPdfLoading={printPdfLoading}
        onClose={() => {
          setIsPreviewOpen(false);
          setWaStep(null);
          setWaCustomPhone(lastInvoice?.customer?.phone || "");
        }}
        onOpenPDF={handleOpenPDF}
        onSendWa={handleSendWa}
        onEditPhone={(phone) => {
          setWaCustomPhone(phone);
          setWaStep("input");
        }}
        onCancelEditPhone={() => {
          setWaStep(null);
          setWaCustomPhone(lastInvoice?.customer?.phone || "");
        }}
        theme={theme}
      />

      <CustomerFormModal
        isOpen={isFormOpen}
        formData={formData}
        setFormData={setFormData}
        isSaving={isSavingCustomer}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSaveNewCustomer}
        theme={theme}
      />

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        theme={theme}
      />

      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSuccess={() => {

          if (itemSearch.length > 1) { void 0; 

          }
        }}
        activeBranchId={activeBranchId}
      />
    </div>
  );
};

export default SalesPage;
