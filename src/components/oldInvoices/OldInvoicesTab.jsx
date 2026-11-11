import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import api from "../../api/axios";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useBranchStore from "../../store/branchStore";
import Pagination from "../pagination/Pagination";
import {
  useOldInvoices,
  useDeleteOldInvoice,
} from "../../hooks/useOldInvoices";
import {
  Upload,
  Search,
  Calendar,
  X,
  FileText,
  Trash2,
  Loader,
  Download,
  FileDown,
} from "lucide-react";
import "./OldInvoicesTab.css";

const OldInvoicesTab = ({ branches, selectedBranchIds }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user } = useAuth();
  const isOwner = user?.role === "store_owner";

  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const branchIdsKey = [...selectedBranchIds].sort((a, b) => a - b).join(",");

  // Use React Query for old invoices
  const oldInvoiceFilters = {
    branch_ids:
      selectedBranchIds.length > 0 ? selectedBranchIds.join(",") : undefined,
    search: searchTerm || undefined,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
    page: pagination.currentPage,
    limit: 20,
  };

  const {
    data: oldInvoicesData,
    isLoading: loading,
    refetch: refetchOldInvoices,
  } = useOldInvoices(oldInvoiceFilters);
  const oldInvoices = oldInvoicesData?.data || [];
  const deleteOldInvoiceMutation = useDeleteOldInvoice();

  // Update pagination from API response
  useEffect(() => {
    if (oldInvoicesData?.pagination) {
      setPagination(oldInvoicesData.pagination);
    }
  }, [oldInvoicesData]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [branchIdsKey, searchTerm, startDate, endDate]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
    // React Query will automatically refetch when pagination.currentPage changes
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
      ];
      const validExts = [".xlsx", ".xls", ".xlsm"];
      const fileExt = file.name
        .toLowerCase()
        .substring(file.name.lastIndexOf("."));

      if (!validTypes.includes(file.type) && !validExts.includes(fileExt)) {
        toast.error("Please select a valid Excel file (.xlsx, .xls)");
        return;
      }

      if (file.size > 50 * 1024 * 1024) {
        toast.error("File size must be less than 50MB");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("excel_file", selectedFile);

      // Always use active branch from localStorage (current branch)
      const activeBranchId = useBranchStore.getState().activeBranchId;
      if (activeBranchId) {
        formData.append("branch_id", activeBranchId);
      } else if (selectedBranchIds.length > 0) {
        // Fallback to selected branch if active branch not found
        formData.append("branch_id", selectedBranchIds[0]);
      }

      const res = await api.post("/sales/old-invoices/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imported = res.data.data?.imported || 0;
      const skipped = res.data.data?.skipped || 0;
      const errors = res.data.data?.errors || 0;

      if (imported > 0) {
        let message = `Successfully imported ${imported} invoice${
          imported > 1 ? "s" : ""
        }`;
        if (skipped > 0) {
          message += `, ${skipped} duplicate${skipped > 1 ? "s" : ""} skipped`;
        }
        toast.success(message);
      } else if (skipped > 0) {
        toast.info(
          `No new invoices imported. ${skipped} duplicate${
            skipped > 1 ? "s" : ""
          } found and skipped.`,
        );
      } else {
        toast.warning(
          "No invoices were imported. Please check the file format.",
        );
      }

      if (errors > 0) {
        toast.warning(
          `${errors} row${errors > 1 ? "s" : ""} had errors during import.`,
        );
      }

      if (res.data.data?.debug) {
        if (res.data.data.debug.columns_mapped.length === 0) {
          toast.error(
            "No columns were recognized. Please check your Excel file headers.",
          );
        }
      }

      setShowUploadModal(false);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetchOldInvoices();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to import invoices");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmMessage =
      t("Are you sure you want to delete this invoice?") ||
      "Are you sure you want to delete this invoice?";
    const confirmText = t("Delete") || "Delete";
    const cancelText = t("Cancel") || "Cancel";

    toast(
      ({ closeToast }) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "14px", fontWeight: "500" }}>
            {confirmMessage}
          </div>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <button
              onClick={() => {
                closeToast();
                handleConfirmDelete(id);
              }}
              style={{
                padding: "6px 16px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {confirmText}
            </button>
            <button
              onClick={closeToast}
              style={{
                padding: "6px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: "500",
              }}
            >
              {cancelText}
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        closeButton: true,
        draggable: true,
        style: {
          minWidth: "300px",
        },
      },
    );
  };

  const handleConfirmDelete = async (id) => {
    try {
      await deleteOldInvoiceMutation.mutateAsync(id);
      // Old invoices will be refetched automatically by React Query
    } catch {
      // Silently ignore delete errors
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleDownloadPDF = async (invoiceId, invoiceNumber) => {
    try {
      const res = await api.get(`/sales/old-invoices/${invoiceId}/pdf`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `old-invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success(
        t("PDF downloaded successfully") || "PDF downloaded successfully",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download PDF");
    }
  };

  const handleExportExcel = async () => {
    try {
      setExporting(true);
      const params = new URLSearchParams();

      if (exportStartDate) {
        params.append("start_date", exportStartDate);
      }
      if (exportEndDate) {
        params.append("end_date", exportEndDate);
      }
      if (selectedBranchIds.length > 0) {
        params.append("branch_ids", selectedBranchIds.join(","));
      }

      const res = await api.get(
        `/sales/old-invoices/export/excel?${params.toString()}`,
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;

      // Generate filename
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
        `old-invoices-${dateStr}-${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(
        t("Excel file downloaded successfully") ||
          "Excel file downloaded successfully",
      );
      setShowExportModal(false);
      setExportStartDate("");
      setExportEndDate("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to export Excel");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className={`old-invoices-tab old-invoices-tab--${theme}`}>
      <div className="old-invoices-header">
        <div className="old-invoices-header__info">
          <h3>{t("Old Invoices") || "Old Invoices"}</h3>
          <p className="old-invoices-subtitle">
            {t("Import and manage invoices from previous systems") ||
              "Import and manage invoices from previous systems"}
          </p>
        </div>
        <div className="old-invoices-header__actions">
          <button
            className={`old-invoices-export-btn old-invoices-export-btn--${theme}`}
            onClick={() => setShowExportModal(true)}
          >
            <FileDown size={18} />
            {t("Export Excel") || "Export Excel"}
          </button>
          <button
            className={`old-invoices-upload-btn old-invoices-upload-btn--${theme}`}
            onClick={() => setShowUploadModal(true)}
          >
            <Upload size={18} />
            {t("Upload Excel") || "Upload Excel"}
          </button>
        </div>
      </div>

      <div className="old-invoices-controls">
        <div className="old-invoices-search">
          <Search size={18} className="old-invoices-search__icon" />
          <input
            className="old-invoices-search__input"
            placeholder={
              t("Search by invoice number, customer name, phone...") ||
              "Search by invoice number, customer name, phone..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="old-invoices-filter">
          <Calendar size={18} className="old-invoices-filter__icon" />
          <input
            type="date"
            className="old-invoices-filter__input"
            placeholder={t("start_date") || "Start Date"}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={endDate || undefined}
          />
          <span className="old-invoices-filter__separator">-</span>
          <input
            type="date"
            className="old-invoices-filter__input"
            placeholder={t("end_date") || "End Date"}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
          />
          {(startDate || endDate) && (
            <button
              className="old-invoices-filter__clear"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="old-invoices-table-container">
        {loading ? (
          <div className="old-invoices-loading">
            <Loader size={24} className="spinner" />
            <p>{t("loading") || "Loading..."}</p>
          </div>
        ) : (
          <table className="old-invoices-table">
            <thead>
              <tr>
                <th>{t("Invoice Number") || "Invoice #"}</th>
                <th>{t("Date") || "Date"}</th>
                <th>{t("Customer") || "Customer"}</th>
                <th>{t("Phone") || "Phone"}</th>
                <th>{t("Amount") || "Amount"}</th>
                <th>{t("Actions") || "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {oldInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.invoice_number}</td>
                  <td>{formatDate(inv.invoice_date)}</td>
                  <td>{inv.customer_name || "-"}</td>
                  <td>{inv.customer_phone || "-"}</td>
                  <td>
                    {inv.total_amount
                      ? `${parseFloat(inv.total_amount).toFixed(3)} ${
                          t("kwd") || "KWD"
                        }`
                      : "-"}
                  </td>
                  <td>
                    <div className="old-invoices-actions">
                      <button
                        className="old-invoices-btn old-invoices-btn--pdf"
                        onClick={() =>
                          handleDownloadPDF(inv.id, inv.invoice_number)
                        }
                        title={t("Download PDF") || "Download PDF"}
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        className="old-invoices-btn old-invoices-btn--delete"
                        onClick={() => handleDelete(inv.id)}
                        title={t("Delete") || "Delete"}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {oldInvoices.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" className="old-invoices-empty">
                    {t(
                      "No old invoices found. Upload an Excel file to import.",
                    ) ||
                      "No old invoices found. Upload an Excel file to import."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="old-invoices-modal-overlay"
          onClick={() => !uploading && setShowUploadModal(false)}
        >
          <div
            className={`old-invoices-modal old-invoices-modal--${theme}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="old-invoices-modal__header">
              <h3>{t("Upload Excel File") || "Upload Excel File"}</h3>
              <button
                className="old-invoices-modal__close"
                onClick={() => !uploading && setShowUploadModal(false)}
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
            <div className="old-invoices-modal__body">
              <p className="old-invoices-modal__info">
                {t(
                  "Upload an Excel file (.xlsx, .xls) containing old invoice data. The system will automatically detect columns like Invoice Number, Customer Name, Date, Amount, etc.",
                ) ||
                  "Upload an Excel file (.xlsx, .xls) containing old invoice data. The system will automatically detect columns like Invoice Number, Customer Name, Date, Amount, etc."}
              </p>
              <div className="old-invoices-modal__file-input">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.xlsm"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
                {selectedFile && (
                  <div className="old-invoices-modal__file-info">
                    <FileText size={16} />
                    <span>{selectedFile.name}</span>
                    <span className="old-invoices-modal__file-size">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
              {isOwner && branches.length > 0 && (
                <div className="old-invoices-modal__branch-note">
                  <small>
                    {t(
                      "Note: If no branch is selected, invoices will be imported without branch assignment.",
                    ) ||
                      "Note: If no branch is selected, invoices will be imported without branch assignment."}
                  </small>
                </div>
              )}
            </div>
            <div className="old-invoices-modal__footer">
              <button
                className="old-invoices-modal__cancel"
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                className="old-invoices-modal__upload"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <Loader size={16} className="spinner" />
                    {t("Uploading...") || "Uploading..."}
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    {t("Upload") || "Upload"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Excel Modal */}
      {showExportModal && (
        <div
          className="old-invoices-modal-overlay"
          onClick={() => !exporting && setShowExportModal(false)}
        >
          <div
            className={`old-invoices-modal old-invoices-modal--${theme}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="old-invoices-modal__header">
              <h3>{t("export_to_excel") || "Export to Excel"}</h3>
              <button
                className="old-invoices-modal__close"
                onClick={() => !exporting && setShowExportModal(false)}
                disabled={exporting}
              >
                <X size={20} />
              </button>
            </div>
            <div className="old-invoices-modal__body">
              <p className="old-invoices-modal__info">
                {t(
                  "Select date range to export old invoices. Leave empty to export all invoices.",
                ) ||
                  "Select date range to export old invoices. Leave empty to export all invoices."}
              </p>
              <div className="old-invoices-modal__form-group">
                <label>{t("start_date") || "Start Date"}</label>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  disabled={exporting}
                />
              </div>
              <div className="old-invoices-modal__form-group">
                <label>{t("End Date") || "End Date"}</label>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  disabled={exporting}
                  min={exportStartDate || undefined}
                />
              </div>
              {selectedBranchIds.length > 0 && (
                <div className="old-invoices-modal__branch-note">
                  <small>
                    {`${
                      t("Exporting invoices from selected branch(es).") ||
                      "Exporting invoices from"
                    } ${selectedBranchIds.length} ${
                      t("selected branch(es)") || "selected branch(es)"
                    }.`}
                  </small>
                </div>
              )}
            </div>
            <div className="old-invoices-modal__footer">
              <button
                className="old-invoices-modal__cancel"
                onClick={() => setShowExportModal(false)}
                disabled={exporting}
              >
                {t("cancel") || "Cancel"}
              </button>
              <button
                className="old-invoices-modal__upload"
                onClick={handleExportExcel}
                disabled={exporting}
              >
                {exporting ? (
                  <>
                    <Loader size={16} className="spinner" />
                    {t("Exporting...") || "Exporting..."}
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    {t("Export") || "Export"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!loading && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default OldInvoicesTab;
