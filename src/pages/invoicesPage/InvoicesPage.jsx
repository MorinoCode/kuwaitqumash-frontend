import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useBranchStore from "../../store/branchStore";
import useTenantStore from "../../store/tenantStore";
import { useInvoices, useSendInvoiceWhatsApp } from "../../hooks/useInvoices";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useBranches } from "../../hooks/useBranches";
import BranchSelector from "../../components/analytics/BranchSelector";
import Pagination from "../../components/pagination/Pagination";
import { OldInvoicesTab, ExportExcelModal } from "./OldInvoicesSection";
import { printThermalReceipt } from "../../utils/thermalPrint";
import "./InvoicesPage.css";
import {
  FileText,
  Search,
  Download,
  Calendar,
  X,
  Filter,
  MessageCircle,
  Loader,
  RotateCcw,
  Printer,
} from "lucide-react";

const InvoicesPage = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? "https://152.70.24.75.nip.io" : "http://localhost:5000");

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [excelLoading, setExcelLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [pdfLoadingId, setPdfLoadingId] = useState(null);
  const [thermalLoadingId, setThermalLoadingId] = useState(null);
  const [waLoadingId, setWaLoadingId] = useState(null);
  const [branchWaStatus, setBranchWaStatus] = useState({});
  const [waStep, setWaStep] = useState({});
  const [waCustomPhone, setWaCustomPhone] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { activeBranchId, activeBranchName } = useBranchStore();
  const isOwner = user?.role === "store_owner";

  const { data: branches = [], isLoading: branchesLoading } = useBranches();

  const branchesInitialized = useRef(false);
  useEffect(() => {

    if (branchesInitialized.current || branchesLoading) return;

    if (!isOwner && activeBranchId) {

      const activeId = parseInt(activeBranchId);
      if (!isNaN(activeId)) {
        setSelectedBranchIds([activeId]);
        branchesInitialized.current = true;
      }
    } else if (isOwner && branches.length > 0) {

      const branchIds = branches.map((b) => b.id);
      setSelectedBranchIds(branchIds);
      branchesInitialized.current = true;
    }
  }, [isOwner, activeBranchId, branches.length, branchesLoading, branches]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "active_branch_id" && e.newValue) {
        const activeId = parseInt(e.newValue);
        if (!isNaN(activeId)) {
          setSelectedBranchIds([activeId]);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleBranchChange = () => {
      const currentActiveBranchId = useBranchStore.getState().activeBranchId;
      if (currentActiveBranchId) {
        const activeId = parseInt(currentActiveBranchId);
        if (!isNaN(activeId)) {
          setSelectedBranchIds([activeId]);
        }
      }
    };

    window.addEventListener("branchChanged", handleBranchChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("branchChanged", handleBranchChange);
    };
  }, [isOwner]);

  const branchIdsKey = useMemo(
    () => [...selectedBranchIds].sort((a, b) => a - b).join(","),
    [selectedBranchIds],
  );

  const debouncedSearchTerm = useDebouncedValue(searchTerm, 300);

  const invoiceFilters = {
    branch_ids:
      isOwner && selectedBranchIds.length > 0
        ? selectedBranchIds.join(",")
        : undefined,
    branch_id: !isOwner ? activeBranchId : undefined,
    search: debouncedSearchTerm || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    page: pagination.currentPage,
    limit: 20,
  };

  const OLD_INVOICE_DAYS = 90;

  const oldInvoicesCutoff = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - OLD_INVOICE_DAYS);
    return cutoff.toISOString().split("T")[0];
  }, []);

  const [oldPage, setOldPage] = useState(1);

  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    refetch: refetchInvoices,
  } = useInvoices(invoiceFilters);

  const oldInvoiceFilters = {
    branch_ids: invoiceFilters.branch_ids,
    branch_id: invoiceFilters.branch_id,
    end_date: oldInvoicesCutoff,
    page: oldPage,
    limit: 20,
  };

  const { data: oldInvoicesData, isLoading: oldInvoicesLoading } =
    useInvoices(oldInvoiceFilters, { enabled: activeTab === "old" });

  const sendInvoiceWhatsAppMutation = useSendInvoiceWhatsApp();

  useEffect(() => {
    if (invoicesData) {
      setInvoices(invoicesData.data || []);
      setLoading(invoicesLoading);
      if (invoicesData.pagination) {
        setPagination(invoicesData.pagination);
      }
    } else {
      setInvoices([]);
      setLoading(invoicesLoading);
    }
  }, [invoicesData, invoicesLoading]);

  useEffect(() => {

    setPagination((prev) => {
      if (prev.currentPage === 1) return prev;
      return { ...prev, currentPage: 1 };
    });
  }, [branchIdsKey, searchTerm, startDate, endDate]);

  useEffect(() => {
    setOldPage(1);
  }, [branchIdsKey]);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchBranchWaStatuses = async () => {
      const branchIds = [
        ...new Set(
          (invoices || []).map((inv) => inv.branch_id).filter(Boolean),
        ),
      ];

      if (branchIds.length === 0) {
        setBranchWaStatus({});
        return;
      }

      try {
        const statusPromises = branchIds.map((branchId) =>
          api
            .get(`/whatsapp/status?branch_id=${branchId}`, {
              signal: abortController.signal,
            })
            .then((res) => {
              const d = res.data?.data || {};
              return {
                branchId,
                status:
                  (d.status === "CONNECTED" || !!d.is_ready) &&
                  d.invoice_enabled !== false,
              };
            })
            .catch(() => ({ branchId, status: false })),
        );

        const results = await Promise.all(statusPromises);

        if (!isMounted || abortController.signal.aborted) return;

        const statusMap = {};
        results.forEach(({ branchId, status }) => {
          statusMap[branchId] = status;
        });

        setBranchWaStatus(statusMap);
      } catch (err) {
        if (err.name !== "CanceledError" && isMounted) {

          const statusMap = {};
          branchIds.forEach((branchId) => {
            statusMap[branchId] = false;
          });
          setBranchWaStatus(statusMap);
        }
      }
    };

    if (invoices.length > 0) {
      fetchBranchWaStatuses();
    }

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [invoices]);

  const fetchInvoices = async (page = pagination.currentPage) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    refetchInvoices();
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    fetchInvoices(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Error bodies arrive as a Blob because this request asks for a binary response,
  // so the JSON message (for example the export row cap) has to be read out of it.
  const readBlobErrorMessage = async (err, fallback) => {
    const data = err?.response?.data;
    if (data instanceof Blob) {
      try {
        const text = await data.text();
        const parsed = JSON.parse(text);
        if (typeof parsed?.message === "string") return parsed.message;
        return fallback;
      } catch {
        return fallback;
      }
    }
    return typeof data?.message === "string" ? data.message : fallback;
  };

  const handleExportExcel = async () => {
    try {
      setExcelLoading(true);
      const params = new URLSearchParams();

      if (exportStartDate) {
        params.append("start_date", exportStartDate);
      }
      if (exportEndDate) {
        params.append("end_date", exportEndDate);
      }
      if (isOwner && selectedBranchIds.length > 0) {
        params.append("branch_ids", selectedBranchIds.join(","));
      }

      const response = await api.get(
        `/sales/report/excel?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      const dateStr =
        exportStartDate && exportEndDate
          ? `${exportStartDate}_to_${exportEndDate}`
          : exportStartDate
            ? `from_${exportStartDate}`
            : exportEndDate
              ? `until_${exportEndDate}`
              : "all";
      link.setAttribute(
        "download",
        `invoices-${dateStr}-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        t("excel_exported_successfully") || "Excel exported successfully",
      );
      setShowExportModal(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (err) {
      const fallback = t("excel_export_failed") || "Failed to export Excel";
      toast.error(await readBlobErrorMessage(err, fallback));
    } finally {
      setExcelLoading(false);
    }
  };

  const handleDownload = async (invoice) => {
    try {
      setPdfLoadingId(invoice.id);

      const response = await api.get(`/sales/invoices/${invoice.id}/pdf`, {
        responseType: "blob",
        params: { disposition: "inline" },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoice_number}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(
        t("pdf_downloaded_successfully") || "PDF downloaded successfully",
      );
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          t("pdf_download_failed") ||
          "Failed to download PDF",
      );
    } finally {
      setPdfLoadingId(null);
    }
  };

  const handleThermalPrint = async (invoice) => {
    if (!invoice?.id) return;
    try {
      setThermalLoadingId(invoice.id);
      let fullInvoice = invoice;
      if (!Array.isArray(invoice.items) || !Array.isArray(invoice.payments)) {
        const res = await api.get(`/sales/${invoice.id}`);
        fullInvoice = res.data?.data || res.data || invoice;
      }
      printThermalReceipt(fullInvoice, {
        lang: "ar",
        storeName:
          useTenantStore.getState().tenantName ||
          fullInvoice.branch?.name ||
          activeBranchName ||
          "",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          t("print_error") ||
          "Failed to load invoice for thermal printing",
      );
    } finally {
      setThermalLoadingId(null);
    }
  };

  const handleSendWhatsApp = async (invoice, phone = null) => {
    if (!invoice?.id) return;

    setWaLoadingId(invoice.id);

    try {
      await sendInvoiceWhatsAppMutation.mutateAsync({
        id: invoice.id,
        phone: phone || undefined,
      });
      setWaStep((prev) => ({ ...prev, [invoice.id]: null }));
      setWaCustomPhone((prev) => ({ ...prev, [invoice.id]: "" }));
    } catch { void 0; } finally {
      setWaLoadingId(null);
    }
  };

  const handleWaPhoneInput = (invoice) => {
    const customerPhone = invoice.customer?.phone || "";
    setWaCustomPhone((prev) => ({ ...prev, [invoice.id]: customerPhone }));
    setWaStep((prev) => ({ ...prev, [invoice.id]: "input" }));
  };

  const totalRevenue = (invoices || []).reduce((acc, curr) => {
    const amount = parseFloat(curr?.total_amount) || 0;
    return acc + (isNaN(amount) ? 0 : amount);
  }, 0);

  return (
    <div className={`invoices-page invoices-page--${theme}`}>
      <header className="invoices-header">
        <div className="invoices-header__titles">
          <h1 className="invoices-title">
            <FileText size={24} className="invoices-icon" /> {t("invoices")}
          </h1>
          {isOwner ? (
            <div className="invoices-branch-select">
              <BranchSelector
                branches={branches}
                selectedBranches={selectedBranchIds}
                onSelectionChange={setSelectedBranchIds}
              />
            </div>
          ) : (
            <p className="invoices-subtitle">{t("branch_invoices")}</p>
          )}
        </div>

        {activeTab === "current" && (
          <div className="invoices-stats">
            <div className="invoices-stat-box">
              <span>{t("total_invoices")}:</span>
              <strong>{invoices.length}</strong>
            </div>
            <div className="invoices-stat-box invoices-stat-box--brand">
              <span>{t("total_revenue")}:</span>
              <strong>
                {totalRevenue.toFixed(3)} {t("kwd")}
              </strong>
            </div>
          </div>
        )}
      </header>

      <div className="invoices-tabs">
        <button
          className={`invoices-tab ${activeTab === "current" ? "invoices-tab--active" : ""}`}
          onClick={() => setActiveTab("current")}
        >
          {t("Invoices") || "Invoices"}
        </button>
        <button
          className={`invoices-tab ${activeTab === "old" ? "invoices-tab--active" : ""}`}
          onClick={() => setActiveTab("old")}
        >
          {t("Old Invoices") || "Old Invoices"}
        </button>
      </div>

      {activeTab === "current" ? (
        <>
          <div className="invoices-controls">
            <div className="invoices-search">
              <Search size={18} className="invoices-search__icon" />
              <input
                className="invoices-search__input"
                placeholder={t("search_invoice_placeholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="invoices-filter">
              <Calendar size={18} className="invoices-filter__icon" />
              <input
                type="date"
                className="invoices-filter__input"
                placeholder={t("start_date") || "Start Date"}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={endDate || undefined}
              />
              <span className="invoices-filter__separator">-</span>
              <input
                type="date"
                className="invoices-filter__input"
                placeholder={t("end_date") || "End Date"}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || undefined}
              />
              {(startDate || endDate) && (
                <button
                  className="invoices-filter__clear"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              className="invoices-btn invoices-btn--export"
              onClick={() => setShowExportModal(true)}
              title={t("export_excel") || "Export to Excel"}
            >
              <Download size={18} />
              {t("export") || "Export"}
            </button>
          </div>

          <div className="invoices-table-container">
            <div className="invoices-table-wrapper">
              <table className="invoices-table">
                <thead className="invoices-table__head">
                  <tr>
                    <th>{t("invoice_no")}</th>
                    <th>{t("date")}</th>
                    <th>{t("customer")}</th>
                    <th>{t("total_amount")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody className="invoices-table__body">
                  {(invoices || []).map((inv) => (
                    <tr key={inv.id} className="invoices-row">
                      <td className="invoices-row__cell invoices-row__no" data-label={t("invoice_no")}>
                        {inv?.invoice_number || "--"}
                      </td>
                      <td className="invoices-row__cell" data-label={t("date")}>
                        {inv.createdAt ? (
                          <>
                            {new Date(inv.createdAt).toLocaleDateString()}
                            <small className="invoices-row__time">
                              {new Date(inv.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                          </>
                        ) : (
                          "--"
                        )}
                      </td>
                      <td className="invoices-row__cell invoices-row__customer" data-label={t("customer")}>
                        {inv.customer ? inv.customer.full_name : t("unknown")}
                      </td>
                      <td className="invoices-row__cell invoices-row__amount" data-label={t("total_amount")}>
                        {(parseFloat(inv?.total_amount) || 0).toFixed(3)}{" "}
                        {t("kwd")}
                      </td>
                      <td className="invoices-row__cell" data-label={t("actions")}>
                        <div className="invoices-actions">
                          {(inv.status === "Paid" ||
                            inv.status === "Partially Refunded") && (
                            <button
                              className="invoices-btn invoices-btn--refund"
                              onClick={() =>
                                navigate(`/refund?invoice=${inv.id}`)
                              }
                              title={t("refund") || "Refund"}
                            >
                              <RotateCcw size={16} />
                              {t("refund") || "Refund"}
                            </button>
                          )}
                          <button
                            className="invoices-btn invoices-btn--download"
                            onClick={() => handleDownload(inv)}
                            disabled={pdfLoadingId === inv.id}
                            title={t("download_pdf")}
                          >
                            {pdfLoadingId === inv.id ? (
                              <Loader size={16} className="spinner" />
                            ) : (
                              <Download size={16} />
                            )}{" "}
                            PDF
                          </button>
                          <button
                            type="button"
                            className="invoices-btn invoices-btn--thermal"
                            onClick={() => handleThermalPrint(inv)}
                            disabled={thermalLoadingId === inv.id}
                            title={t("print_thermal") || "Thermal 80mm"}
                          >
                            {thermalLoadingId === inv.id ? (
                              <Loader size={16} className="spinner" />
                            ) : (
                              <Printer size={16} />
                            )}
                            <span>80mm</span>
                          </button>

                          {branchWaStatus[inv.branch_id] && (
                            <>
                              {waStep[inv.id] === "input" ? (
                                <div className="invoices-wa-input-container">
                                  <input
                                    type="tel"
                                    className="invoices-wa-input"
                                    placeholder={
                                      t("phone_placeholder") ||
                                      "e.g. 96512345678"
                                    }
                                    value={waCustomPhone[inv.id] || ""}
                                    onChange={(e) =>
                                      setWaCustomPhone((prev) => ({
                                        ...prev,
                                        [inv.id]: e.target.value,
                                      }))
                                    }
                                    disabled={waLoadingId === inv.id}
                                  />
                                  <button
                                    className="invoices-btn invoices-btn--wa-send"
                                    onClick={() =>
                                      handleSendWhatsApp(
                                        inv,
                                        waCustomPhone[inv.id],
                                      )
                                    }
                                    disabled={
                                      waLoadingId === inv.id ||
                                      !waCustomPhone[inv.id]?.trim()
                                    }
                                  >
                                    {waLoadingId === inv.id ? (
                                      <Loader size={14} className="spinner" />
                                    ) : (
                                      <MessageCircle size={14} />
                                    )}
                                  </button>
                                  <button
                                    className="invoices-btn invoices-btn--wa-cancel"
                                    onClick={() => {
                                      setWaStep((prev) => ({
                                        ...prev,
                                        [inv.id]: null,
                                      }));
                                      setWaCustomPhone((prev) => ({
                                        ...prev,
                                        [inv.id]: "",
                                      }));
                                    }}
                                    disabled={waLoadingId === inv.id}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="invoices-btn invoices-btn--wa"
                                  onClick={() => handleWaPhoneInput(inv)}
                                  disabled={!branchWaStatus[inv.branch_id]}
                                  title={
                                    !branchWaStatus[inv.branch_id]
                                      ? t("wa_connect_first") ||
                                        "WhatsApp not connected"
                                      : t("send_whatsapp") ||
                                        "Send via WhatsApp"
                                  }
                                >
                                  <MessageCircle size={16} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && !loading && (
                    <tr>
                      <td colSpan="5" className="invoices-empty">
                        {t("no_invoices_found")}
                      </td>
                    </tr>
                  )}
                  {invoices.length > 0 &&
                    invoices.some((inv) => waStep[inv.id] === "input") && (
                      <tr>
                        <td colSpan="5" style={{ padding: "10px" }}>
                          <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
                            {t("whatsapp_input_hint") ||
                              "Enter phone number above to send invoice via WhatsApp"}
                          </div>
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>

          {!loading && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <OldInvoicesTab
          t={t}
          oldInvoiceDays={OLD_INVOICE_DAYS}
          oldInvoicesCutoff={oldInvoicesCutoff}
          oldInvoicesData={oldInvoicesData}
          oldInvoicesLoading={oldInvoicesLoading}
          pdfLoadingId={pdfLoadingId}
          thermalLoadingId={thermalLoadingId}
          onDownload={handleDownload}
          onThermalPrint={handleThermalPrint}
          onPageChange={(page) => {
            setOldPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      {showExportModal && (
        <ExportExcelModal
          t={t}
          theme={theme}
          isOwner={isOwner}
          selectedBranchIds={selectedBranchIds}
          excelLoading={excelLoading}
          exportStartDate={exportStartDate}
          setExportStartDate={setExportStartDate}
          exportEndDate={exportEndDate}
          setExportEndDate={setExportEndDate}
          onClose={(resetDates) => {
            setShowExportModal(false);
            if (resetDates) {
              setExportStartDate("");
              setExportEndDate("");
            }
          }}
          onExport={handleExportExcel}
        />
      )}
    </div>
  );
};

export default InvoicesPage;
