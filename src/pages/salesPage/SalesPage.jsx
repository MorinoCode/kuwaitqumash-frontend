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
  useUpdateCustomer,
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

// Stone helpers: 1 ct = 0.2 g
const stoneWeightToGrams = (stone) => {
  const w = parseFloat(stone?.weight) || 0;
  return stone?.unit === "ct" ? w * 0.2 : w;
};
const getStonesWeightG = (stones) => {
  if (!stones || !Array.isArray(stones)) return 0;
  return stones.reduce((sum, s) => sum + stoneWeightToGrams(s), 0);
};
const getStonesValue = (stones) => {
  if (!stones || !Array.isArray(stones)) return 0;
  return stones
    .filter((s) => s.has_value && s.value != null)
    .reduce((sum, s) => sum + (parseFloat(s.value) || 0), 0);
};

const SalesPage = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

  // Get activeBranchId first (before using it in hooks)
  const { activeBranchId } = useBranchStore();

  const [customerSearch, setCustomerSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");
  const [showCustDropdown, setShowCustDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  // Use React Query hooks
  const { data: customersData } = useCustomers({
    search: customerSearch.trim() ? customerSearch.trim() : undefined,
    branch_id: activeBranchId,
  });
  const customersList = customersData?.data || [];

  const { data: inventoryData } = useInventory({
    search: itemSearch.trim() ? itemSearch.trim() : undefined,
    branch_id: activeBranchId,
  });
  // Memoize filtered inventory list to avoid re-filtering on every render
  const inventoryList = useMemo(
    () => (inventoryData?.data || []).filter((i) => i.status === "In Stock"),
    [inventoryData?.data],
  );

  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();
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

  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);
  const itemInputRef = useRef(null);
  const paymentAmountInitialized = useRef(false);
  const lastGrandTotal = useRef(0);
  // Gold market feed removed: prices come from each inventory item (price_per_meter).
  const socketPrices = null;
  const apiRates = null;
  const liveRates = null;

  // Use mutation for creating sale
  const createSaleMutation = useCreateSale();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [idFiles, setIdFiles] = useState({ front: null, back: null });
  const newCustFrontRef = useRef(null);
  const newCustBackRef = useRef(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    civil_id: "",
    type: "Regular",
    notes: "",
    nationality: "Kuwaiti",
    gender: "M",
    address: "",
    birth_date: "",
    expiry_date: "",
  });

  // Restore draft from store when entering sales page or when branch changes
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

  // Persist draft to store when customer, cart, or payments change (after first hydration)
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
        // Check WhatsApp status for current branch
        const branchId = activeBranchId || user?.branch_id;
        const url = branchId
          ? `/whatsapp/status?branch_id=${branchId}`
          : "/whatsapp/status";
        const res = await api.get(url, { signal: abortController.signal });
        if (isMounted) {
          const d = res.data?.data || {};
          setWaConnected(d.status === "CONNECTED" || !!d.is_ready);
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
        // Check WhatsApp status for the invoice's branch
        const branchId =
          lastInvoice.branch_id || activeBranchId || user?.branch_id;
        const url = branchId
          ? `/whatsapp/status?branch_id=${branchId}`
          : "/whatsapp/status";
        const res = await api.get(url, { signal: abortController.signal });
        const d = res.data?.data || {};
        if (isMounted) {
          setWaConnected(d.status === "CONNECTED" || !!d.is_ready);
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

  // Customer dropdown: opened on focus, closed on blur or when customer selected

  // Dropdown visibility: opened on focus, closed on blur (or when item selected in addToCart)

  // Memoize gold rates calculation
  const goldRates = useMemo(
    () => socketPrices?.gold || liveRates?.Gold || {},
    [socketPrices?.gold, liveRates?.Gold],
  );
  const silverRate = useMemo(
    () =>
      socketPrices?.silver?.raw || liveRates?.Silver?.raw || liveRates?.Silver,
    [socketPrices?.silver, liveRates?.Silver],
  );
  const platinumRate = useMemo(
    () =>
      socketPrices?.platinum?.raw ||
      liveRates?.Platinum?.raw ||
      liveRates?.Platinum?.pure_950,
    [socketPrices?.platinum, liveRates?.Platinum],
  );

  const addToCart = useCallback(
    (item) => {
      // Check if item already exists in cart using functional update to get latest state
      setCart((prev) => {
        // Check if item already exists in the current cart state
        if (prev.find((c) => c.id === item.id)) {
          toast.warning(t("item_already_in_cart"));
          setItemSearch("");
          return prev; // Return previous state unchanged
        }

        let pricePerGram = 0;
        // Use memoized rates for better performance (already computed)

        if (item.metal_type === "Gold" && item.karat) {
          const karatKey = `karat${item.karat}`;
          pricePerGram =
            goldRates[karatKey] ||
            goldRates[`${item.karat}K`] ||
            goldRates.karat21 ||
            goldRates["21K"] ||
            0;
        } else if (item.metal_type === "Silver") {
          pricePerGram = silverRate || 0;
        } else if (item.metal_type === "Platinum") {
          pricePerGram = platinumRate || 0;
        } else if (item.metal_type === "Diamond") {
          // Diamond uses buy_price_per_gram as default
          pricePerGram = parseFloat(item.buy_price_per_gram) || 0;
        }

        const totalWeight = parseFloat(item.weight) || 0;
        const stones = item.stones || [];
        const stonesWeightG = getStonesWeightG(stones);
        const netGoldWeight = Math.max(0, totalWeight - stonesWeightG);
        const stonesValue = getStonesValue(stones);
        const initialTotal = netGoldWeight * pricePerGram + stonesValue;

        // Validate item before adding to cart
        if (!totalWeight || totalWeight <= 0) {
          toast.error(t("invalid_item_weight") || "Item weight is invalid");
          return prev; // Return previous state unchanged
        }

        const newItem = {
          ...item,
          cartQty: 1,
          weight: totalWeight,
          labor_cost: 0,
          price_per_gram: pricePerGram,
          stones,
          stones_value: stonesValue,
          total_price: initialTotal > 0 ? initialTotal : 0,
        };

        setItemSearch("");
        setShowItemDropdown(false);

        if (itemInputRef.current) {
          // Use requestAnimationFrame for better performance
          requestAnimationFrame(() => {
            if (itemInputRef.current) {
              itemInputRef.current.focus();
            }
          });
        }

        return [...prev, newItem]; // Return new state with item added
      });
    },
    [goldRates, silverRate, platinumRate, t],
  );

  // Handle camera barcode scan
  const handleCameraScan = useCallback(() => {
    setIsScannerOpen(true);
  }, []);

  const handleScanSuccess = useCallback(
    async (barcode) => {
      setItemSearch(barcode);
      setIsScannerOpen(false);

      // Focus input after scan
      if (itemInputRef.current) {
        itemInputRef.current.focus();
      }

      // Inventory search will be handled by useInventory hook automatically
      // Use requestAnimationFrame + setTimeout for better performance
      requestAnimationFrame(() => {
        // Small delay to allow hook to fetch (reduced from 500ms to 300ms)
        setTimeout(() => {
          const foundItems = inventoryList.filter(
            (i) => i.barcode === barcode || i.barcode?.includes(barcode),
          );
          const exactMatch = foundItems.find((i) => i.barcode === barcode);

          if (exactMatch) {
            addToCart(exactMatch);
            setItemSearch("");
            setShowItemDropdown(false);
          } else if (foundItems.length === 1) {
            addToCart(foundItems[0]);
            setItemSearch("");
            setShowItemDropdown(false);
          } else if (foundItems.length > 1) {
            setShowItemDropdown(true);
            toast.info(t("multiple_items_found") || "Multiple items found");
          } else {
            toast.error(t("item_not_found") || "Item not found");
            setItemSearch("");
          }
        }, 300); // Reduced delay for better UX
      });
    },
    [addToCart, inventoryList, t],
  );

  // handleScan was unused and removed.

  const updateCartItem = useCallback((id, field, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const qty = Math.max(1, parseInt(item.cartQty, 10) || 1);

        if (field === "cartQty") {
          const newQty =
            value === "" ? 1 : Math.max(1, parseInt(value, 10) || 1);
          const updated = { ...item, cartQty: newQty };
          const totalWeight = parseFloat(updated.weight) || 0;
          const stonesWeightG = getStonesWeightG(updated.stones);
          const netGoldWeight = Math.max(0, totalWeight - stonesWeightG);
          const stonesVal =
            updated.stones_value ?? getStonesValue(updated.stones);
          const pricePerGram = Math.max(
            0,
            parseFloat(updated.price_per_gram) || 0,
          );
          const laborCostPerGram = Math.max(
            0,
            parseFloat(updated.labor_cost) || 0,
          );
          const unitTotal =
            netGoldWeight * pricePerGram +
            netGoldWeight * laborCostPerGram +
            stonesVal;
          updated.total_price = unitTotal * newQty;
          return updated;
        }

        if (field === "stones_value") {
          const numValue = parseFloat(value);
          const stonesVal = isNaN(numValue) || numValue < 0 ? 0 : numValue;
          const updated = { ...item, stones_value: stonesVal };
          const totalWeight = parseFloat(updated.weight) || 0;
          const stonesWeightG = getStonesWeightG(updated.stones);
          const netGoldWeight = Math.max(0, totalWeight - stonesWeightG);
          const pricePerGram = Math.max(
            0,
            parseFloat(updated.price_per_gram) || 0,
          );
          const laborCostPerGram = Math.max(
            0,
            parseFloat(updated.labor_cost) || 0,
          );
          const unitTotal =
            netGoldWeight * pricePerGram +
            netGoldWeight * laborCostPerGram +
            stonesVal;
          updated.total_price = unitTotal * qty;
          return updated;
        }

        const numValue = parseFloat(value);
        const val = isNaN(numValue) || numValue < 0 ? 0 : numValue;
        const updated = { ...item, [field]: val };
        const totalWeight = parseFloat(updated.weight) || 0;
        const stonesWeightG = getStonesWeightG(updated.stones);
        const netGoldWeight = Math.max(0, totalWeight - stonesWeightG);
        const stonesVal =
          updated.stones_value ?? getStonesValue(updated.stones);
        const pricePerGram = Math.max(
          0,
          parseFloat(updated.price_per_gram) || 0,
        );
        const totalPrice = Math.max(0, parseFloat(updated.total_price) || 0);
        const laborCostPerGram = Math.max(
          0,
          parseFloat(updated.labor_cost) || 0,
        );
        const cartQty = Math.max(1, parseInt(updated.cartQty, 10) || 1);

        if (field === "weight") {
          if (totalWeight > 0) {
            const unitTotal =
              netGoldWeight * pricePerGram +
              netGoldWeight * laborCostPerGram +
              stonesVal;
            updated.total_price = unitTotal * cartQty;
          } else {
            updated.labor_cost = 0;
            updated.total_price = 0;
          }
        } else if (field === "total_price") {
          if (netGoldWeight > 0 && cartQty > 0) {
            const unitTotal = totalPrice / cartQty;
            const metalPart = netGoldWeight * pricePerGram;
            const stonePart = stonesVal;
            updated.labor_cost = Math.max(
              0,
              (unitTotal - metalPart - stonePart) / netGoldWeight,
            );
            updated.total_price = totalPrice;
          } else {
            updated.labor_cost = 0;
          }
        } else if (field === "price_per_gram" || field === "labor_cost") {
          if (netGoldWeight > 0 || stonesVal > 0) {
            const unitTotal =
              netGoldWeight * pricePerGram +
              netGoldWeight * laborCostPerGram +
              stonesVal;
            updated.total_price = unitTotal * cartQty;
          } else {
            updated.total_price = 0;
          }
        }

        return updated;
      }),
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // Memoize calculations: grandTotal = sum of line totals (total_price already includes quantity)
  const grandTotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const lineTotal = parseFloat(item.total_price) || 0;
        return acc + lineTotal;
      }, 0),
    [cart],
  );

  const totalPaid = useMemo(
    () => payments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0),
    [payments],
  );

  const remaining = useMemo(
    () => grandTotal - totalPaid,
    [grandTotal, totalPaid],
  );

  // Auto-fill payment amounts when grandTotal changes
  useEffect(() => {
    if (payments.length > 0 && grandTotal > 0) {
      const grandTotalChanged =
        Math.abs(lastGrandTotal.current - grandTotal) > 0.001;

      setPayments((prev) => {
        let hasChanges = false;
        const newPayments = [...prev];

        // Calculate current total paid
        const currentTotalPaid = prev.reduce(
          (acc, p) => acc + (parseFloat(p.amount) || 0),
          0,
        );
        const remaining = grandTotal - currentTotalPaid;

        // If this is the first time and first payment is empty, fill it with grandTotal
        if (!paymentAmountInitialized.current) {
          const firstPayment = newPayments[0];
          if (
            !firstPayment.amount ||
            firstPayment.amount === "" ||
            parseFloat(firstPayment.amount) === 0
          ) {
            newPayments[0] = {
              ...newPayments[0],
              amount: grandTotal.toFixed(3),
            };
            hasChanges = true;
            paymentAmountInitialized.current = true;
            lastGrandTotal.current = grandTotal;
          } else {
            paymentAmountInitialized.current = true;
            lastGrandTotal.current = grandTotal;
          }
        } else if (grandTotalChanged) {
          // If grandTotal changed, update first payment amount to match grandTotal
          // Only if there's a single payment
          if (newPayments.length === 1) {
            // If only one payment exists, sync it with grandTotal
            newPayments[0] = {
              ...newPayments[0],
              amount: grandTotal.toFixed(3),
            };
            hasChanges = true;
            lastGrandTotal.current = grandTotal;
          } else {
            // If multiple payments exist, only update if first payment is empty
            if (
              remaining > 0 &&
              (!newPayments[0].amount ||
                newPayments[0].amount === "" ||
                parseFloat(newPayments[0].amount) === 0)
            ) {
              newPayments[0] = {
                ...newPayments[0],
                amount: remaining.toFixed(3),
              };
              hasChanges = true;
            } else if (remaining < -0.0005) {
              // grandTotal dropped below total paid (e.g. an item was removed):
              // trim the excess from the last payment rows so Paid/Balance reconcile.
              let excess = -remaining;
              for (
                let i = newPayments.length - 1;
                i >= 0 && excess > 0.0005;
                i--
              ) {
                const amt = parseFloat(newPayments[i].amount) || 0;
                const reduce = Math.min(amt, excess);
                if (reduce > 0) {
                  const next = amt - reduce;
                  newPayments[i] = {
                    ...newPayments[i],
                    amount: next > 0.0005 ? next.toFixed(3) : "",
                  };
                  excess -= reduce;
                  hasChanges = true;
                }
              }
            }
            lastGrandTotal.current = grandTotal;
          }
        }

        return hasChanges ? newPayments : prev;
      });
    }
    // Reset when cart is cleared: there is nothing to pay, so clear any
    // previously auto-filled amount instead of leaving stale Paid/Balance values.
    if (cart.length === 0) {
      paymentAmountInitialized.current = false;
      lastGrandTotal.current = 0;
      setPayments((prev) => {
        const isAlreadyEmptyDefault =
          prev.length === 1 && (!prev[0].amount || prev[0].amount === "");
        if (isAlreadyEmptyDefault) return prev;
        return [
          { method: prev[0]?.method || "K-Net", amount: "", reference: "" },
        ];
      });
    }
  }, [grandTotal, cart.length, payments.length]);

  const addPaymentMethod = useCallback(() => {
    setPayments((prev) => {
      const newPayment = { method: "K-Net", amount: "", reference: "" };
      // Calculate remaining amount to auto-fill
      const currentTotalPaid = prev.reduce(
        (acc, p) => acc + (parseFloat(p.amount) || 0),
        0,
      );
      const remaining = grandTotal - currentTotalPaid;
      if (remaining > 0) {
        newPayment.amount = remaining.toFixed(3);
      }
      return [...prev, newPayment];
    });
  }, [grandTotal]);

  const updatePayment = useCallback(
    (index, field, value) => {
      setPayments((prev) => {
        const newPayments = [...prev];
        // Validate amount field - ensure it's not negative
        if (field === "amount") {
          const numValue = parseFloat(value);
          const validatedValue = isNaN(numValue) || numValue < 0 ? "" : value;
          const updatedPayment = {
            ...newPayments[index],
            [field]: validatedValue,
          };

          // If amount becomes empty or zero, auto-fill with remaining balance
          if (
            !validatedValue ||
            validatedValue === "" ||
            parseFloat(validatedValue) === 0
          ) {
            const currentTotalPaid = newPayments.reduce((acc, p, i) => {
              if (i === index) return acc;
              return acc + (parseFloat(p.amount) || 0);
            }, 0);
            const remaining = grandTotal - currentTotalPaid;
            if (remaining > 0) {
              updatedPayment.amount = remaining.toFixed(3);
            }
          }
          newPayments[index] = updatedPayment;
        } else if (field === "method") {
          // When method changes, auto-fill amount with remaining balance if amount is empty
          const currentPayment = { ...newPayments[index], [field]: value };
          if (
            !currentPayment.amount ||
            currentPayment.amount === "" ||
            parseFloat(currentPayment.amount) === 0
          ) {
            const currentTotalPaid = newPayments.reduce((acc, p, i) => {
              if (i === index) return acc;
              return acc + (parseFloat(p.amount) || 0);
            }, 0);
            const remaining = grandTotal - currentTotalPaid;
            if (remaining > 0) {
              currentPayment.amount = remaining.toFixed(3);
            }
          }
          newPayments[index] = currentPayment;
        } else {
          newPayments[index] = { ...newPayments[index], [field]: value };
        }
        return newPayments;
      });
    },
    [grandTotal],
  );

  const removePayment = useCallback((index) => {
    setPayments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleIdUpload = async (e, side) => {
    if (!selectedCustomer) return toast.warning(t("select_customer_first"));
    const file = e.target.files[0];
    if (!file) return;

    try {
      const customerData = {
        [side === "front" ? "front_image" : "back_image"]: file,
      };
      const res = await updateCustomerMutation.mutateAsync({
        id: selectedCustomer.id,
        data: customerData,
      });
      setSelectedCustomer(res.data || res);
    } catch {
      // Silently ignore customer select errors
    }
  };

  const handleSubmitSale = async () => {
    if (!selectedCustomer) return toast.warning(t("select_customer_first"));
    if (cart.length === 0) return toast.warning(t("cart_empty"));
    // Calculate actual grand total from cart items (same as grandTotal memo)
    const actualGrandTotal = cart.reduce((acc, item) => {
      const lineTotal = parseFloat(item.total_price) || 0;
      return acc + lineTotal;
    }, 0);

    // Calculate actual total paid
    const actualTotalPaid = payments
      .filter((p) => parseFloat(p.amount) > 0)
      .reduce((acc, p) => {
        const amount = parseFloat(p.amount) || 0;
        return acc + amount;
      }, 0);

    // Validate: no line quantity may exceed inventory stock
    const exceedsStock = cart.some((i) => {
      const qty = Math.max(1, parseInt(i.cartQty, 10) || 1);
      const stock = parseInt(i.quantity, 10) ?? 1;
      return stock > 0 && qty > stock;
    });
    if (exceedsStock) {
      return toast.error(
        t("quantity_exceeds_stock") ||
          "Quantity exceeds available stock for one or more items.",
      );
    }

    const actualRemaining = actualGrandTotal - actualTotalPaid;

    if (Math.abs(actualRemaining) > 0.05) {
      return toast.error(t("payment_mismatch"));
    }

    // Validation
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
      branch_id: activeBranchId, // Send active branch ID to backend
      items: cart.map((i) => {
        const weight = parseFloat(i.weight) || 0;
        const pricePerGram = parseFloat(i.price_per_gram) || 0;
        const laborCostPerGram = parseFloat(i.labor_cost) || 0;
        const qty = Math.max(1, parseInt(i.cartQty, 10) || 1);
        const totalPrice = parseFloat(i.total_price) || 0;

        return {
          id: i.id,
          weight,
          labor_cost: laborCostPerGram,
          price_per_gram: pricePerGram,
          total_price: totalPrice,
          quantity: qty,
          stones: i.stones || [],
          stones_value: i.stones_value ?? getStonesValue(i.stones),
        };
      }),
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
      paymentAmountInitialized.current = false; // Reset for next sale
      useSaleDraftStore.getState().clearDraft(activeBranchId);
      // Success toast is handled by mutation
    } catch {
      // Error is handled by mutation
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPDF = async () => {
    if (!lastInvoice?.id) {
      toast.warning(t("pdf_not_ready"));
      return;
    }
    setPrintPdfLoading(true);
    toast.info(t("pdf_opening") || "Opening PDF…");
    try {
      const res = await api.get(`/sales/invoices/${lastInvoice.id}/pdf`, {
        params: { disposition: "inline" },
        responseType: "blob",
      });

      // Validate that response is actually a PDF
      if (!res.data || res.data.size === 0) {
        throw new Error("Empty PDF response");
      }

      // Check content type
      const contentType = res.headers["content-type"] || "";
      if (
        !contentType.includes("application/pdf") &&
        !contentType.includes("pdf")
      ) {
        // Try to read error message if it's JSON
        try {
          const text = await res.data.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || "PDF generation failed");
        } catch {
          // Silently ignore blob read errors
          throw new Error("Invalid PDF response");
        }
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Try to open in new window
      const w = window.open(url, "_blank", "noopener");
      if (!w || w.closed) {
        // Popup blocked, download instead
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${
          lastInvoice.invoice_number || lastInvoice.id
        }.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success(
          t("pdf_download_instead") ||
            "Popup blocked; PDF downloaded. Open it to print.",
        );
      } else {
        // Cleanup blob URL after 60 seconds to prevent memory leaks
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 60000);
        toast.success(
          t("pdf_opened_print") ||
            "PDF opened in new tab. Use Ctrl+P to print.",
        );
      }
    } catch (err) {
      let errorMessage = t("pdf_generation_failed") || "Failed to generate PDF";

      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const j = JSON.parse(text);
          errorMessage = j.message || errorMessage;
        } catch {
          errorMessage = err.message || errorMessage;
        }
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    } finally {
      setPrintPdfLoading(false);
    }
  };

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
    } catch {
      // Silently ignore send errors - toast handled by mutation
    } finally {
      setWaSending(false);
    }
  };

  const handleNewFileSelect = async (e, side) => {
    const file = e.target.files[0];
    if (!file) return;

    setIdFiles((prev) => ({ ...prev, [side]: file }));
    await processOCR(file);
  };

  const processOCR = async (file) => {
    setIsScanning(true);
    const ocrFormData = new FormData();
    ocrFormData.append("image", file);

    try {
      const res = await api.post("/customers/scan", ocrFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        const data = res.data.data;
        setFormData((prev) => ({
          ...prev,
          civil_id: data.civil_id || prev.civil_id,
          full_name: data.full_name || prev.full_name,
          nationality: data.nationality || prev.nationality,
          gender: data.gender ? (data.gender === "F" ? "F" : "M") : prev.gender,
          birth_date: data.birth_date || prev.birth_date,
          expiry_date: data.expiry_date || prev.expiry_date,
          address: data.address || prev.address,
          notes: prev.notes + (prev.notes ? "\n" : "") + "[AI Scanned]",
        }));
        toast.success(t("id_scanned_success"));
      }
    } catch {
      toast.error(t("scan_failed"));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveNewCustomer = async (e) => {
    e.preventDefault();
    try {
      const customerData = {
        ...formData,
        branch_id: activeBranchId,
        front_image: idFiles.front,
        back_image: idFiles.back,
      };

      const res = await createCustomerMutation.mutateAsync(customerData);

      setSelectedCustomer(res.data || res);
      setIsFormOpen(false);
      setCustomerSearch("");

      setFormData({
        full_name: "",
        phone: "",
        civil_id: "",
        type: "Regular",
        notes: "",
        nationality: "Kuwaiti",
        gender: "M",
        address: "",
        birth_date: "",
        expiry_date: "",
      });
      setIdFiles({ front: null, back: null });
    } catch {
      // Silently ignore save errors
    }
  };

  // Format price helper - consistent number formatting
  const formatPrice = useCallback((price) => {
    if (price === null || price === undefined || price === "") return "--";
    const num = parseFloat(price);
    if (isNaN(num)) return "--";
    return num.toFixed(3);
  }, []);

  return (
    <div
      className={`sales-page sales-page--${theme}`}
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
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
            onIdUpload={handleIdUpload}
            frontInputRef={frontInputRef}
            backInputRef={backInputRef}
            theme={theme}
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
        idFiles={idFiles}
        isScanning={isScanning}
        newCustFrontRef={newCustFrontRef}
        newCustBackRef={newCustBackRef}
        onClose={() => setIsFormOpen(false)}
        onFileSelect={handleNewFileSelect}
        onSubmit={handleSaveNewCustomer}
        theme={theme}
      />
      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
        theme={theme}
      />

      {/* ADD ITEM MODAL */}
      <AddItemModal
        isOpen={isAddItemModalOpen}
        onClose={() => setIsAddItemModalOpen(false)}
        onSuccess={() => {
          // Refresh inventory list after adding item
          if (itemSearch.length > 1) {
            // Inventory search is handled by useInventory hook automatically
          }
        }}
        activeBranchId={activeBranchId}
      />
    </div>
  );
};

export default SalesPage;
