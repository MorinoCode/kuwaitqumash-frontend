import { useEffect, useMemo, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";

export const computeLineTotal = (item) => {
  const meters = Math.max(0, parseFloat(item.meters) || 0);
  const price = Math.max(0, parseFloat(item.price_per_meter) || 0);
  const qty = Math.max(1, parseInt(item.cartQty ?? item.quantity, 10) || 1);
  const discount = Math.max(0, parseFloat(item.discount) || 0);
  return Math.max(0, +(meters * price * qty - discount).toFixed(3));
};

export const useSalesPayments = ({ cart, payments, setPayments }) => {
  const paymentAmountInitialized = useRef(false);
  const lastGrandTotal = useRef(0);

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

  useEffect(() => {
    if (payments.length > 0 && grandTotal > 0) {
      const grandTotalChanged =
        Math.abs(lastGrandTotal.current - grandTotal) > 0.001;

      setPayments((prev) => {
        let hasChanges = false;
        const newPayments = [...prev];

        const currentTotalPaid = prev.reduce(
          (acc, p) => acc + (parseFloat(p.amount) || 0),
          0,
        );
        const diff = grandTotal - currentTotalPaid;

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
          if (newPayments.length === 1) {
            newPayments[0] = {
              ...newPayments[0],
              amount: grandTotal.toFixed(3),
            };
            hasChanges = true;
            lastGrandTotal.current = grandTotal;
          } else {
            if (
              diff > 0 &&
              (!newPayments[0].amount ||
                newPayments[0].amount === "" ||
                parseFloat(newPayments[0].amount) === 0)
            ) {
              newPayments[0] = {
                ...newPayments[0],
                amount: diff.toFixed(3),
              };
              hasChanges = true;
            } else if (diff < -0.0005) {
              let excess = -diff;
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
  }, [grandTotal, cart.length, payments.length, setPayments]);

  const addPaymentMethod = useCallback(() => {
    setPayments((prev) => {
      const newPayment = { method: "K-Net", amount: "", reference: "" };
      const currentTotalPaid = prev.reduce(
        (acc, p) => acc + (parseFloat(p.amount) || 0),
        0,
      );
      const diff = grandTotal - currentTotalPaid;
      if (diff > 0) {
        newPayment.amount = diff.toFixed(3);
      }
      return [...prev, newPayment];
    });
  }, [grandTotal, setPayments]);

  const updatePayment = useCallback(
    (index, field, value) => {
      setPayments((prev) => {
        const newPayments = [...prev];

        if (field === "amount") {
          const numValue = parseFloat(value);
          const validatedValue = isNaN(numValue) || numValue < 0 ? "" : value;
          const updatedPayment = {
            ...newPayments[index],
            [field]: validatedValue,
          };

          if (
            !validatedValue ||
            validatedValue === "" ||
            parseFloat(validatedValue) === 0
          ) {
            const currentTotalPaid = newPayments.reduce((acc, p, i) => {
              if (i === index) return acc;
              return acc + (parseFloat(p.amount) || 0);
            }, 0);
            const diff = grandTotal - currentTotalPaid;
            if (diff > 0) {
              updatedPayment.amount = diff.toFixed(3);
            }
          }
          newPayments[index] = updatedPayment;
        } else if (field === "method") {
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
            const diff = grandTotal - currentTotalPaid;
            if (diff > 0) {
              currentPayment.amount = diff.toFixed(3);
            }
          }
          newPayments[index] = currentPayment;
        } else {
          newPayments[index] = { ...newPayments[index], [field]: value };
        }
        return newPayments;
      });
    },
    [grandTotal, setPayments],
  );

  const removePayment = useCallback(
    (index) => {
      setPayments((prev) => prev.filter((_, i) => i !== index));
    },
    [setPayments],
  );

  const resetPaymentTracking = useCallback(() => {
    paymentAmountInitialized.current = false;
  }, []);

  return {
    grandTotal,
    totalPaid,
    remaining,
    addPaymentMethod,
    updatePayment,
    removePayment,
    resetPaymentTracking,
  };
};

export const openInvoicePdfInBrowser = async ({
  lastInvoice,
  t,
  setPrintPdfLoading,
}) => {
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

    if (!res.data || res.data.size === 0) {
      throw new Error("Empty PDF response");
    }

    const contentType = res.headers["content-type"] || "";
    if (
      !contentType.includes("application/pdf") &&
      !contentType.includes("pdf")
    ) {
      try {
        const text = await res.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || "PDF generation failed");
      } catch {
        throw new Error("Invalid PDF response");
      }
    }

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const w = window.open(url, "_blank", "noopener");
    if (!w || w.closed) {
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
